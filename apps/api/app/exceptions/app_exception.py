from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.schemas.common.response import ApiResponse, ValidationError
from app.exceptions.error_codes import ErrorCode

class AppException(HTTPException):
    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    code: str = ErrorCode.APP_ERROR
    message: str = "Application error"

    def __init__(
        self,
        *,
        message: str | None = None,
        details: list[ValidationError] | None = None,
        headers: dict[str, str] | None = None,
    ) -> None:
        final_message = message or self.message
        
        final_details = details if details is not None else getattr(self, "details", None)

        self.message = final_message
        self.details = final_details

        super().__init__(
            status_code=self.status_code,
            detail=final_message,
            headers=headers,
        )


async def app_exception_handler(
    request: Request,
    exc: AppException,
) -> JSONResponse:
    response = ApiResponse.error_response(
        code=exc.code,
        message=exc.message,
        details=exc.details,
    )

    return JSONResponse(
        status_code=exc.status_code,
        content=response.model_dump(),
        headers=exc.headers,
    )


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    mapped_details = []
    for error in exc.errors():
        field_path = ".".join(str(loc) for loc in error["loc"] if loc != "body")
        
        mapped_details.append(
            ValidationError(
                field=field_path if field_path else "request",
                reason=error["msg"]
            )
        )

    response = ApiResponse.error_response(
        code=ErrorCode.VALIDATION_ERROR,
        message="The request contained invalid data.",
        details=mapped_details,
    )

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=response.model_dump(),
    )


def register_exception_handlers(
    app: FastAPI,
) -> None:
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)