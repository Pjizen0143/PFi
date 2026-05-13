from fastapi import FastAPI

from app import models
from app.api.health import router as health_router
from app.core.config import settings
from app.core.db import create_db_and_tables
from app.api.v1.router import router as api_v1_router


async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)


app.include_router(health_router)
app.include_router(api_v1_router)
