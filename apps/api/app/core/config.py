from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = ROOT_DIR / ".env"

ACTUAL_ENV_FILE = ENV_PATH if ENV_PATH.exists() else None


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        extra="ignore", case_sensitive=True, env_file=ACTUAL_ENV_FILE
    )

    ENVIRONMENT: str = "local"

    APP_NAME: str = "pfi-api"
    DEBUG: bool = False

    API_V1_PREFIX: str = "/api/v1"

    DATABASE_URL: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    EXPIRE_TIME: int

    REDIS_HOST: str 
    REDIS_PORT: int

    EXCHANGE_RATE_API_URL: str = "localhost"
    GOOGLE_CLIENT_ID: str


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
