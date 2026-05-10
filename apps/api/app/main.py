from fastapi import FastAPI
from app.api.health import router as health_router
from app.core.db import create_db_and_tables


async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)


app.include_router(health_router)
