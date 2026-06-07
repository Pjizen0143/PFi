from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # นำมา import ไว้ด้านบนให้เคลียร์

from app import models
from app.api.health import router as health_router
from app.core.db import create_db_and_tables
from app.core.initial_data import init_currencies, init_categories
from app.api.v1.router import router as api_v1_router
from app.exceptions.app_exception import register_exception_handlers
from app.core.config import settings


async def lifespan(app: FastAPI):
    create_db_and_tables()
    init_currencies()
    init_categories()
    yield


app = FastAPI(lifespan=lifespan)

if settings.ENVIRONMENT == "local":
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"http://localhost(:\d+)?", 
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True,
    )
elif settings.ENVIRONMENT == "production":
    origins = settings.ORIGINS.split(",") if settings.ORIGINS else []
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True,
    )

app.include_router(health_router)
app.include_router(api_v1_router)

register_exception_handlers(app)