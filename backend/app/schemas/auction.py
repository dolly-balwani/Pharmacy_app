from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AuctionCreate(BaseModel):
    prescription_id: str
    customer_latitude: float
    customer_longitude: float
    duration_minutes: int = 15
    search_radius_km: float = 1.0

class BidItemCreate(BaseModel):
    medicine_name: str
    brand_offered: Optional[str] = None
    is_generic: bool = False
    unit_price: float
    quantity: int
    in_stock: bool = True

class BidCreate(BaseModel):
    items: List[BidItemCreate]
    delivery_charge: float = 0.0
    estimated_delivery_minutes: int = 30
    discount_percentage: float = 0.0
    notes: Optional[str] = None

class BidItemResponse(BaseModel):
    id: str
    medicine_name: str
    brand_offered: Optional[str] = None
    is_generic: bool
    unit_price: float
    quantity: int
    subtotal: float
    in_stock: bool
    class Config:
        from_attributes = True

class BidResponse(BaseModel):
    id: str
    auction_id: str
    pharmacy_id: str
    pharmacy_name: Optional[str] = None
    pharmacy_rating: Optional[float] = None
    total_price: float
    discount_percentage: float
    delivery_charge: float
    estimated_delivery_minutes: int
    all_medicines_available: bool
    items: List[BidItemResponse] = []
    submitted_at: datetime
    is_winner: bool
    class Config:
        from_attributes = True

class AuctionResponse(BaseModel):
    id: str
    prescription_id: str
    customer_id: str
    status: str
    search_radius_km: float
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration_minutes: int
    total_pharmacies_notified: int
    total_bids_received: int
    bids: List[BidResponse] = []
    created_at: datetime
    class Config:
        from_attributes = True

