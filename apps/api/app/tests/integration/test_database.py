from sqlmodel import Session, text

from app.core.db import engine


def test_database_connection() -> None:
    with Session(engine) as session:
        result = session.exec(text("SELECT 1")).scalar()

    assert result == 1
