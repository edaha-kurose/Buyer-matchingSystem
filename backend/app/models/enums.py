"""
共通Enumモジュール
アプリケーション全体で使用するEnum定義を集約
"""
import enum


class ProposalStatus(str, enum.Enum):
    """提案ステータス"""
    DRAFT = "draft"                    # 下書き
    SUBMITTED = "submitted"            # 提出済み（AI処理待ち）
    ANALYZING = "analyzing"            # AI分析中
    QA_PENDING = "qa_pending"          # Q&A待ち
    QA_COMPLETED = "qa_completed"      # Q&A完了
    EVALUATED = "evaluated"            # AI評価完了
    UNDER_REVIEW = "under_review"      # バイヤー検討中
    MEETING_SCHEDULED = "meeting"      # 面談調整中
    ACCEPTED = "accepted"              # 採用
    REJECTED = "rejected"              # 不採用
    ON_HOLD = "on_hold"               # 保留


class TransactionType(str, enum.Enum):
    """ポイント取引タイプ"""
    PURCHASE = "purchase"              # ポイント購入
    PROPOSAL_SUBMIT = "proposal_submit"  # 提案提出
    REFUND = "refund"                  # 返金
    BONUS = "bonus"                    # ボーナス付与
    ADJUSTMENT = "adjustment"          # 調整


class NotificationType(str, enum.Enum):
    """通知タイプ"""
    COMMENT = "comment"                # コメント通知
    STATUS_CHANGE = "status_change"    # ステータス変更通知
    POINT = "point"                    # ポイント関連通知
    SYSTEM = "system"                  # システム通知
