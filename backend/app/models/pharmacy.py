import uuid, enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, Enum, DateTime, Boolean, ForeignKey, Float, Text, Integer
from sqlalchemy.orm import relationship
from app.db.base import Base

class VerificationStatus(str, enum.Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"
    EXPIRED = "expired"

class Pharmacy(Base):
    __tablename__ = "pharmacies"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    contact_number = Column(String, nullable=False)
    email = Column(String, nullable=True)
    address = Column(Text, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    pincode = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    drug_license_number = Column(String, nullable=True)
    gst_number = Column(String, nullable=True)
    operating_hours_start = Column(String, default="09:00")
    operating_hours_end = Column(String, default="21:00")
    is_active = Column(Boolean, default=True)
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING)
    rating = Column(Float, default=4.0)
    total_orders = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    owner = relationship("User", back_populates="pharmacies")
    documents = relationship("PharmacyDocument", back_populates="pharmacy")
    pharmacists = relationship("Pharmacist", back_populates="pharmacy")
    auction_participations = relationship("AuctionParticipant", back_populates="pharmacy")
    bids = relationship("Bid", back_populates="pharmacy")

class PharmacyDocument(Base):
    __tablename__ = "pharmacy_documents"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    pharmacy_id = Column(String, ForeignKey("pharmacies.id"), nullable=False)
    document_type = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    verified_at = Column(DateTime, nullable=True)
    expiry_date = Column(DateTime, nullable=True)
    pharmacy = relationship("Pharmacy", back_populates="documents")

class Pharmacist(Base):
    __tablename__ = "pharmacists"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    pharmacy_id = Column(String, ForeignKey("pharmacies.id"), nullable=False)
    name = Column(String, nullable=False)
    registration_number = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    pharmacy = relationship("Pharmacy", back_populates="pharmacists")

