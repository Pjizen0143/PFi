from redis import Redis
from app.core.config import settings

redis_client = Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    decode_responses=True
)

# redis_client.ping()  # Test connection to Redis, will raise an error if it fails
redis_client.set("usd", "32.50")

def get_cached_rate() -> str | None:
    return redis_client.get("usd")