from fastapi import status

from app.exceptions.app_exception import AppException


class EmailAlreadyExistsException(AppException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            code="EMAIL_ALREADY_EXISTS",
            message="Email already exists",
        )


class UserNotFoundException(AppException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            code="USER_NOT_FOUND",
            message="User not found",
        )
