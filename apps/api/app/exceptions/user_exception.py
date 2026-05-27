from fastapi import status
from app.exceptions.app_exception import AppException
from app.exceptions.error_codes import ErrorCode
from app.schemas.common.response import ValidationError


class EmailAlreadyExistsException(AppException):
    status_code = status.HTTP_409_CONFLICT
    code = ErrorCode.CONFLICT
    message = "Email already exists"
    details = [
        ValidationError(
            field="email",
            reason="A user with this email already exists",
        )
    ]


class UserNotFoundException(AppException):
    status_code = status.HTTP_404_NOT_FOUND
    code = ErrorCode.NOT_FOUND
    message = "User not found"