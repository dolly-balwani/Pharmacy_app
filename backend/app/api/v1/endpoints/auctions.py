from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Dict
from datetime import datetime, timedelta, timezone
import json, math
from app.db.session import get_db, async_session
from app.models.user import User
from app.models.auction import Auction, AuctionStatus, AuctionParticipant, Bid, BidItem
from app.models.pharmacy import Pharmacy, VerificationStatus
from app.schemas.auction import AuctionCreate, AuctionResponse, BidCreate, BidResponse, BidItemResponse
from app.core.deps import get_current_user

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, ws: WebSocket, auction_id: str):
        await ws.accept()
        self.connections.setdefault(auction_id, []).append(ws)

    def disconnect(self, ws: WebSocket, auction_id: str):
        if auction_id in self.connections:
            try: self.connections[auction_id].remove(ws)
            except: pass

    async def broadcast(self, auction_id: str, msg: dict):
        for ws in self.connections.get(auction_id, []):
            try: await ws.send_json(msg)
            except: pass

manager = ConnectionManager()

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1); dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))

def _build_bid(b: Bid, pharmacy_name: str = None, pharmacy_rating: float = None) -> BidResponse:
    return BidResponse(
        id=b.id, auction_id=b.auction_id, pharmacy_id=b.pharmacy_id,
        pharmacy_name=pharmacy_name, pharmacy_rating=pharmacy_rating,
        total_price=b.total_price, discount_percentage=b.discount_percentage,
        delivery_charge=b.delivery_charge, estimated_delivery_minutes=b.estimated_delivery_minutes,
        all_medicines_available=b.all_medicines_available,
        items=[BidItemResponse.model_validate(i) for i in b.items],
        submitted_at=b.submitted_at, is_winner=b.is_winner,
    )

def _build_auction(a: Auction, bids=None) -> AuctionResponse:
    return AuctionResponse(
        id=a.id, prescription_id=a.prescription_id, customer_id=a.customer_id,
        status=a.status.value, search_radius_km=a.search_radius_km,
        start_time=a.start_time, end_time=a.end_time, duration_minutes=a.duration_minutes,
        total_pharmacies_notified=a.total_pharmacies_notified,
        total_bids_received=a.total_bids_received, bids=bids or [],
        created_at=a.created_at,
    )

