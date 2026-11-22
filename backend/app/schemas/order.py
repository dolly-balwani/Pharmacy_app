from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OrderCreate(BaseModel):
    auction_id: str
    bid_id: str
    delivery_address: Optional[str] = None

class PharmacistApprovalRequest(BaseModel):
    pharmacist_name: str
    registration_number: str
    notes: Optional[str] = None

class PharmacistRejectionRequest(BaseModel):
    pharmacist_name: str
    registration_number: str
    rejection_reason: str

class OrderStatusUpdate(BaseModel):
    status: str

class OrderResponse(BaseModel):
    id: str
    auction_id: str
    customer_id: str
    pharmacy_id: str
    status: str
    subtotal: float
    discount_amount: float
    delivery_charge: float
    total_amount: float
    delivery_address: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

