import httpx

from app.core.config import settings


class ExchangeRateProvider:

    BASE_URL = settings.EXCHANGE_RATE_API_URL

    async def get_rates(
        self,
        base_currency: str
    ) -> dict:

        async with httpx.AsyncClient() as client:

            response = await client.get(
                f"{self.BASE_URL}/{base_currency}"
            )

            response.raise_for_status()

            return response.json()