from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from app.db.session import get_db
from app.models.user import User
from app.models.auction import Bid, BidItem, Auction
from app.models.order import Order, OrderItem, OrderStatus, PharmacistApproval, Delivery, Payment, PaymentStatus
from app.schemas.order import OrderCreate, OrderResponse, PharmacistApprovalRequest, PharmacistRejectionRequest, OrderStatusUpdate
from app.core.deps import get_current_user

router = APIRouter()

@router.post("", response_model=OrderResponse)
async def create_order(data: OrderCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Bid).options(selectinload(Bid.items)).where(Bid.id == data.bid_id))
    bid = result.scalar_one_or_none()
    if not bid: raise HTTPException(status_code=404, detail="Bid not found")
    subtotal = sum(i.subtotal for i in bid.items)
    discount = subtotal * (bid.discount_percentage / 100)
    total = round(subtotal - discount + bid.delivery_charge, 2)
    order = Order(auction_id=data.auction_id, customer_id=user.id, pharmacy_id=bid.pharmacy_id,
        bid_id=bid.id, status=OrderStatus.AWAITING_PHARMACIST_VERIFICATION,
        subtotal=round(subtotal, 2), discount_amount=round(discount, 2),
        delivery_charge=bid.delivery_charge, total_amount=total, delivery_address=data.delivery_address)
    db.add(order)
    await db.flush()
    for item in bid.items:
        db.add(OrderItem(order_id=order.id, medicine_name=item.medicine_name, brand=item.brand_offered,
            quantity=item.quantity, unit_price=item.unit_price, subtotal=item.subtotal, is_generic=item.is_generic))
    db.add(Payment(order_id=order.id, amount=total, payment_method="demo_payment"))
    await db.commit()
    await db.refresh(order)
    return OrderResponse.model_validate(order)

@router.get("", response_model=List[OrderResponse])
async def list_orders(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    q = select(Order)
    if user.role.value == "customer":
        q = q.where(Order.customer_id == user.id)
    elif user.role.value == "pharmacy":
        from app.models.pharmacy import Pharmacy
        r = await db.execute(select(Pharmacy.id).where(Pharmacy.owner_id == user.id))
        ids = [row[0] for row in r.all()]
        q = q.where(Order.pharmacy_id.in_(ids))
    result = await db.execute(q.order_by(Order.created_at.desc()))
    return [OrderResponse.model_validate(o) for o in result.scalars().all()]

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).where(Order.id == order_id))
    o = result.scalar_one_or_none()
    if not o: raise HTTPException(status_code=404, detail="Order not found")
    return OrderResponse.model_validate(o)

@router.patch("/{order_id}/status")
async def update_status(order_id: str, data: OrderStatusUpdate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).where(Order.id == order_id))
    o = result.scalar_one_or_none()
    if not o: raise HTTPException(status_code=404, detail="Order not found")
    o.status = data.status
    await db.commit()
    return {"message": "Status updated", "status": data.status}

@router.post("/{order_id}/pharmacist-approval")
async def pharmacist_approval(order_id: str, data: PharmacistApprovalRequest, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).where(Order.id == order_id))
    o = result.scalar_one_or_none()
    if not o: raise HTTPException(status_code=404, detail="Order not found")
    db.add(PharmacistApproval(order_id=o.id, pharmacist_id="reg-pharm-001",
        pharmacist_name=data.pharmacist_name or "Dr. R. Sharma, Reg. Pharmacist",
        registration_number=data.registration_number or "KA-PHARM-001",
        is_approved=True, notes=data.notes))
    o.status = OrderStatus.PHARMACIST_APPROVED
    db.add(Delivery(order_id=o.id, delivery_partner="MediBid Hyperlocal Express", rider_name="Rahul Kumar", rider_phone="+91-9876543210", estimated_delivery_minutes=25))
    await db.commit()
    return {"message": "Order approved", "order_id": o.id}

