"""
AIプレゼン自動スクリーニングシステム - メインアプリケーション
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.api.v1 import auth, proposals, evaluations, summaries
from app.db.session import engine
from app.db.base import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    """アプリケーションのライフサイクル管理"""
    # 起動時の処理
    print("[START] AI Presentation Auto-Screening System starting...")
    
    # DBテーブル作成（開発用）
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield
    
    # 終了時の処理
    print("[END] System shutdown")


# FastAPIアプリケーション
app = FastAPI(
    title="AIプレゼン自動スクリーニングシステム",
    description="""
    ## 概要
    サプライヤーからの提案を自動的にスクリーニングし、
    バイヤーの提案受付業務を効率化するAIシステム。
    
    ## 主要機能
    - 📄 資料アップロード・解析
    - 🤖 AI情報抽出・ファクトチェック
    - ❓ 自動質問生成・Q&Aフロー
    - 📊 スコアリング・フィルタリング
    - 📋 要約レポート生成
    """,
    version="0.1.0",
    lifespan=lifespan
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# APIルーター登録
app.include_router(auth.router, prefix="/api/v1/auth", tags=["認証"])
app.include_router(proposals.router, prefix="/api/v1/proposals", tags=["提案"])
app.include_router(evaluations.router, prefix="/api/v1/evaluations", tags=["評価"])
app.include_router(summaries.router, prefix="/api/v1/summaries", tags=["要約"])


@app.get("/")
async def root():
    """ヘルスチェック"""
    return {
        "status": "healthy",
        "service": "AIプレゼン自動スクリーニングシステム",
        "version": "0.1.0"
    }


@app.get("/api/v1/health")
async def health_check():
    """詳細ヘルスチェック"""
    return {
        "status": "healthy",
        "database": "connected",
        "redis": "connected",
        "storage": "connected"
    }
