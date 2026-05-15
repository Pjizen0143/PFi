import pytest


pytestmark = pytest.mark.asyncio


async def test_register_success(client):
    payload = {
        "email": "tempura@example.com",
        "password": "supersecret123",
        "display_name": "Tempura",
    }

    response = await client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    assert response.status_code == 201

    body = response.json()

    assert body["success"] is True
    assert body["data"]["display_name"] == payload["display_name"]
    assert "access_token" in body["data"]


async def test_register_duplicate_email(client):
    payload = {
        "email": "duplicate@example.com",
        "password": "supersecret123",
        "display_name": "Tempura",
    }

    await client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    response = await client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    assert response.status_code == 409


async def test_register_invalid_email(client):
    payload = {
        "email": "invalid-email",
        "password": "supersecret123",
        "display_name": "Tempura",
    }

    response = await client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    assert response.status_code == 422


async def test_login_success(client):
    register_payload = {
        "email": "login@example.com",
        "password": "supersecret123",
        "display_name": "Tempura",
    }

    await client.post(
        "/api/v1/auth/register",
        json=register_payload,
    )

    login_payload = {
        "email": "login@example.com",
        "password": "supersecret123",
    }

    response = await client.post(
        "/api/v1/auth/login",
        json=login_payload,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert body["data"]["token_type"] == "bearer"
    assert "access_token" in body["data"]


async def test_login_wrong_password(client):
    register_payload = {
        "email": "wrongpass@example.com",
        "password": "correct-password",
        "display_name": "Tempura",
    }

    await client.post(
        "/api/v1/auth/register",
        json=register_payload,
    )

    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "wrongpass@example.com",
            "password": "wrong-password",
        },
    )

    assert response.status_code == 401


async def test_login_user_not_found(client):
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "notfound@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 401
