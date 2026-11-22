import pytest

@pytest.mark.asyncio
async def test_list_agents(client):
    res = await client.get("/api/v1/agents")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 8
    names = [a["name"] for a in data]
    assert "Prescription Vision Agent" in names
    assert "Central Orchestrator" in names

@pytest.mark.asyncio
async def test_admin_analytics(client):
    res = await client.get("/api/v1/admin/analytics")
    assert res.status_code == 200
    data = res.json()
    assert "total_customers" in data
    assert "verified_pharmacies" in data
    assert data["verified_pharmacies"] >= 5

