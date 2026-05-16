from fastapi import status

from app.exceptions.app_exception import AppException


class InvalidCredentialsException(AppException):
    status_code = status.HTTP_401_UNAUTHORIZED
    code = "INVALID_CREDENTIALS"
    message = "Invalid authentication credentials"

    def __init__(self) -> None:
        super().__init__(
            headers={
                "WWW-Authenticate": "Bearer",
            }
        )
