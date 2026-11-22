from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PharmacyRegister(BaseModel):
    name: str = Field(..., min_length=2)
    contact_number: str
    email: Optional[str] = None
    address: str
    city: str
    state: str
    pincode: str
    latitude: float
    longitude: float
    drug_license_number: Optional[str] = None
    gst_number: Optional[str] = None
    operating_hours_start: str = "09:00"
    operating_hours_end: str = "21:00"

class PharmacyResponse(BaseModel):
    id: str
    name: str
    contact_number: str
    address: str
    city: str
    state: str
    pincode: str
    latitude: float
    longitude: float
    verification_status: str
    rating: float
    total_orders: int
    is_active: bool
    distance_km: Optional[float] = None
    class Config:
        from_attributes = True