@router.post("", response_model=AuctionResponse)
async def create_auction(data: AuctionCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    now = datetime.now(timezone.utc)
    auction = Auction(
        prescription_id=data.prescription_id, customer_id=user.id,
        status=AuctionStatus.ACTIVE, search_radius_km=data.search_radius_km,
        start_time=now, end_time=now + timedelta(minutes=data.duration_minutes),
        duration_minutes=data.duration_minutes,
        customer_latitude=data.customer_latitude, customer_longitude=data.customer_longitude,
    )
    db.add(auction)
    await db.flush()
    result = await db.execute(select(Pharmacy).where(Pharmacy.is_active == True, Pharmacy.verification_status == VerificationStatus.VERIFIED))
    notified = 0
    for p in result.scalars().all():
        if haversine(data.customer_latitude, data.customer_longitude, p.latitude, p.longitude) <= data.search_radius_km * 1.5:
            db.add(AuctionParticipant(auction_id=auction.id, pharmacy_id=p.id))
            notified += 1
    auction.total_pharmacies_notified = notified
    await db.flush()

    # Generate realistic simulated competitive bids from notified pharmacies
    from app.models.prescription import Prescription
    rx_res = await db.execute(select(Prescription).options(selectinload(Prescription.medicines)).where(Prescription.id == data.prescription_id))
    rx = rx_res.scalar_one_or_none()
    med_list = rx.medicines if rx and rx.medicines else []
    
    # Default sample items matching prescription
    sample_items = [
        {"name": "Betaloc 100mg", "brand": "AstraZeneca", "qty": 30, "base_price": 24.0},
        {"name": "Dorzolamidum 10mg", "brand": "Trusopt", "qty": 10, "base_price": 35.0},
        {"name": "Cimetidine 50mg", "brand": "Tagamet", "qty": 30, "base_price": 14.0},
        {"name": "Oxprelol 50mg", "brand": "Trasicor", "qty": 15, "base_price": 18.0},
    ]

    p_result = await db.execute(select(Pharmacy).where(Pharmacy.is_active == True, Pharmacy.verification_status == VerificationStatus.VERIFIED).limit(4))
    active_pharmacies = p_result.scalars().all()

    bid_configs = [
        {"discount": 22.0, "delivery": 0.0, "minutes": 25, "notes": "Best price guarantee. Free delivery above ₹300."},
        {"discount": 15.0, "delivery": 25.0, "minutes": 20, "notes": "Express delivery in 20 mins. All brand originals."},
        {"discount": 28.0, "delivery": 15.0, "minutes": 35, "notes": "Maximum discount on generic equivalents available."},
        {"discount": 18.0, "delivery": 0.0, "minutes": 30, "notes": "Verified authentic stock directly from manufacturer."},
    ]

    for idx, p in enumerate(active_pharmacies):
        cfg = bid_configs[idx % len(bid_configs)]
        subtotal = 0.0
        items_to_add = []
        
        if med_list:
            for m in med_list:
                qty = m.quantity or 10
                unit_p = round(12.0 + (idx * 1.5), 2)
                item_sub = round(unit_p * qty, 2)
                subtotal += item_sub
                items_to_add.append({
                    "name": m.medicine_name, "brand": m.brand_name or p.name[:8],
                    "unit_p": unit_p, "qty": qty, "subtotal": item_sub, "generic": (idx % 2 == 0)
                })
        else:
            for s in sample_items:
                unit_p = round(s["base_price"] * (1.0 + (idx * 0.05)), 2)
                item_sub = round(unit_p * s["qty"], 2)
                subtotal += item_sub
                items_to_add.append({
                    "name": s["name"], "brand": s["brand"],
                    "unit_p": unit_p, "qty": s["qty"], "subtotal": item_sub, "generic": False
                })

        disc_amount = subtotal * (cfg["discount"] / 100.0)
        final_price = round(subtotal - disc_amount + cfg["delivery"], 2)

        demo_bid = Bid(
            auction_id=auction.id,
            pharmacy_id=p.id,
            total_price=final_price,
            discount_percentage=cfg["discount"],
            delivery_charge=cfg["delivery"],
            estimated_delivery_minutes=cfg["minutes"],
            all_medicines_available=True,
            notes=cfg["notes"]
        )
        db.add(demo_bid)
        await db.flush()

        for it in items_to_add:
            db.add(BidItem(
                bid_id=demo_bid.id,
                medicine_name=it["name"],
                brand_offered=it["brand"],
                is_generic=it["generic"],
                unit_price=it["unit_p"],
                quantity=it["qty"],
                subtotal=it["subtotal"],
                in_stock=True
            ))

    auction.total_bids_received = len(active_pharmacies)
    await db.commit()
    await db.refresh(auction)
    
    # Reload with bids and items
    reload_q = await db.execute(select(Auction).options(selectinload(Auction.bids).selectinload(Bid.items), selectinload(Auction.bids).selectinload(Bid.pharmacy)).where(Auction.id == auction.id))
    loaded_auction = reload_q.scalar_one()
    bids = [_build_bid(b, b.pharmacy.name if b.pharmacy else None, b.pharmacy.rating if b.pharmacy else None) for b in loaded_auction.bids]
    return _build_auction(loaded_auction, bids)

@router.get("", response_model=List[AuctionResponse])
async def list_auctions(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    q = select(Auction).options(selectinload(Auction.bids).selectinload(Bid.items), selectinload(Auction.bids).selectinload(Bid.pharmacy))
    if user.role.value == "customer":
        q = q.where(Auction.customer_id == user.id)
    result = await db.execute(q.order_by(Auction.created_at.desc()))
    out = []
    for a in result.scalars().all():
        bids = [_build_bid(b, b.pharmacy.name if b.pharmacy else None, b.pharmacy.rating if b.pharmacy else None) for b in a.bids]
        out.append(_build_auction(a, bids))
    return out

@router.get("/{auction_id}", response_model=AuctionResponse)
async def get_auction(auction_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Auction).options(selectinload(Auction.bids).selectinload(Bid.items), selectinload(Auction.bids).selectinload(Bid.pharmacy)).where(Auction.id == auction_id))
    a = result.scalar_one_or_none()
    if not a: raise HTTPException(status_code=404, detail="Auction not found")
    bids = [_build_bid(b, b.pharmacy.name if b.pharmacy else None, b.pharmacy.rating if b.pharmacy else None) for b in a.bids]
    return _build_auction(a, bids)

@router.post("/{auction_id}/bids", response_model=BidResponse)
async def submit_bid(auction_id: str, data: BidCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Auction).where(Auction.id == auction_id))
    auction = result.scalar_one_or_none()
    if not auction: raise HTTPException(status_code=404, detail="Auction not found")
    if auction.status != AuctionStatus.ACTIVE: raise HTTPException(status_code=400, detail="Auction not active")
    result = await db.execute(select(Pharmacy).where(Pharmacy.owner_id == user.id))
    pharmacy = result.scalar_one_or_none()
    if not pharmacy: raise HTTPException(status_code=400, detail="No pharmacy registered for this user")
    total = sum(i.unit_price * i.quantity for i in data.items)
    discount = total * (data.discount_percentage / 100)
    final = round(total - discount + data.delivery_charge, 2)
    bid = Bid(auction_id=auction_id, pharmacy_id=pharmacy.id, total_price=final,
        discount_percentage=data.discount_percentage, delivery_charge=data.delivery_charge,
        estimated_delivery_minutes=data.estimated_delivery_minutes,
        all_medicines_available=all(i.in_stock for i in data.items), notes=data.notes)
    db.add(bid)
    await db.flush()
    for item in data.items:
        db.add(BidItem(bid_id=bid.id, medicine_name=item.medicine_name, brand_offered=item.brand_offered,
            is_generic=item.is_generic, unit_price=item.unit_price, quantity=item.quantity,
            subtotal=round(item.unit_price * item.quantity, 2), in_stock=item.in_stock))
    auction.total_bids_received = (auction.total_bids_received or 0) + 1
    await db.commit()
    await manager.broadcast(auction_id, {"type": "new_bid", "bid_id": bid.id, "pharmacy_name": pharmacy.name, "total_price": final, "delivery_minutes": data.estimated_delivery_minutes, "total_bids": auction.total_bids_received})
    result = await db.execute(select(Bid).options(selectinload(Bid.items)).where(Bid.id == bid.id))
    bid = result.scalar_one()
    return _build_bid(bid, pharmacy.name, pharmacy.rating)

@router.post("/{auction_id}/select-winner")
async def select_winner(auction_id: str, bid_id: str = Query(...), user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Auction).where(Auction.id == auction_id))
    auction = result.scalar_one_or_none()
    if not auction: raise HTTPException(status_code=404, detail="Auction not found")
    result = await db.execute(select(Bid).where(Bid.id == bid_id, Bid.auction_id == auction_id))
    bid = result.scalar_one_or_none()
    if not bid: raise HTTPException(status_code=404, detail="Bid not found")
    bid.is_winner = True
    auction.winning_bid_id = bid.id
    auction.status = AuctionStatus.COMPLETED
    await db.commit()
    await manager.broadcast(auction_id, {"type": "auction_completed", "winning_bid_id": bid.id, "pharmacy_id": bid.pharmacy_id})
    return {"message": "Winner selected", "bid_id": bid.id}

@router.websocket("/ws/{auction_id}")
async def auction_websocket(websocket: WebSocket, auction_id: str):
    await manager.connect(websocket, auction_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(auction_id, {"type": "ping", "data": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket, auction_id)

