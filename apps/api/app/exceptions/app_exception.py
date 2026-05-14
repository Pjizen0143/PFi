from fastapi import HTTPException, FastAPI, Request
from fastapi.responses import JSONResponse
from starlette import status
from typing import Any

from app.schemas.common.response import ApiResponse


class AppException(HTTPException):
    status_code = status.HTTP_400_BAD_REQUEST
    code = "APP_ERROR"
    message = "Application error"

    def __init__(
        self,
        *,
        details: dict[str, Any] | None = None,
        message: str | None = None,
    ) -> None:
        self.details = details

        final_message = message or self.message

        super().__init__(
            status_code=self.status_code,
            detail=final_message,
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
    )


def register_exception_handlers(
    app: FastAPI,
) -> None:
    app.add_exception_handler(
        AppException,
        app_exception_handler,
    )
