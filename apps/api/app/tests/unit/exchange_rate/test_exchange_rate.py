import json
import time

import fakeredis.aioredis
import pytest
from unittest.mock import AsyncMock

from app.schemas.v1.exchange_rate import (
    ExchangeRateResponse,
)
from app.services.exchange_rate_service import (
    ExchangeRateService,
)


@pytest.mark.asyncio
async def test_get_rates_returns_cached_data():
    fake_redis = fakeredis.aioredis.FakeRedis()

    cached_response = {
        "base": "USD",
        "updated_at": "2025-08-01T00:00:00+00:00",
        "next_update_at": "2025-08-02T00:00:00+00:00",
        "rates": {
            "USD": 1,
            "THB": 32.5,
            "EUR": 0.85,
        },
    }

    await fake_redis.set(
        "rates:USD",
        json.dumps(cached_response),
    )

    provider = AsyncMock()

    service = ExchangeRateService(
        provider=provider,
        redis=fake_redis,
    )

    result = await service.get_rates("USD")

    assert isinstance(
        result,
        ExchangeRateResponse,
    )

    assert result.base == "USD"
    assert result.rates.THB == 32.5
    assert result.rates.EUR == 0.85

    provider.get_rates.assert_not_called()


@pytest.mark.asyncio
async def test_get_rates_fetches_provider_when_cache_miss():
    fake_redis = fakeredis.aioredis.FakeRedis()

    provider = AsyncMock()

    future_timestamp = int(time.time()) + 3600

    provider.get_rates.return_value = {
        "base_code": "USD",
        "time_last_update_utc":
            "Fri, 01 Aug 2025 00:00:01 +0000",
        "time_next_update_utc":
            "Sat, 02 Aug 2030 00:00:01 +0000",
        "time_next_update_unix":
            future_timestamp,
        "conversion_rates": {
            "USD": 1,
            "THB": 32.5,
            "EUR": 0.85,
        },
    }

    service = ExchangeRateService(
        provider=provider,
        redis=fake_redis,
    )

    result = await service.get_rates("USD")

    assert result.base == "USD"
    assert result.rates.THB == 32.5

    provider.get_rates.assert_called_once_with(
        "USD"
    )

    cached = await fake_redis.get(
        "rates:USD"
    )

    assert cached is not None

    cached_data = json.loads(cached)

    assert cached_data["base"] == "USD"
    assert cached_data["rates"]["THB"] == 32.5