import uuid, enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, Enum, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class UserRole(str, enum.Enum):
    CUSTOMER = "customer"
    PHARMACY = "pharmacy"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.CUSTOMER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    customer_profile = relationship("CustomerProfile", back_populates="user", uselist=False)
    pharmacies = relationship("Pharmacy", back_populates="owner")
    prescriptions = relationship("Prescription", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class CustomerProfile(Base):
    __tablename__ = "customer_profiles"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    address = Column(Text, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    pincode = Column(String, nullable=True)
    latitude = Column(String, nullable=True)
    longitude = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    user = relationship("User", back_populates="customer_profile")

