import uuid, enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, Enum, DateTime, Float, Integer, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class OrderStatus(str, enum.Enum):
    PRESCRIPTION_SUBMITTED = "prescription_submitted"
    AI_EXTRACTION_COMPLETED = "ai_extraction_completed"
    PHARMACY_SELECTED = "pharmacy_selected"
    AWAITING_PHARMACIST_VERIFICATION = "awaiting_pharmacist_verification"
    PHARMACIST_APPROVED = "pharmacist_approved"
    PHARMACIST_REJECTED = "pharmacist_rejected"
    PREPARING_ORDER = "preparing_order"
    READY_FOR_DISPATCH = "ready_for_dispatch"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class Order(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    auction_id = Column(String, ForeignKey("auctions.id"), nullable=False)
    customer_id = Column(String, ForeignKey("users.id"), nullable=False)
    pharmacy_id = Column(String, ForeignKey("pharmacies.id"), nullable=False)
    bid_id = Column(String, ForeignKey("bids.id"), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PHARMACY_SELECTED)
    subtotal = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    delivery_charge = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    delivery_address = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    auction = relationship("Auction", back_populates="order")
    items = relationship("OrderItem", back_populates="order")
    pharmacist_approval = relationship("PharmacistApproval", back_populates="order", uselist=False)
    delivery = relationship("Delivery", back_populates="order", uselist=False)
    payment = relationship("Payment", back_populates="order", uselist=False)
    compliance_exceptions = relationship("ComplianceException", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    medicine_name = Column(String, nullable=False)
    brand = Column(String, nullable=True)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)
    is_generic = Column(Boolean, default=False)
    order = relationship("Order", back_populates="items")

class PharmacistApproval(Base):
    __tablename__ = "pharmacist_approvals"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String, ForeignKey("orders.id"), unique=True, nullable=False)
    pharmacist_id = Column(String, nullable=False)
    pharmacist_name = Column(String, nullable=False)
    registration_number = Column(String, nullable=False)
    is_approved = Column(Boolean, nullable=False)
    rejection_reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    verified_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    order = relationship("Order", back_populates="pharmacist_approval")

class Delivery(Base):
    __tablename__ = "deliveries"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String, ForeignKey("orders.id"), unique=True, nullable=False)
    delivery_partner = Column(String, default="Demo Rider")
    rider_name = Column(String, nullable=True)
    rider_phone = Column(String, nullable=True)
    estimated_delivery_minutes = Column(Integer, default=30)
    pickup_time = Column(DateTime, nullable=True)
    delivery_time = Column(DateTime, nullable=True)
    status = Column(String, default="assigned")
    tracking_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    order = relationship("Order", back_populates="delivery")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String, ForeignKey("orders.id"), unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    payment_method = Column(String, default="demo_payment")
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    transaction_id = Column(String, nullable=True)
    paid_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    order = relationship("Order", back_populates="payment")

