from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MedicineExtraction(BaseModel):
    medicine_name: str
    brand_name: Optional[str] = None
    active_ingredient: Optional[str] = None
    strength: Optional[str] = None
    quantity: Optional[int] = None
    dosage: Optional[str] = None
    confidence: float = 0.0
    verification_required: bool = False
    schedule_category: Optional[str] = None

class PrescriptionResponse(BaseModel):
    id: str
    user_id: str
    file_path: str
    file_type: str
    status: str
    doctor_name: Optional[str] = None
    patient_name: Optional[str] = None
    medicines: List[MedicineExtraction] = []
    created_at: datetime
    class Config:
        from_attributes = True