@router.post("/{order_id}/pharmacist-rejection")
async def pharmacist_rejection(order_id: str, data: PharmacistRejectionRequest, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).where(Order.id == order_id))
    o = result.scalar_one_or_none()
    if not o: raise HTTPException(status_code=404, detail="Order not found")
    db.add(PharmacistApproval(order_id=o.id, pharmacist_id="reg-pharm-001",
        pharmacist_name=data.pharmacist_name or "Dr. R. Sharma, Reg. Pharmacist",
        registration_number=data.registration_number or "KA-PHARM-001",
        is_approved=False, rejection_reason=data.rejection_reason))
    o.status = OrderStatus.PHARMACIST_REJECTED
    await db.commit()
    return {"message": "Order rejected", "order_id": o.id}

@router.get("/{order_id}/invoice")
async def get_gst_invoice(order_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Generate Digital GST Tax Invoice conforming to Indian Tax Regulations."""
    result = await db.execute(select(Order).options(selectinload(Order.items), selectinload(Order.pharmacy)).where(Order.id == order_id))
    o = result.scalar_one_or_none()
    if not o: raise HTTPException(status_code=404, detail="Order not found")
    
    taxable_value = round(o.subtotal - o.discount_amount, 2)
    cgst = round(taxable_value * 0.06, 2)
    sgst = round(taxable_value * 0.06, 2)
    total_tax = round(cgst + sgst, 2)
    
    return {
        "invoice_number": f"INV-{o.id[:8].upper()}",
        "invoice_date": o.created_at.strftime("%Y-%m-%d %H:%M:%S") if o.created_at else "2026-11-22",
        "place_of_supply": "Karnataka (29)",
        "pharmacy": {
            "name": o.pharmacy.name if o.pharmacy else "MedPlus Pharmacy",
            "gstin": o.pharmacy.gst_number if o.pharmacy else "29ABCDE1234F1Z5",
            "drug_license": o.pharmacy.drug_license_number if o.pharmacy else "KA/BNG/20/12345",
            "address": o.pharmacy.address if o.pharmacy else "Koramangala, Bangalore",
        },
        "customer": {
            "name": user.full_name or "Patient",
            "address": o.delivery_address or "Bangalore, India",
        },
        "items": [
            {
                "description": item.medicine_name,
                "hsn_code": "300490",
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "taxable_amount": item.subtotal,
                "gst_rate": "12%",
            } for item in (o.items or [])
        ],
        "financials": {
            "subtotal": o.subtotal,
            "discount": o.discount_amount,
            "taxable_value": taxable_value,
            "cgst_6pct": cgst,
            "sgst_6pct": sgst,
            "delivery_fee": o.delivery_charge,
            "grand_total": o.total_amount,
        },
        "status": "PAID",
        "payment_method": "UPI Instant Settlement",
    }

@router.get("/{order_id}/settlement")
async def get_settlement_ledger(order_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Automated Split-Settlement Ledger: Platform commission deduction and T+1 payout calculation."""
    result = await db.execute(select(Order).where(Order.id == order_id))
    o = result.scalar_one_or_none()
    if not o: raise HTTPException(status_code=404, detail="Order not found")
    
    platform_commission = round(o.total_amount * 0.05, 2) # 5% marketplace commission
    logistics_payout = o.delivery_charge if o.delivery_charge > 0 else 35.0 # Rider payout
    pharmacy_net_payout = round(o.total_amount - platform_commission - (o.delivery_charge if o.delivery_charge > 0 else 0), 2)
    
    return {
        "order_id": o.id,
        "gross_order_value": o.total_amount,
        "platform_commission_5pct": platform_commission,
        "logistics_partner_payout": logistics_payout,
        "pharmacy_net_payout": pharmacy_net_payout,
        "settlement_cycle": "T+1 Daily Auto-Disbursement",
        "settlement_status": "SCHEDULED",
        "payout_rail": "NPCI e-NACH / UPI Autopay",
    }

