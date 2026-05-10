from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings


# Database connection URL from environment settings
DATABASE_URL = settings.DATABASE_URL


# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    # Print SQL queries in console when debug mode is enabled
    echo=settings.DEBUG,
    # Check connection health before using it
    # Prevents errors from stale/disconnected connections
    pool_pre_ping=True,
)


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
