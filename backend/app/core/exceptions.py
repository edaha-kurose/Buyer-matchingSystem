"""
カスタム例外クラス
統一されたエラーハンドリングを提供
"""
from typing import Optional, Dict, Any
from fastapi import HTTPException, status


class AppException(HTTPException):
    """アプリケーション基底例外"""

    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: Optional[str] = None,
        headers: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)
        self.error_code = error_code


class NotFoundError(AppException):
    """リソースが見つからない"""

    def __init__(
        self,
        resource: str = "リソース",
        resource_id: Optional[int] = None,
        error_code: str = "NOT_FOUND",
    ):
        detail = f"{resource}が見つかりません"
        if resource_id is not None:
            detail = f"{resource} (ID: {resource_id}) が見つかりません"
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            error_code=error_code,
        )


class ValidationError(AppException):
    """バリデーションエラー"""

    def __init__(
        self,
        detail: str = "入力データが無効です",
        error_code: str = "VALIDATION_ERROR",
    ):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail,
            error_code=error_code,
        )


class AuthenticationError(AppException):
    """認証エラー"""

    def __init__(
        self,
        detail: str = "認証に失敗しました",
        error_code: str = "AUTHENTICATION_FAILED",
    ):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            error_code=error_code,
            headers={"WWW-Authenticate": "Bearer"},
        )


class PermissionDeniedError(AppException):
    """権限エラー"""

    def __init__(
        self,
        detail: str = "この操作を行う権限がありません",
        error_code: str = "PERMISSION_DENIED",
    ):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            error_code=error_code,
        )


class ConflictError(AppException):
    """競合エラー（重複など）"""

    def __init__(
        self,
        detail: str = "リソースが競合しています",
        error_code: str = "CONFLICT",
    ):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail,
            error_code=error_code,
        )


class InsufficientPointsError(AppException):
    """ポイント不足エラー"""

    def __init__(
        self,
        required: int,
        available: int,
        error_code: str = "INSUFFICIENT_POINTS",
    ):
        detail = f"ポイントが不足しています。必要: {required}pt, 残高: {available}pt"
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            error_code=error_code,
        )


class RateLimitError(AppException):
    """レート制限エラー"""

    def __init__(
        self,
        detail: str = "リクエスト回数の上限に達しました。しばらく待ってから再試行してください。",
        error_code: str = "RATE_LIMIT_EXCEEDED",
    ):
        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=detail,
            error_code=error_code,
        )


class ExternalServiceError(AppException):
    """外部サービスエラー"""

    def __init__(
        self,
        service: str = "外部サービス",
        detail: Optional[str] = None,
        error_code: str = "EXTERNAL_SERVICE_ERROR",
    ):
        message = detail or f"{service}との通信でエラーが発生しました"
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=message,
            error_code=error_code,
        )
