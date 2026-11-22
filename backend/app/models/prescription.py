import uuid, enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, Enum, DateTime, Float, Integer, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class PrescriptionStatus(str, enum.Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    EXTRACTED = "extracted"
    REVIEW_REQUIRED = "review_required"
    VERIFIED = "verified"
    FAILED = "failed"

class Prescription(Base):
    __tablename__ = "prescriptions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    status = Column(Enum(PrescriptionStatus), default=PrescriptionStatus.UPLOADED)
    doctor_name = Column(String, nullable=True)
    patient_name = Column(String, nullable=True)
    prescription_date = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    user = relationship("User", back_populates="prescriptions")
    medicines = relationship("PrescriptionMedicine", back_populates="prescription")
    auction = relationship("Auction", back_populates="prescription", uselist=False)

class PrescriptionMedicine(Base):
    __tablename__ = "prescription_medicines"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    prescription_id = Column(String, ForeignKey("prescriptions.id"), nullable=False)
    medicine_name = Column(String, nullable=False)
    brand_name = Column(String, nullable=True)
    active_ingredient = Column(String, nullable=True)
    strength = Column(String, nullable=True)
    quantity = Column(Integer, nullable=True)
    dosage = Column(String, nullable=True)
    confidence = Column(Float, default=0.0)
    verification_required = Column(Boolean, default=False)
    is_generic_allowed = Column(Boolean, default=False)
    schedule_category = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    prescription = relationship("Prescription", back_populates="medicines")

