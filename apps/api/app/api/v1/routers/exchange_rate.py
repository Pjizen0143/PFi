from fastapi import APIRouter

from app.schemas.v1.exchange_rate import ExchangeRateResponse
from app.services.exchange_rate_service import ExchangeRateService

router = APIRouter(prefix="/exchange-rates", tags=["Exchange Rates"])

service = ExchangeRateService()


@router.get(
    "",
    response_model=ExchangeRateResponse
)
async def get_exchange_rates(
    base: str = "USD"
):
    return await service.get_rates(base)