import uuid, enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, Enum, DateTime, Float, Integer, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class AuctionStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"
    EXPIRED = "expired"
    CANCELLED = "cancelled"

class Auction(Base):
    __tablename__ = "auctions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    prescription_id = Column(String, ForeignKey("prescriptions.id"), nullable=False)
    customer_id = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(AuctionStatus), default=AuctionStatus.PENDING)
    search_radius_km = Column(Float, default=1.0)
    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, default=15)
    total_pharmacies_notified = Column(Integer, default=0)
    total_bids_received = Column(Integer, default=0)
    winning_bid_id = Column(String, nullable=True)
    customer_latitude = Column(Float, nullable=True)
    customer_longitude = Column(Float, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    prescription = relationship("Prescription", back_populates="auction")
    participants = relationship("AuctionParticipant", back_populates="auction")
    bids = relationship("Bid", back_populates="auction")
    order = relationship("Order", back_populates="auction", uselist=False)

class AuctionParticipant(Base):
    __tablename__ = "auction_participants"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    auction_id = Column(String, ForeignKey("auctions.id"), nullable=False)
    pharmacy_id = Column(String, ForeignKey("pharmacies.id"), nullable=False)
    notified_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    responded = Column(Boolean, default=False)
    auction = relationship("Auction", back_populates="participants")
    pharmacy = relationship("Pharmacy", back_populates="auction_participations")

class Bid(Base):
    __tablename__ = "bids"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    auction_id = Column(String, ForeignKey("auctions.id"), nullable=False)
    pharmacy_id = Column(String, ForeignKey("pharmacies.id"), nullable=False)
    total_price = Column(Float, nullable=False)
    discount_percentage = Column(Float, default=0.0)
    delivery_charge = Column(Float, default=0.0)
    estimated_delivery_minutes = Column(Integer, default=30)
    all_medicines_available = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)
    is_winner = Column(Boolean, default=False)
    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    auction = relationship("Auction", back_populates="bids")
    pharmacy = relationship("Pharmacy", back_populates="bids")
    items = relationship("BidItem", back_populates="bid")

class BidItem(Base):
    __tablename__ = "bid_items"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    bid_id = Column(String, ForeignKey("bids.id"), nullable=False)
    medicine_name = Column(String, nullable=False)
    brand_offered = Column(String, nullable=True)
    is_generic = Column(Boolean, default=False)
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    subtotal = Column(Float, nullable=False)
    in_stock = Column(Boolean, default=True)
    bid = relationship("Bid", back_populates="items")

