from datetime import UTC, datetime
from unittest.mock import AsyncMock, patch

import pytest

from app.services.exchange_rate_service import (
    ExchangeRateService,
)


@pytest.mark.asyncio
async def test_get_rates_sets_correct_ttl():
    fake_redis = AsyncMock()

    provider = AsyncMock()

    provider.get_rates.return_value = {
        "base_code": "USD",
        "time_last_update_utc":
            "Fri, 01 Aug 2025 00:00:01 +0000",
        "time_next_update_utc":
            "Fri, 01 Aug 2025 01:00:00 +0000",
        "time_next_update_unix":
            1754010000,
        "conversion_rates": {
            "USD": 1,
            "THB": 32.5,
            "EUR": 0.85,
        },
    }

    fake_redis.get.return_value = None

    fixed_now = datetime(
        2025,
        8,
        1,
        0,
        0,
        0,
        tzinfo=UTC,
    )

    with patch(
        "app.services.exchange_rate_service.utcnow",
        return_value=fixed_now,
    ):
        service = ExchangeRateService(
            provider=provider,
            redis=fake_redis,
        )

        await service.get_rates("USD")

    expected_ttl = (
        1754010000
        - int(fixed_now.timestamp())
    )

    fake_redis.set.assert_called_once()

    args = fake_redis.set.call_args.args
    kwargs = fake_redis.set.call_args.kwargs

    assert args[0] == "rates:USD"
    assert kwargs["ex"] == expected_ttl


@pytest.mark.asyncio
async def test_get_rates_does_not_cache_when_ttl_is_expired():
    fake_redis = AsyncMock()

    provider = AsyncMock()

    provider.get_rates.return_value = {
        "base_code": "USD",
        "time_last_update_utc":
            "Fri, 01 Aug 2025 00:00:01 +0000",
        "time_next_update_utc":
            "Fri, 01 Aug 2025 00:10:00 +0000",
        "time_next_update_unix":
            100,
        "conversion_rates": {
            "USD": 1,
            "THB": 32.5,
            "EUR": 0.85,
        },
    }

    fake_redis.get.return_value = None

    service = ExchangeRateService(
        provider=provider,
        redis=fake_redis,
    )

    await service.get_rates("USD")

    fake_redis.set.assert_not_called()