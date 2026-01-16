"""
要約API
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()


# スキーマ
class KeyPoint(BaseModel):
    category: str
    point: str
    verification_status: str  # verified, warning, info
    detail: Optional[str]


class SummaryResponse(BaseModel):
    id: int
    proposal_id: int
    three_line_summary: str
    key_points: List[KeyPoint]
    trust_score: float
    trust_rank: str
    recommendation_rank: str
    confirmation_items: List[str]
    strengths: List[str]
    concerns: List[str]
    created_at: datetime


@router.get("/{proposal_id}", response_model=SummaryResponse)
async def get_summary(proposal_id: int):
    """要約レポート取得"""
    # TODO: DB実装・AI生成実装
    return {
        "id": 1,
        "proposal_id": proposal_id,
        "three_line_summary": (
            "製造現場向けIoTセンサーの提案。従来比30%のコスト削減を実現し、"
            "大手自動車メーカー3社への導入実績あり。"
            "最小ロット100個から対応可能で、納期は4週間。"
        ),
        "key_points": [
            {
                "category": "価格",
                "point": "従来製品比30%削減",
                "verification_status": "verified",
                "detail": "比較条件が明確で検証済み"
            },
            {
                "category": "品質",
                "point": "ISO9001認証取得",
                "verification_status": "verified",
                "detail": "認証番号確認済み"
            },
            {
                "category": "実績",
                "point": "大手3社導入",
                "verification_status": "warning",
                "detail": "2社は確認済み、1社は未確認"
            },
            {
                "category": "納期",
                "point": "4週間",
                "verification_status": "info",
                "detail": "繁忙期は要確認"
            },
            {
                "category": "サポート",
                "point": "24時間対応",
                "verification_status": "info",
                "detail": "対応範囲の詳細確認推奨"
            }
        ],
        "trust_score": 87.0,
        "trust_rank": "A",
        "recommendation_rank": "A",
        "confirmation_items": [
            "導入実績の未確認1社について具体的な情報を要求",
            "繁忙期の具体的な納期延長リスクを確認",
            "24時間サポートの具体的な対応範囲を確認"
        ],
        "strengths": [
            "価格競争力が高い（30%削減）",
            "品質認証取得済み",
            "大手企業への導入実績"
        ],
        "concerns": [
            "導入実績の一部が未確認",
            "繁忙期の納期リスク"
        ],
        "created_at": datetime.now()
    }


@router.post("/{proposal_id}/regenerate")
async def regenerate_summary(proposal_id: int):
    """要約再生成"""
    # TODO: AI再生成実装
    return {
        "message": "要約を再生成しました",
        "proposal_id": proposal_id
    }


@router.get("/{proposal_id}/export")
async def export_summary_pdf(proposal_id: int):
    """要約レポートPDF出力"""
    # TODO: PDF生成実装
    return {
        "message": "PDFを生成しました",
        "proposal_id": proposal_id,
        "download_url": f"/api/v1/summaries/{proposal_id}/download"
    }
