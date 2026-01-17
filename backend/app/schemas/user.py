"""
ユーザー関連スキーマ
"""
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    """ユーザー登録リクエスト"""
    email: EmailStr
    password: str
    name: str
    role: str = "supplier"

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("パスワードは8文字以上必要です")
        if not any(c.isupper() for c in v):
            raise ValueError("パスワードには少なくとも1つの大文字が必要です")
        if not any(c.islower() for c in v):
            raise ValueError("パスワードには少なくとも1つの小文字が必要です")
        if not any(c.isdigit() for c in v):
            raise ValueError("パスワードには少なくとも1つの数字が必要です")
        return v

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        valid_roles = ["buyer", "supplier", "admin"]
        if v not in valid_roles:
            raise ValueError(f"roleは {valid_roles} のいずれかである必要があります")
        return v


class UserUpdate(BaseModel):
    """ユーザー更新リクエスト"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None


class UserResponse(BaseModel):
    """ユーザーレスポンス"""
    id: int
    email: str
    name: str
    role: str
    is_active: bool
    organization_id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    """トークンレスポンス"""
    access_token: str
    token_type: str
    user: UserResponse


class TokenData(BaseModel):
    """トークンデータ（JWT内部用）"""
    user_id: Optional[int] = None
