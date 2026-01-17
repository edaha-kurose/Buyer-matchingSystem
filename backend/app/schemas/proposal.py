"""
提案関連スキーマ
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.enums import ProposalStatus


class ProposalCreate(BaseModel):
    """提案作成リクエスト"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    buyer_config_id: Optional[int] = None


class ProposalUpdate(BaseModel):
    """提案更新リクエスト"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None


class ProposalResponse(BaseModel):
    """提案レスポンス（一覧用）"""
    id: int
    title: str
    description: Optional[str]
    status: str
    points_used: int
    created_at: datetime
    updated_at: datetime
    supplier_org_id: Optional[int] = None
    buyer_name: Optional[str] = None
    ai_score: Optional[int] = None
    comment_count: int = 0

    class Config:
        from_attributes = True


class ProposalListResponse(BaseModel):
    """提案一覧レスポンス"""
    items: List[ProposalResponse]
    total: int
    skip: int
    limit: int
    has_more: bool


class EvaluationResponse(BaseModel):
    """評価レスポンス"""
    overall_score: Optional[int] = None
    ai_summary: Optional[str] = None
    reliability_rank: Optional[str] = None
    category_scores: Optional[Dict[str, int]] = None


class ProposalDetailResponse(BaseModel):
    """提案詳細レスポンス"""
    id: int
    title: str
    description: Optional[str]
    status: str
    points_used: int
    created_at: datetime
    updated_at: datetime
    extracted_info: Optional[Dict[str, Any]] = None
    evaluation: Optional[EvaluationResponse] = None
    documents: List[Dict[str, Any]] = []

    class Config:
        from_attributes = True


class ProposalSubmitResponse(BaseModel):
    """提案提出レスポンス"""
    success: bool
    points_used: int
    remaining_balance: int
    status: str
