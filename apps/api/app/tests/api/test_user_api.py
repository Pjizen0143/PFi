import pytest


pytestmark = pytest.mark.asyncio


async def create_and_login_user(client):
    register_payload = {
        "email": "user@example.com",
        "password": "supersecret123",
        "display_name": "Tempura",
    }

    await client.post(
        "/api/v1/auth/register",
        json=register_payload,
    )

    login_response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": register_payload["email"],
            "password": register_payload["password"],
        },
    )

    token = login_response.json()["data"]["access_token"]

    return {
        "Authorization": f"Bearer {token}",
    }


async def test_get_current_user(client):
    headers = await create_and_login_user(client)

    response = await client.get(
        "/api/v1/users/me",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert body["data"]["email"] == "user@example.com"


async def test_get_current_user_unauthorized(client):
    response = await client.get(
        "/api/v1/users/me",
    )

    assert response.status_code == 401


async def test_update_current_user(client):
    headers = await create_and_login_user(client)

    payload = {
        "display_name": "Updated Name",
    }

    response = await client.patch(
        "/api/v1/users/me",
        json=payload,
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert body["data"]["display_name"] == "Updated Name"


async def test_delete_current_user(client):
    headers = await create_and_login_user(client)

    response = await client.delete(
        "/api/v1/users/me",
        headers=headers,
    )

    assert response.status_code == 204


async def test_delete_current_user_unauthorized(client):
    response = await client.delete(
        "/api/v1/users/me",
    )

    assert response.status_code == 401
