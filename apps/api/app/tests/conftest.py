import os

import pytest_asyncio

from httpx import ASGITransport, AsyncClient
from sqlmodel import SQLModel

from app.main import app
from app.core.db import engine

# IMPORTANT:
# Import all models before create_all
from app.models.user import User
from app.models.auth import AuthProvider


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_database():
    SQLModel.metadata.create_all(engine)

    yield

    SQLModel.metadata.drop_all(engine)


@pytest_asyncio.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
