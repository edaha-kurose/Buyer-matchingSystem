"""
組織モデル
"""
from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin
import enum


class OrganizationType(str, enum.Enum):
    """組織タイプ"""
    BUYER = "buyer"
    SUPPLIER = "supplier"


class Organization(Base, TimestampMixin):
    """組織"""
    __tablename__ = "organizations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    type = Column(Enum(OrganizationType), nullable=False)
    industry = Column(String(100), nullable=True)
    description = Column(String(1000), nullable=True)
    website = Column(String(255), nullable=True)
    
    # リレーション
    members = relationship("User", back_populates="organization")
    proposals = relationship("Proposal", back_populates="supplier_org")
