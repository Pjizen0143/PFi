import json

from email.utils import parsedate_to_datetime
from app.core.utils import utcnow

from app.core.redis import redis_client
from app.repositories.exchange_rate_provider import (
    ExchangeRateProvider
)
from app.schemas.v1.exchange_rate import (
    ExchangeRateResponse,
    ExchangeRates,
)


class ExchangeRateService:

    def __init__(self):
        self.provider = ExchangeRateProvider()

    async def get_rates(
        self,
        base_currency: str
    ) -> ExchangeRateResponse:

        cache_key = f"rates:{base_currency}"

        cached = await redis_client.get(
            cache_key
        )

        if cached:
            print("Cache hit")
            return ExchangeRateResponse.model_validate(
                json.loads(cached)
            )

        data = await self.provider.get_rates(
            base_currency
        )

        supported_currencies = (
            ExchangeRates.model_fields.keys()
        )

        filtered_rates = {
            currency: data["conversion_rates"][currency]
            for currency in supported_currencies
        }

        response = ExchangeRateResponse(
            base=data["base_code"],
            updated_at=parsedate_to_datetime(
                data["time_last_update_utc"]
            ),
            next_update_at=parsedate_to_datetime(
                data["time_next_update_utc"]
            ),
            rates=ExchangeRates(
                **filtered_rates
            )
        )

        ttl = (
            data["time_next_update_unix"]
            - int(utcnow().timestamp())
        )

        await redis_client.setex(
            cache_key,
            ttl,
            response.model_dump_json()
        )

        return response