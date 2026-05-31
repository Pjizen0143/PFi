from datetime import datetime

from pydantic import BaseModel


class ExchangeRates(BaseModel):
    USD: float
    THB: float
    EUR: float


class ExchangeRateResponse(BaseModel):
    base: str
    updated_at: datetime
    next_update_at: datetime
    rates: ExchangeRates