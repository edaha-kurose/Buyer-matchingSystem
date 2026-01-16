"""
提案API
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()


# スキーマ
class ProposalCreate(BaseModel):
    title: str
    description: Optional[str] = None


class ProposalResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    created_at: datetime
    supplier_name: Optional[str]


class ProposalListResponse(BaseModel):
    items: List[ProposalResponse]
    total: int
    page: int
    per_page: int


@router.get("/", response_model=ProposalListResponse)
async def list_proposals(
    page: int = 1,
    per_page: int = 20,
    status: Optional[str] = None,
    search: Optional[str] = None
):
    """提案一覧取得"""
    # TODO: DB実装
    return {
        "items": [
            {
                "id": 1,
                "title": "新型IoTセンサーの提案",
                "description": "製造現場向けIoTセンサーの提案です",
                "status": "submitted",
                "created_at": datetime.now(),
                "supplier_name": "ABC株式会社"
            }
        ],
        "total": 1,
        "page": page,
        "per_page": per_page
    }


@router.get("/{proposal_id}", response_model=ProposalResponse)
async def get_proposal(proposal_id: int):
    """提案詳細取得"""
    # TODO: DB実装
    return {
        "id": proposal_id,
        "title": "新型IoTセンサーの提案",
        "description": "製造現場向けIoTセンサーの提案です",
        "status": "submitted",
        "created_at": datetime.now(),
        "supplier_name": "ABC株式会社"
    }


@router.post("/", response_model=ProposalResponse)
async def create_proposal(proposal: ProposalCreate):
    """提案作成"""
    # TODO: DB実装
    return {
        "id": 1,
        "title": proposal.title,
        "description": proposal.description,
        "status": "draft",
        "created_at": datetime.now(),
        "supplier_name": "サプライヤー企業"
    }


@router.post("/{proposal_id}/upload")
async def upload_document(
    proposal_id: int,
    file: UploadFile = File(...),
    document_type: str = Form(default="main")
):
    """資料アップロード"""
    # TODO: ファイル保存・解析実装
    return {
        "message": "ファイルをアップロードしました",
        "proposal_id": proposal_id,
        "filename": file.filename,
        "document_type": document_type,
        "size": file.size
    }


@router.post("/{proposal_id}/submit")
async def submit_proposal(proposal_id: int):
    """提案提出"""
    # TODO: 提出処理・AI解析トリガー実装
    return {
        "message": "提案を提出しました",
        "proposal_id": proposal_id,
        "status": "submitted"
    }


@router.delete("/{proposal_id}")
async def delete_proposal(proposal_id: int):
    """提案削除"""
    # TODO: 削除実装
    return {"message": "提案を削除しました", "proposal_id": proposal_id}
