"""
認証APIテスト
"""
import pytest
from httpx import AsyncClient


class TestRegister:
    """ユーザー登録テスト"""

    @pytest.mark.asyncio
    async def test_register_success(self, client: AsyncClient):
        """正常な登録"""
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "NewPass123",
                "name": "新規ユーザー",
                "role": "supplier"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "newuser@example.com"
        assert data["name"] == "新規ユーザー"
        assert data["role"] == "supplier"
        assert data["is_active"] is True

    @pytest.mark.asyncio
    async def test_register_weak_password(self, client: AsyncClient):
        """弱いパスワードでの登録失敗"""
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "weak@example.com",
                "password": "weak",  # 8文字未満
                "name": "弱いパスワード",
                "role": "supplier"
            }
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_register_invalid_email(self, client: AsyncClient):
        """無効なメールアドレス"""
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "invalid-email",
                "password": "ValidPass123",
                "name": "無効なメール",
                "role": "supplier"
            }
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_register_duplicate_email(self, client: AsyncClient, test_user):
        """重複メールアドレス"""
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "test@example.com",  # 既存ユーザーのメール
                "password": "ValidPass123",
                "name": "重複ユーザー",
                "role": "supplier"
            }
        )
        assert response.status_code == 400


class TestLogin:
    """ログインテスト"""

    @pytest.mark.asyncio
    async def test_login_success(self, client: AsyncClient, test_user):
        """正常なログイン"""
        response = await client.post(
            "/api/v1/auth/login",
            data={
                "username": "test@example.com",
                "password": "TestPass123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == "test@example.com"

    @pytest.mark.asyncio
    async def test_login_wrong_password(self, client: AsyncClient, test_user):
        """間違ったパスワード"""
        response = await client.post(
            "/api/v1/auth/login",
            data={
                "username": "test@example.com",
                "password": "WrongPassword123"
            }
        )
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_login_nonexistent_user(self, client: AsyncClient):
        """存在しないユーザー"""
        response = await client.post(
            "/api/v1/auth/login",
            data={
                "username": "nonexistent@example.com",
                "password": "SomePass123"
            }
        )
        assert response.status_code == 401


class TestMe:
    """ユーザー情報取得テスト"""

    @pytest.mark.asyncio
    async def test_get_me_success(self, client: AsyncClient, test_user, auth_headers):
        """正常な情報取得"""
        response = await client.get(
            "/api/v1/auth/me",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["name"] == "テストユーザー"

    @pytest.mark.asyncio
    async def test_get_me_unauthorized(self, client: AsyncClient):
        """認証なしでのアクセス"""
        response = await client.get("/api/v1/auth/me")
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_get_me_invalid_token(self, client: AsyncClient):
        """無効なトークン"""
        response = await client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "Bearer invalid_token"}
        )
        assert response.status_code == 401
