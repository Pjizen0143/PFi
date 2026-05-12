from datetime import UTC, datetime, timedelta
from typing import Any

import bcrypt
import jwt

from app.core.config import settings


SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
EXPIRE_TIME = settings.EXPIRE_TIME


def hash_password(plain_password: str) -> str:
    """Return a bcrypt hash string suitable for storing in the database."""
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(plain_password: str, password_hash: str) -> bool:
    """Return True if plain_password matches the stored bcrypt hash."""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            password_hash.encode("utf-8"),
        )
    except ValueError:
        return False


def create_access_token(
    subject: str,
    *,
    expires_delta: timedelta | None = None,
    extra_claims: dict[str, Any] | None = None,
) -> str:
    """
    Create a signed JWT access token.

    :param subject: Typically the user id (e.g. UUID as string), stored as ``sub``.
    :param expires_delta: Optional custom lifetime; defaults to ``settings.EXPIRE_TIME`` seconds.
    :param extra_claims: Optional additional JWT payload keys (do not override ``sub``, ``iat``, ``exp``).
    """
    now = datetime.now(UTC)
    ttl = expires_delta if expires_delta is not None else timedelta(seconds=EXPIRE_TIME)
    now_ts = int(now.timestamp())
    exp_ts = now_ts + int(ttl.total_seconds())
    payload: dict[str, Any] = {
        "sub": subject,
        "iat": now_ts,
        "exp": exp_ts,
    }
    if extra_claims:
        extra = dict(extra_claims)
        for key in ("sub", "iat", "exp"):
            extra.pop(key, None)
        payload.update(extra)

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def decode_access_token(token: str) -> dict[str, Any]:
    """
    Decode and validate a JWT. Raises subclasses of ``jwt.PyJWTError`` on failure.
    """
    return jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM],
    )


__all__ = [
    "create_access_token",
    "decode_access_token",
    "hash_password",
    "verify_password",
]
