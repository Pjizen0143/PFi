from fastapi import status
from app.exceptions.app_exception import AppException
from app.exceptions.error_codes import ErrorCode


class InvalidCredentialsException(AppException):
    status_code = status.HTTP_401_UNAUTHORIZED
    code = ErrorCode.UNAUTHORIZED
    message = "Invalid authentication credentials"

    def __init__(self) -> None:
        super().__init__(
            headers={
                "WWW-Authenticate": "Bearer",
            }
        )