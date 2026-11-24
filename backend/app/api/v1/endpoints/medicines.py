from fastapi import APIRouter, Query
from typing import Optional, List
from app.services.pricing.medicine_pricing import lookup_medicine_pricing, INDIAN_MEDICINE_CATALOG

router = APIRouter()

@router.get("/price-lookup")
async def get_price_lookup(name: str = Query(..., description="Medicine or brand name"), strength: Optional[str] = Query(None)):
    """
    Looks up standard Indian MRP, active generic salt, chemist PTR wholesale margin, and generic substitute savings.
    """
    return lookup_medicine_pricing(name, strength)

@router.get("/catalog")
async def get_medicine_catalog():
    """
    Returns the Indian National Drug Pricing Master catalog.
    """
    return INDIAN_MEDICINE_CATALOG

