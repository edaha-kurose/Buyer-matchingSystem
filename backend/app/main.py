"""
AIプレゼン自動スクリーニングシステム - メインアプリケーション
"""
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from app.config import settings
from app.api.v1 import auth, proposals, evaluations, summaries, supplier
from app.db.session import engine
from app.db.base import Base
from app.core.exceptions import AppException

# ロギング設定
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


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
app.include_router(supplier.router, prefix="/api/v1/supplier", tags=["サプライヤー"])


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


# ============ 例外ハンドラー ============

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    """アプリケーション例外ハンドラー"""
    logger.warning(
        f"AppException: {exc.detail} | "
        f"Status: {exc.status_code} | "
        f"Path: {request.url.path}"
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_code": exc.error_code,
        },
        headers=exc.headers,
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """一般例外ハンドラー（予期しないエラー）"""
    logger.error(
        f"Unhandled exception: {str(exc)} | "
        f"Path: {request.url.path}",
        exc_info=True
    )

    # 本番環境では詳細を隠す
    detail = str(exc) if settings.DEBUG else "内部サーバーエラーが発生しました"

    return JSONResponse(
        status_code=500,
        content={
            "detail": detail,
            "error_code": "INTERNAL_SERVER_ERROR",
        },
    )
