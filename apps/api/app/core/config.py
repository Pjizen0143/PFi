from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        extra="ignore",
        case_sensitive=True,
    )

    ENVIRONMENT: str = "local"

    APP_NAME: str = "pfi-api"
    DEBUG: bool = False

    API_V1_PREFIX: str = "/api/v1"

    DATABASE_URL: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    EXPIRE_TIME: int


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
