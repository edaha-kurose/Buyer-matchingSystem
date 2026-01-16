"""
評価モデル
"""
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum, Text, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin
import enum


class EvaluationRank(str, enum.Enum):
    """評価ランク"""
    CANDIDATE = "candidate"    # 採用候補
    CONSIDER = "consider"      # 検討
    HOLD = "hold"              # 保留
    REJECTED = "rejected"      # 不採用


class TrustRank(str, enum.Enum):
    """信頼度ランク"""
    A = "A"  # 高信頼
    B = "B"  # 中信頼
    C = "C"  # 低信頼
    D = "D"  # 要注意


class Evaluation(Base, TimestampMixin):
    """評価結果"""
    __tablename__ = "evaluations"
    
    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"), unique=True, nullable=False)
    
    # スコア
    total_score = Column(Float, nullable=True)
    category_scores = Column(JSON, nullable=True)  # カテゴリ別スコア
    
    # ファクトチェック
    trust_score = Column(Float, nullable=True)
    trust_rank = Column(Enum(TrustRank), nullable=True)
    fact_check_results = Column(JSON, nullable=True)
    
    # 評価結果
    rank = Column(Enum(EvaluationRank), nullable=True)
    
    # 要約
    summary = Column(Text, nullable=True)
    key_points = Column(JSON, nullable=True)
    confirmation_items = Column(JSON, nullable=True)
    
    # リレーション
    proposal = relationship("Proposal", back_populates="evaluation")
