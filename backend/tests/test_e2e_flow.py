import pytest

@pytest.mark.asyncio
async def test_full_bidding_and_order_flow(client, customer_token):
    # 1. Upload sample prescription
    upload_res = await client.post(
        "/api/v1/prescriptions/upload",
        files={"file": ("prescription.jpg", b"fake image bytes", "image/jpeg")},
        headers={"Authorization": f"Bearer {customer_token}"}
    )
    assert upload_res.status_code == 200
    rx_id = upload_res.json()["id"]

    # 2. Process prescription with AI OCR
    process_res = await client.post(
        f"/api/v1/prescriptions/{rx_id}/process",
        headers={"Authorization": f"Bearer {customer_token}"}
    )
    assert process_res.status_code == 200
    assert len(process_res.json()["medicines"]) >= 3

    # 3. Create live auction
    auction_res = await client.post(
        "/api/v1/auctions",
        json={
            "prescription_id": rx_id,
            "customer_latitude": 12.9352,
            "customer_longitude": 77.6245,
            "duration_minutes": 15,
            "search_radius_km": 2.0
        },
        headers={"Authorization": f"Bearer {customer_token}"}
    )
    assert auction_res.status_code == 200
    auction_data = auction_res.json()
    assert auction_data["total_bids_received"] >= 3
    assert len(auction_data["bids"]) >= 3

    # 4. Customer picks the lowest bid
    lowest_bid = min(auction_data["bids"], key=lambda b: b["total_price"])
    win_res = await client.post(
        f"/api/v1/auctions/{auction_data['id']}/select-winner?bid_id={lowest_bid['id']}",
        headers={"Authorization": f"Bearer {customer_token}"}
    )
    assert win_res.status_code == 200

    # 5. Create confirmed order
    order_res = await client.post(
        "/api/v1/orders",
        json={
            "auction_id": auction_data["id"],
            "bid_id": lowest_bid["id"],
            "delivery_address": "42, MG Road, Koramangala, Bangalore"
        },
        headers={"Authorization": f"Bearer {customer_token}"}
    )
    assert order_res.status_code == 200
    order_id = order_res.json()["id"]
    assert order_res.json()["status"] == "awaiting_pharmacist_verification"

    # 6. Pharmacist approves order
    approval_res = await client.post(
        f"/api/v1/orders/{order_id}/pharmacist-approval",
        json={
            "pharmacist_name": "Dr. Anand Reddy",
            "registration_number": "KA-PHARM-001",
            "notes": "Verified prescription authenticity and dosages."
        },
        headers={"Authorization": f"Bearer {customer_token}"}
    )
    assert approval_res.status_code == 200

    # 7. Check order status moved to approved
    get_order_res = await client.get(
        f"/api/v1/orders/{order_id}",
        headers={"Authorization": f"Bearer {customer_token}"}
    )
    assert get_order_res.status_code == 200
    assert get_order_res.json()["status"] == "pharmacist_approved"

