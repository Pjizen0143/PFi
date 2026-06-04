from fastapi import APIRouter

from app.schemas.v1.exchange_rate import ExchangeRateResponse
from app.schemas.common.response import ApiResponse, ApiSuccessResponse
from app.exceptions import ValidationException
from app.utils.openapi import exception_response
from app.services.exchange_rate_service import ExchangeRateService
from app.repositories.exchange_rate_provider import ExchangeRateProvider
from app.core.redis import redis_client

router = APIRouter(prefix="/exchange-rates", tags=["Exchange Rates"])

service = ExchangeRateService(ExchangeRateProvider(), redis_client)


@router.get(
    "",
    response_model=ApiSuccessResponse[ExchangeRateResponse],
    response_model_exclude_none=True,
    responses=exception_response( 
        ValidationException
        )
)
async def get_exchange_rates(
    base: str = "USD"
) -> ApiSuccessResponse[ExchangeRateResponse]:
    return await ApiResponse.success_response(data=await service.get_rates(base))