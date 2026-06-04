from fastapi import FastAPI

from app import models
from app.api.health import router as health_router
from app.core.db import create_db_and_tables
from app.core.initial_data import init_currencies, init_categories
from app.api.v1.router import router as api_v1_router
from app.exceptions.app_exception import register_exception_handlers


async def lifespan(app: FastAPI):
    create_db_and_tables()
    init_currencies()
    init_categories()
    yield


app = FastAPI(lifespan=lifespan)


app.include_router(health_router)
app.include_router(api_v1_router)

register_exception_handlers(app)
