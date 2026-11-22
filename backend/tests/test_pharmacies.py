import pytest

@pytest.mark.asyncio
async def test_list_pharmacies(client):
    res = await client.get("/api/v1/pharmacies")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 5

@pytest.mark.asyncio
async def test_nearby_pharmacies(client):
    res = await client.get("/api/v1/pharmacies/nearby?latitude=12.9352&longitude=77.6245&radius_km=5.0")
    assert res.status_code == 200
    data = res.json()
    assert len(data) > 0
    assert "distance_km" in data[0]

