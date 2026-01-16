"""
認証API
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings

router = APIRouter()

# パスワードハッシュ
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


# スキーマ
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "supplier"


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    is_active: bool


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """JWTトークン生成"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """パスワード検証"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """パスワードハッシュ化"""
    return pwd_context.hash(password)


@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    """ユーザー登録"""
    # TODO: DB登録実装
    return {
        "id": 1,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "is_active": True
    }


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """ログイン"""
    # TODO: 認証ロジック実装
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(1)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """現在のユーザー情報取得"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="認証情報が無効です",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # TODO: DBからユーザー取得
    return {
        "id": int(user_id),
        "email": "test@example.com",
        "name": "テストユーザー",
        "role": "buyer",
        "is_active": True
    }


@router.post("/logout")
async def logout():
    """ログアウト"""
    return {"message": "ログアウトしました"}
