"""
SQLAlchemy Base Model
"""
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, DateTime
from datetime import datetime


class Base(DeclarativeBase):
    """SQLAlchemy基底クラス"""
    pass


class TimestampMixin:
    """タイムスタンプMixin"""
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
