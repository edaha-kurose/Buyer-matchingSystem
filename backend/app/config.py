"""
アプリケーション設定
"""
from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List
import os
import warnings


class Settings(BaseSettings):
    """アプリケーション設定"""

    # アプリケーション
    APP_NAME: str = "AIプレゼン自動スクリーニングシステム"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # データベース
    DATABASE_URL: str = "postgresql+asyncpg://screening:screening123@localhost:5434/ai_screening"

    # Redis
    REDIS_URL: str = "redis://localhost:6381"

    # JWT認証
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # OpenAI
    OPENAI_API_KEY: str = ""

    # MinIO
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin123"
    MINIO_BUCKET: str = "proposals"
    MINIO_USE_SSL: bool = False

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True

    def validate_production_settings(self) -> None:
        """本番環境での危険な設定をチェック"""
        if self.ENVIRONMENT == "production":
            # SECRET_KEYのチェック
            if self.SECRET_KEY == "your-super-secret-key-change-in-production":
                raise ValueError(
                    "CRITICAL: SECRET_KEY must be changed in production! "
                    "Generate a secure key with: python -c \"import secrets; print(secrets.token_hex(32))\""
                )

            # デバッグモードのチェック
            if self.DEBUG:
                warnings.warn(
                    "WARNING: DEBUG mode is enabled in production. "
                    "Set DEBUG=false for production.",
                    RuntimeWarning
                )

            # CORS設定のチェック
            localhost_origins = [o for o in self.ALLOWED_ORIGINS if "localhost" in o or "127.0.0.1" in o]
            if localhost_origins:
                warnings.warn(
                    f"WARNING: localhost origins detected in production CORS settings: {localhost_origins}",
                    RuntimeWarning
                )

    @property
    def is_production(self) -> bool:
        """本番環境かどうかを判定"""
        return self.ENVIRONMENT == "production"

    @property
    def is_development(self) -> bool:
        """開発環境かどうかを判定"""
        return self.ENVIRONMENT == "development"


settings = Settings()

# 起動時に本番環境設定をチェック
settings.validate_production_settings()
