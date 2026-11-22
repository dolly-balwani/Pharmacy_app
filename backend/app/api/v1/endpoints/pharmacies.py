from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import math
from app.db.session import get_db
from app.models.user import User
from app.models.pharmacy import Pharmacy, Pharmacist, VerificationStatus
from app.schemas.pharmacy import PharmacyRegister, PharmacyResponse
from app.core.deps import get_current_user

router = APIRouter()

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))

@router.post("/register", response_model=PharmacyResponse)
async def register_pharmacy(data: PharmacyRegister, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    pharmacy = Pharmacy(owner_id=user.id, **data.model_dump())
    db.add(pharmacy)
    await db.commit()
    await db.refresh(pharmacy)
    return PharmacyResponse.model_validate(pharmacy)

@router.get("/nearby", response_model=List[PharmacyResponse])
async def nearby_pharmacies(latitude: float = Query(...), longitude: float = Query(...), radius_km: float = Query(default=2.0), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Pharmacy).where(Pharmacy.is_active == True, Pharmacy.verification_status == VerificationStatus.VERIFIED))
    nearby = []
    for p in result.scalars().all():
        dist = haversine(latitude, longitude, p.latitude, p.longitude)
        if dist <= radius_km:
            resp = PharmacyResponse.model_validate(p)
            resp.distance_km = round(dist, 2)
            nearby.append(resp)
    nearby.sort(key=lambda x: x.distance_km or 999)
    return nearby

@router.get("", response_model=List[PharmacyResponse])
async def list_pharmacies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Pharmacy).order_by(Pharmacy.created_at.desc()))
    return [PharmacyResponse.model_validate(p) for p in result.scalars().all()]

@router.get("/{pharmacy_id}", response_model=PharmacyResponse)
async def get_pharmacy(pharmacy_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Pharmacy).where(Pharmacy.id == pharmacy_id))
    p = result.scalar_one_or_none()
    if not p:
        raise HTTPException(status_code=404, detail="Pharmacy not found")
    return PharmacyResponse.model_validate(p)

