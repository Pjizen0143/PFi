import pytest
import pytest_asyncio

from httpx import ASGITransport, AsyncClient
from sqlmodel import SQLModel
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from app.main import app


@pytest_asyncio.fixture
async def db_engine():
    """Create database engine and initialize schema."""
    engine = create_async_engine(
        "postgresql+psycopg_async://ci:ci@localhost:5432/pfi_ci",
        echo=False,
    )
    
    # Create all tables based on your models
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    
    yield engine
    
    # Cleanup: drop all tables after tests
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)
    
    await engine.dispose()


@pytest_asyncio.fixture
async def client(db_engine):
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
