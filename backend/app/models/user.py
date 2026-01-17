"""
ユーザーモデル
"""
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin
import enum


class UserRole(str, enum.Enum):
    """ユーザー権限"""
    ADMIN = "admin"
    BUYER = "buyer"
    SUPPLIER = "supplier"


class User(Base, TimestampMixin):
    """ユーザー"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.SUPPLIER, nullable=False)
    is_active = Column(Boolean, default=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    
    # リレーション
    organization = relationship("Organization", back_populates="members")
    proposals = relationship("Proposal", back_populates="supplier", foreign_keys="Proposal.supplier_id")
    point_balance = relationship("PointBalance", back_populates="user", uselist=False)
    comments = relationship("Comment", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
