"""
提案モデル
"""
from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Text, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin
import enum


class ProposalStatus(str, enum.Enum):
    """提案ステータス"""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    ANALYZING = "analyzing"
    QA_PENDING = "qa_pending"
    QA_COMPLETED = "qa_completed"
    EVALUATED = "evaluated"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


class Proposal(Base, TimestampMixin):
    """提案"""
    __tablename__ = "proposals"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(ProposalStatus), default=ProposalStatus.DRAFT)
    
    # 関連ID
    supplier_org_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    supplier_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    buyer_config_id = Column(Integer, nullable=True)
    
    # AI抽出データ
    extracted_info = Column(JSON, nullable=True)
    
    # 消費ポイント
    points_used = Column(Integer, default=300)  # 1提案あたり300ポイント
    
    # リレーション
    supplier_org = relationship("Organization", back_populates="proposals")
    supplier = relationship("User", back_populates="proposals", foreign_keys=[supplier_user_id])
    documents = relationship("Document", back_populates="proposal")
    evaluation = relationship("Evaluation", back_populates="proposal", uselist=False)
    qa_sessions = relationship("QASession", back_populates="proposal")
    comments = relationship("Comment", back_populates="proposal")
    progress_history = relationship("ProposalProgress", back_populates="proposal")
