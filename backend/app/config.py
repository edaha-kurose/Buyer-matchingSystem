"""
アプリケーション設定
"""
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """アプリケーション設定"""
    
    # アプリケーション
    APP_NAME: str = "AIプレゼン自動スクリーニングシステム"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # データベース
    DATABASE_URL: str = "postgresql+asyncpg://screening:screening123@localhost:5432/ai_screening"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
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
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
