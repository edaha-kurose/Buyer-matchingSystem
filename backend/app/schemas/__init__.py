"""
Pydanticスキーマモジュール
APIリクエスト/レスポンスのスキーマ定義を集約
"""
from app.schemas.user import (
    UserCreate,
    UserResponse,
    UserUpdate,
    Token,
    TokenData,
)
from app.schemas.proposal import (
    ProposalCreate,
    ProposalResponse,
    ProposalListResponse,
    ProposalDetailResponse,
)
from app.schemas.common import (
    PaginationParams,
    PaginatedResponse,
    MessageResponse,
    ErrorResponse,
)

__all__ = [
    # User
    "UserCreate",
    "UserResponse",
    "UserUpdate",
    "Token",
    "TokenData",
    # Proposal
    "ProposalCreate",
    "ProposalResponse",
    "ProposalListResponse",
    "ProposalDetailResponse",
    # Common
    "PaginationParams",
    "PaginatedResponse",
    "MessageResponse",
    "ErrorResponse",
]
