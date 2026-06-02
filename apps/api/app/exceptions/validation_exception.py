from fastapi import status

from app.exceptions.app_exception import AppException
from app.exceptions.error_codes import ErrorCode
from app.schemas.common.response import ValidationError


class ValidationException(AppException):
    status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
    code = ErrorCode.VALIDATION_ERROR
    message = "The request contained invalid data."

    details = [
        ValidationError(
            field="string",
            reason="Field required",
        )
    ]