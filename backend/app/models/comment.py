"""
コメント・進捗管理モデル
バイヤーとサプライヤー間のコミュニケーション
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
from app.models.enums import ProposalStatus


class Comment(Base):
    """コメント"""
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    is_internal = Column(Boolean, default=False)  # 内部コメント（相手に非表示）
    parent_id = Column(Integer, ForeignKey("comments.id"))  # 返信元
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # リレーション
    proposal = relationship("Proposal", back_populates="comments")
    user = relationship("User", back_populates="comments")
    replies = relationship("Comment", back_populates="parent", remote_side=[id])
    parent = relationship("Comment", back_populates="replies", remote_side=[parent_id])


class ProposalProgress(Base):
    """提案進捗履歴"""
    __tablename__ = "proposal_progress"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"), nullable=False)
    status = Column(SQLEnum(ProposalStatus), nullable=False)
    changed_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    note = Column(Text)  # 進捗メモ
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # リレーション
    proposal = relationship("Proposal", back_populates="progress_history")
    user = relationship("User")


class Notification(Base):
    """通知"""
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    link = Column(String(500))  # 関連リンク
    is_read = Column(Boolean, default=False)
    notification_type = Column(String(50))  # comment, status_change, point, etc.
    reference_id = Column(Integer)  # 関連するオブジェクトID
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # リレーション
    user = relationship("User", back_populates="notifications")
