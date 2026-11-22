from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.pharmacy import Pharmacy, VerificationStatus
from app.models.auction import Auction, AuctionStatus
from app.models.order import Order, OrderStatus
from app.models.compliance import ComplianceException

router = APIRouter()

@router.get("/analytics")
async def analytics(db: AsyncSession = Depends(get_db)):
    total_customers = (await db.execute(select(func.count(User.id)).where(User.role == UserRole.CUSTOMER))).scalar() or 0
    total_pharmacies = (await db.execute(select(func.count(Pharmacy.id)))).scalar() or 0
    verified_pharmacies = (await db.execute(select(func.count(Pharmacy.id)).where(Pharmacy.verification_status == VerificationStatus.VERIFIED))).scalar() or 0
    active_auctions = (await db.execute(select(func.count(Auction.id)).where(Auction.status == AuctionStatus.ACTIVE))).scalar() or 0
    total_orders = (await db.execute(select(func.count(Order.id)))).scalar() or 0
    delivered = (await db.execute(select(func.count(Order.id)).where(Order.status == OrderStatus.DELIVERED))).scalar() or 0
    return {"total_customers": total_customers, "total_pharmacies": total_pharmacies,
            "verified_pharmacies": verified_pharmacies, "active_auctions": active_auctions,
            "total_orders": total_orders, "completed_orders": delivered,
            "pending_verification": total_pharmacies - verified_pharmacies, "ai_agent_success_rate": 95.5}

@router.get("/pharmacies")
async def admin_pharmacies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Pharmacy).order_by(Pharmacy.created_at.desc()))
    return [{"id": p.id, "name": p.name, "city": p.city, "state": p.state,
             "verification_status": p.verification_status.value, "drug_license_number": p.drug_license_number,
             "is_active": p.is_active, "rating": p.rating, "total_orders": p.total_orders,
             "created_at": p.created_at.isoformat()} for p in result.scalars().all()]

@router.get("/auctions")
async def admin_auctions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Auction).order_by(Auction.created_at.desc()))
    return [{"id": a.id, "status": a.status.value, "total_pharmacies_notified": a.total_pharmacies_notified,
             "total_bids_received": a.total_bids_received,
             "start_time": a.start_time.isoformat() if a.start_time else None,
             "end_time": a.end_time.isoformat() if a.end_time else None} for a in result.scalars().all()]

@router.get("/compliance-exceptions")
async def compliance_exceptions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ComplianceException).order_by(ComplianceException.created_at.desc()))
    return [{"id": e.id, "exception_type": e.exception_type, "description": e.description,
             "severity": e.severity, "is_resolved": e.is_resolved,
             "created_at": e.created_at.isoformat()} for e in result.scalars().all()]

@router.get("/customers")
async def admin_customers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.role == UserRole.CUSTOMER).order_by(User.created_at.desc()))
    return [{"id": u.id, "full_name": u.full_name, "email": u.email, "phone": u.phone,
             "is_active": u.is_active, "created_at": u.created_at.isoformat()} for u in result.scalars().all()]

