import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.security import create_access_token

@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c

@pytest.fixture
def customer_token():
    return create_access_token({"sub": "demo-customer-001", "role": "customer"})

@pytest.fixture
def pharmacy_token():
    return create_access_token({"sub": "demo-ph-user-001", "role": "pharmacy"})

@pytest.fixture
def admin_token():
    return create_access_token({"sub": "demo-admin-001", "role": "admin"})

