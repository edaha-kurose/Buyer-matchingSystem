"""
評価API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()


# スキーマ
class CategoryScore(BaseModel):
    category: str
    score: float
    weight: float
    detail: Optional[str]


class FactCheckItem(BaseModel):
    item: str
    result: str  # verified, warning, error
    detail: str


class EvaluationResponse(BaseModel):
    id: int
    proposal_id: int
    total_score: float
    category_scores: List[CategoryScore]
    trust_score: float
    trust_rank: str
    rank: str
    created_at: datetime


class EvaluationListResponse(BaseModel):
    items: List[EvaluationResponse]
    total: int


@router.get("/", response_model=EvaluationListResponse)
async def list_evaluations(
    rank: Optional[str] = None,
    min_score: Optional[float] = None
):
    """評価結果一覧"""
    # TODO: DB実装
    return {
        "items": [
            {
                "id": 1,
                "proposal_id": 1,
                "total_score": 87.5,
                "category_scores": [
                    {"category": "価格", "score": 85.0, "weight": 0.3, "detail": "市場価格より10%安い"},
                    {"category": "品質", "score": 90.0, "weight": 0.25, "detail": "ISO認証取得"},
                    {"category": "納期", "score": 80.0, "weight": 0.2, "detail": "標準納期"},
                    {"category": "実績", "score": 95.0, "weight": 0.15, "detail": "大手導入実績あり"},
                    {"category": "サポート", "score": 85.0, "weight": 0.1, "detail": "24時間対応"}
                ],
                "trust_score": 87.0,
                "trust_rank": "A",
                "rank": "candidate",
                "created_at": datetime.now()
            }
        ],
        "total": 1
    }


@router.get("/{evaluation_id}", response_model=EvaluationResponse)
async def get_evaluation(evaluation_id: int):
    """評価詳細取得"""
    # TODO: DB実装
    return {
        "id": evaluation_id,
        "proposal_id": 1,
        "total_score": 87.5,
        "category_scores": [
            {"category": "価格", "score": 85.0, "weight": 0.3, "detail": "市場価格より10%安い"}
        ],
        "trust_score": 87.0,
        "trust_rank": "A",
        "rank": "candidate",
        "created_at": datetime.now()
    }


@router.get("/{evaluation_id}/fact-check")
async def get_fact_check_results(evaluation_id: int):
    """ファクトチェック結果取得"""
    # TODO: DB実装
    return {
        "evaluation_id": evaluation_id,
        "trust_score": 87.0,
        "trust_rank": "A",
        "items": [
            {"item": "法人登記情報", "result": "verified", "detail": "法人番号確認済み"},
            {"item": "設立年（2015年）", "result": "verified", "detail": "登記情報と一致"},
            {"item": "30%コスト削減", "result": "verified", "detail": "比較条件が明確"},
            {"item": "導入実績3社", "result": "warning", "detail": "2社は確認済み、1社は未確認"},
            {"item": "特許取得", "result": "verified", "detail": "特許番号確認済み"}
        ]
    }


@router.post("/{evaluation_id}/decision")
async def make_decision(evaluation_id: int, decision: str):
    """採用判断"""
    if decision not in ["accept", "reject", "hold"]:
        raise HTTPException(status_code=400, detail="無効な判断です")
    
    # TODO: DB更新実装
    return {
        "message": "判断を記録しました",
        "evaluation_id": evaluation_id,
        "decision": decision
    }
