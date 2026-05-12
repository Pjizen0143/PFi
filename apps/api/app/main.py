from fastapi import FastAPI

from app import models
from app.api.health import router as health_router
from app.api.v1.routers.user import router as user_router
from app.core.config import settings
from app.core.db import create_db_and_tables


async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)


app.include_router(health_router)
app.include_router(user_router, prefix=settings.API_V1_PREFIX)
