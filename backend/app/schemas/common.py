"""
共通スキーマ
ページネーション、レスポンス形式など
"""
from pydantic import BaseModel, Field
from typing import Generic, TypeVar, List, Optional
from datetime import datetime

T = TypeVar("T")


class PaginationParams(BaseModel):
    """ページネーションパラメータ"""
    skip: int = Field(default=0, ge=0, description="スキップする件数")
    limit: int = Field(default=20, ge=1, le=100, description="取得件数（最大100）")


class PaginatedResponse(BaseModel, Generic[T]):
    """ページネーションレスポンス"""
    items: List[T]
    total: int
    skip: int
    limit: int
    has_more: bool


class MessageResponse(BaseModel):
    """メッセージレスポンス"""
    message: str
    success: bool = True


class ErrorResponse(BaseModel):
    """エラーレスポンス"""
    detail: str
    error_code: Optional[str] = None


class TimestampMixin(BaseModel):
    """タイムスタンプミックスイン"""
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
