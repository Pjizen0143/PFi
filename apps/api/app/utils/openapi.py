from app.exceptions.app_exception import AppException
from app.schemas.common.response import ApiResponse


def exception_response(
    *exceptions: type[AppException],
) -> dict[int, dict]:
    responses = {}

    for exc in exceptions:
        responses[exc.status_code] = {
            "model": ApiResponse,
            "description": exc.message,
            "content": {
                "application/json": {
                    "example": exc.example(),
                },
            },
        }

    return responses