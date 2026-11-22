import pytest

@pytest.mark.asyncio
async def test_health(client):
    res = await client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

@pytest.mark.asyncio
async def test_login_success(client):
    res = await client.post("/api/v1/auth/login", json={
        "email": "customer@medibid.demo",
        "password": "demo123456"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()

@pytest.mark.asyncio
async def test_login_invalid(client):
    res = await client.post("/api/v1/auth/login", json={
        "email": "customer@medibid.demo",
        "password": "wrongpassword"
    })
    assert res.status_code == 401

@pytest.mark.asyncio
async def test_get_me(client, customer_token):
    res = await client.get("/api/v1/auth/me", headers={
        "Authorization": f"Bearer {customer_token}"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "customer@medibid.demo"
    assert data["role"] == "customer"

