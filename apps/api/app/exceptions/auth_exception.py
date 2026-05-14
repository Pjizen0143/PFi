from fastapi import status

from app.exceptions.app_exception import AppException


class InvalidCredentialsException(AppException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="INVALID_CREDENTIALS",
            message="email or password wrong",
        )
