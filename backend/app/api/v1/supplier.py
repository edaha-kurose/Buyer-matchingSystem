"""
サプライヤー向けAPI
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User, UserRole
from app.models.proposal import Proposal, ProposalStatus
from app.models.point import PointBalance, PointTransaction, TransactionType, PointPackage
from app.models.comment import Comment, ProposalProgress, Notification

router = APIRouter()

# ============ Schemas ============

class PointBalanceResponse(BaseModel):
    balance: int
    total_purchased: int
    total_used: int

    class Config:
        from_attributes = True


class PointTransactionResponse(BaseModel):
    id: int
    transaction_type: str
    amount: int
    balance_after: int
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class PointPackageResponse(BaseModel):
    id: int
    name: str
    points: int
    price: float
    bonus_points: int

    class Config:
        from_attributes = True


class SupplierProposalResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    points_used: int
    created_at: datetime
    updated_at: datetime
    buyer_name: Optional[str] = None
    ai_score: Optional[int] = None
    comment_count: int = 0

    class Config:
        from_attributes = True


class ProposalCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    buyer_config_id: Optional[int] = None


class CommentResponse(BaseModel):
    id: int
    content: str
    user_name: str
    user_role: str
    is_internal: bool
    created_at: datetime
    replies: List["CommentResponse"] = []

    class Config:
        from_attributes = True


class CommentCreateRequest(BaseModel):
    content: str
    parent_id: Optional[int] = None


class ProposalProgressResponse(BaseModel):
    id: int
    status: str
    note: Optional[str]
    changed_by_name: str
    created_at: datetime

    class Config:
        from_attributes = True


class DashboardStatsResponse(BaseModel):
    total_proposals: int
    active_proposals: int
    accepted_proposals: int
    rejected_proposals: int
    point_balance: int
    unread_notifications: int


class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    link: Optional[str]
    is_read: bool
    notification_type: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ============ Helper Functions ============

def require_supplier(user: User):
    """サプライヤーロールを要求"""
    if user.role != UserRole.SUPPLIER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Supplier access required"
        )


async def get_or_create_point_balance(db: AsyncSession, user_id: int) -> PointBalance:
    """ポイント残高を取得または作成"""
    result = await db.execute(
        select(PointBalance).where(PointBalance.user_id == user_id)
    )
    balance = result.scalar_one_or_none()
    
    if not balance:
        balance = PointBalance(user_id=user_id, balance=0)
        db.add(balance)
        await db.commit()
        await db.refresh(balance)
    
    return balance


# ============ Dashboard ============

@router.get("/dashboard", response_model=DashboardStatsResponse)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """サプライヤーダッシュボード統計"""
    require_supplier(current_user)
    
    # 提案統計
    proposals_result = await db.execute(
        select(
            func.count(Proposal.id).label("total"),
            func.sum(
                func.cast(Proposal.status.in_([
                    ProposalStatus.SUBMITTED,
                    ProposalStatus.ANALYZING,
                    ProposalStatus.QA_PENDING,
                    ProposalStatus.QA_COMPLETED,
                    ProposalStatus.EVALUATED
                ]), Integer)
            ).label("active"),
            func.sum(func.cast(Proposal.status == ProposalStatus.ACCEPTED, Integer)).label("accepted"),
            func.sum(func.cast(Proposal.status == ProposalStatus.REJECTED, Integer)).label("rejected")
        ).where(Proposal.supplier_user_id == current_user.id)
    )
    stats = proposals_result.first()
    
    # ポイント残高
    point_balance = await get_or_create_point_balance(db, current_user.id)
    
    # 未読通知数
    notif_result = await db.execute(
        select(func.count(Notification.id))
        .where(Notification.user_id == current_user.id)
        .where(Notification.is_read == False)
    )
    unread_count = notif_result.scalar() or 0
    
    return DashboardStatsResponse(
        total_proposals=stats.total or 0,
        active_proposals=stats.active or 0,
        accepted_proposals=stats.accepted or 0,
        rejected_proposals=stats.rejected or 0,
        point_balance=point_balance.balance,
        unread_notifications=unread_count
    )


# ============ Points ============

@router.get("/points/balance", response_model=PointBalanceResponse)
async def get_point_balance(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """ポイント残高取得"""
    require_supplier(current_user)
    balance = await get_or_create_point_balance(db, current_user.id)
    return balance


@router.get("/points/transactions", response_model=List[PointTransactionResponse])
async def get_point_transactions(
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """ポイント取引履歴"""
    require_supplier(current_user)
    
    balance = await get_or_create_point_balance(db, current_user.id)
    
    result = await db.execute(
        select(PointTransaction)
        .where(PointTransaction.point_balance_id == balance.id)
        .order_by(PointTransaction.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


@router.get("/points/packages", response_model=List[PointPackageResponse])
async def get_point_packages(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """購入可能なポイントパッケージ一覧"""
    require_supplier(current_user)
    
    result = await db.execute(
        select(PointPackage)
        .where(PointPackage.is_active == 1)
        .order_by(PointPackage.sort_order)
    )
    return result.scalars().all()


@router.post("/points/purchase/{package_id}")
async def purchase_points(
    package_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """ポイント購入（デモ: 実際の決済は省略）"""
    require_supplier(current_user)
    
    # パッケージ取得
    result = await db.execute(
        select(PointPackage).where(PointPackage.id == package_id)
    )
    package = result.scalar_one_or_none()
    
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    # ポイント残高取得
    balance = await get_or_create_point_balance(db, current_user.id)
    
    # ポイント付与
    total_points = package.points + package.bonus_points
    balance.balance += total_points
    balance.total_purchased += total_points
    
    # 取引履歴作成
    transaction = PointTransaction(
        point_balance_id=balance.id,
        transaction_type=TransactionType.PURCHASE,
        amount=total_points,
        balance_after=balance.balance,
        description=f"{package.name} ({package.points}pt + ボーナス{package.bonus_points}pt)",
        payment_id=f"demo-{datetime.utcnow().timestamp()}"
    )
    db.add(transaction)
    
    await db.commit()
    
    return {
        "success": True,
        "points_added": total_points,
        "new_balance": balance.balance
    }


# ============ Proposals ============

@router.get("/proposals", response_model=List[SupplierProposalResponse])
async def list_supplier_proposals(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """サプライヤーの提案一覧"""
    require_supplier(current_user)
    
    query = select(Proposal).where(Proposal.supplier_user_id == current_user.id)
    
    if status:
        query = query.where(Proposal.status == status)
    
    query = query.order_by(Proposal.created_at.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    proposals = result.scalars().all()
    
    # コメント数を追加
    response_list = []
    for p in proposals:
        comment_result = await db.execute(
            select(func.count(Comment.id)).where(Comment.proposal_id == p.id)
        )
        comment_count = comment_result.scalar() or 0
        
        response_list.append(SupplierProposalResponse(
            id=p.id,
            title=p.title,
            description=p.description,
            status=p.status.value,
            points_used=p.points_used or 300,
            created_at=p.created_at,
            updated_at=p.updated_at,
            comment_count=comment_count
        ))
    
    return response_list


@router.post("/proposals", response_model=SupplierProposalResponse)
async def create_proposal(
    request: ProposalCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """提案作成（下書き）"""
    require_supplier(current_user)
    
    proposal = Proposal(
        title=request.title,
        description=request.description,
        status=ProposalStatus.DRAFT,
        supplier_user_id=current_user.id,
        supplier_org_id=current_user.organization_id or 0,
        buyer_config_id=request.buyer_config_id,
        points_used=300
    )
    db.add(proposal)
    await db.commit()
    await db.refresh(proposal)
    
    return SupplierProposalResponse(
        id=proposal.id,
        title=proposal.title,
        description=proposal.description,
        status=proposal.status.value,
        points_used=proposal.points_used,
        created_at=proposal.created_at,
        updated_at=proposal.updated_at,
        comment_count=0
    )


@router.post("/proposals/{proposal_id}/submit")
async def submit_proposal(
    proposal_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """提案を提出（ポイント消費）"""
    require_supplier(current_user)
    
    # 提案取得
    result = await db.execute(
        select(Proposal)
        .where(Proposal.id == proposal_id)
        .where(Proposal.supplier_user_id == current_user.id)
    )
    proposal = result.scalar_one_or_none()
    
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    if proposal.status != ProposalStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Proposal already submitted")
    
    # ポイント確認
    balance = await get_or_create_point_balance(db, current_user.id)
    points_required = proposal.points_used or 300
    
    if balance.balance < points_required:
        raise HTTPException(
            status_code=400, 
            detail=f"Insufficient points. Required: {points_required}, Available: {balance.balance}"
        )
    
    # ポイント消費
    balance.balance -= points_required
    balance.total_used += points_required
    
    # 取引履歴
    transaction = PointTransaction(
        point_balance_id=balance.id,
        transaction_type=TransactionType.PROPOSAL_SUBMIT,
        amount=-points_required,
        balance_after=balance.balance,
        description=f"提案提出: {proposal.title}",
        reference_id=proposal.id
    )
    db.add(transaction)
    
    # ステータス更新
    proposal.status = ProposalStatus.SUBMITTED
    
    # 進捗履歴
    progress = ProposalProgress(
        proposal_id=proposal.id,
        status=ProposalStatus.SUBMITTED,
        changed_by=current_user.id,
        note="提案を提出しました"
    )
    db.add(progress)
    
    await db.commit()
    
    return {
        "success": True,
        "points_used": points_required,
        "remaining_balance": balance.balance,
        "status": "submitted"
    }


@router.get("/proposals/{proposal_id}")
async def get_proposal_detail(
    proposal_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """提案詳細取得"""
    require_supplier(current_user)
    
    result = await db.execute(
        select(Proposal)
        .where(Proposal.id == proposal_id)
        .where(Proposal.supplier_user_id == current_user.id)
    )
    proposal = result.scalar_one_or_none()
    
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    # 評価情報取得
    evaluation = None
    if proposal.evaluation:
        evaluation = {
            "overall_score": proposal.evaluation.overall_score,
            "ai_summary": proposal.evaluation.ai_summary,
            "reliability_rank": proposal.evaluation.reliability_rank
        }
    
    return {
        "id": proposal.id,
        "title": proposal.title,
        "description": proposal.description,
        "status": proposal.status.value,
        "points_used": proposal.points_used,
        "created_at": proposal.created_at,
        "updated_at": proposal.updated_at,
        "extracted_info": proposal.extracted_info,
        "evaluation": evaluation
    }


# ============ Comments ============

@router.get("/proposals/{proposal_id}/comments", response_model=List[CommentResponse])
async def get_proposal_comments(
    proposal_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """提案のコメント一覧"""
    require_supplier(current_user)
    
    # 権限確認
    proposal_result = await db.execute(
        select(Proposal)
        .where(Proposal.id == proposal_id)
        .where(Proposal.supplier_user_id == current_user.id)
    )
    if not proposal_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    # コメント取得（内部コメントは除外）
    result = await db.execute(
        select(Comment)
        .where(Comment.proposal_id == proposal_id)
        .where(Comment.parent_id == None)
        .where(Comment.is_internal == False)
        .order_by(Comment.created_at.desc())
    )
    comments = result.scalars().all()
    
    response_list = []
    for c in comments:
        user_result = await db.execute(select(User).where(User.id == c.user_id))
        user = user_result.scalar_one()
        
        response_list.append(CommentResponse(
            id=c.id,
            content=c.content,
            user_name=user.name,
            user_role=user.role.value,
            is_internal=c.is_internal,
            created_at=c.created_at,
            replies=[]  # TODO: 返信の取得
        ))
    
    return response_list


@router.post("/proposals/{proposal_id}/comments")
async def add_comment(
    proposal_id: int,
    request: CommentCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """コメント追加"""
    require_supplier(current_user)
    
    # 権限確認
    proposal_result = await db.execute(
        select(Proposal)
        .where(Proposal.id == proposal_id)
        .where(Proposal.supplier_user_id == current_user.id)
    )
    if not proposal_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    comment = Comment(
        proposal_id=proposal_id,
        user_id=current_user.id,
        content=request.content,
        parent_id=request.parent_id,
        is_internal=False
    )
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    
    return {"success": True, "comment_id": comment.id}


# ============ Progress ============

@router.get("/proposals/{proposal_id}/progress", response_model=List[ProposalProgressResponse])
async def get_proposal_progress(
    proposal_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """提案の進捗履歴"""
    require_supplier(current_user)
    
    # 権限確認
    proposal_result = await db.execute(
        select(Proposal)
        .where(Proposal.id == proposal_id)
        .where(Proposal.supplier_user_id == current_user.id)
    )
    if not proposal_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    result = await db.execute(
        select(ProposalProgress)
        .where(ProposalProgress.proposal_id == proposal_id)
        .order_by(ProposalProgress.created_at.desc())
    )
    progress_list = result.scalars().all()
    
    response_list = []
    for p in progress_list:
        user_result = await db.execute(select(User).where(User.id == p.changed_by))
        user = user_result.scalar_one()
        
        response_list.append(ProposalProgressResponse(
            id=p.id,
            status=p.status.value,
            note=p.note,
            changed_by_name=user.name,
            created_at=p.created_at
        ))
    
    return response_list


# ============ Notifications ============

@router.get("/notifications", response_model=List[NotificationResponse])
async def get_notifications(
    unread_only: bool = False,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """通知一覧"""
    require_supplier(current_user)
    
    query = select(Notification).where(Notification.user_id == current_user.id)
    
    if unread_only:
        query = query.where(Notification.is_read == False)
    
    query = query.order_by(Notification.created_at.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """通知を既読にする"""
    require_supplier(current_user)
    
    result = await db.execute(
        select(Notification)
        .where(Notification.id == notification_id)
        .where(Notification.user_id == current_user.id)
    )
    notification = result.scalar_one_or_none()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    await db.commit()
    
    return {"success": True}


@router.post("/notifications/read-all")
async def mark_all_notifications_read(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """全通知を既読にする"""
    require_supplier(current_user)
    
    from sqlalchemy import update
    
    await db.execute(
        update(Notification)
        .where(Notification.user_id == current_user.id)
        .where(Notification.is_read == False)
        .values(is_read=True)
    )
    await db.commit()
    
    return {"success": True}
