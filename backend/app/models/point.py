"""
ポイントシステムモデル
サプライヤーの提案に使用するポイント管理
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
import enum


class TransactionType(str, enum.Enum):
    """ポイント取引タイプ"""
    PURCHASE = "purchase"          # ポイント購入
    PROPOSAL_SUBMIT = "proposal"   # 提案提出（消費）
    REFUND = "refund"              # 返金
    BONUS = "bonus"                # ボーナス付与
    EXPIRED = "expired"            # 期限切れ


class PointBalance(Base):
    """ポイント残高"""
    __tablename__ = "point_balances"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    balance = Column(Integer, default=0, nullable=False)  # 現在のポイント残高
    total_purchased = Column(Integer, default=0)  # 累計購入ポイント
    total_used = Column(Integer, default=0)       # 累計使用ポイント
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # リレーション
    user = relationship("User", back_populates="point_balance")
    transactions = relationship("PointTransaction", back_populates="point_balance")


class PointTransaction(Base):
    """ポイント取引履歴"""
    __tablename__ = "point_transactions"

    id = Column(Integer, primary_key=True, index=True)
    point_balance_id = Column(Integer, ForeignKey("point_balances.id"), nullable=False)
    transaction_type = Column(SQLEnum(TransactionType), nullable=False)
    amount = Column(Integer, nullable=False)  # + for credit, - for debit
    balance_after = Column(Integer, nullable=False)  # 取引後の残高
    description = Column(String(255))
    reference_id = Column(Integer)  # 関連する提案IDなど
    payment_id = Column(String(100))  # 決済ID（購入時）
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # リレーション
    point_balance = relationship("PointBalance", back_populates="transactions")


class PointPackage(Base):
    """ポイントパッケージ（購入プラン）"""
    __tablename__ = "point_packages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    points = Column(Integer, nullable=False)       # 付与ポイント
    price = Column(Numeric(10, 2), nullable=False) # 価格（円）
    bonus_points = Column(Integer, default=0)      # ボーナスポイント
    is_active = Column(Integer, default=1)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
