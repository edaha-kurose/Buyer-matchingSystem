"""
Database Session Management
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.config import settings

# 非同期エンジン作成
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True
)

# セッションファクトリ
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def get_db() -> AsyncSession:
    """DB接続を取得"""
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()
