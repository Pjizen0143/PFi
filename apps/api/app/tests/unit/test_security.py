import jwt

from app.core.security import (
    ALGORITHM,
    SECRET_KEY,
    create_access_token,
)


def test_create_access_token():
    token = create_access_token(
        "123",
    )

    payload = jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM],
    )

    assert payload["sub"] == "123"
