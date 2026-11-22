from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
import os, uuid, aiofiles
from app.db.session import get_db
from app.models.user import User
from app.models.prescription import Prescription, PrescriptionMedicine, PrescriptionStatus
from app.schemas.prescription import PrescriptionResponse, MedicineExtraction
from app.core.deps import get_current_user
from app.core.config import settings

router = APIRouter()

DEMO_MEDICINES = [
    {"name": "Amoxicillin", "brand": "Amoxil", "ingredient": "Amoxicillin Trihydrate", "strength": "500mg", "qty": 21, "dosage": "1 capsule 3 times daily for 7 days", "confidence": 0.95, "schedule": "H"},
    {"name": "Pantoprazole", "brand": "Pan-D", "ingredient": "Pantoprazole Sodium", "strength": "40mg", "qty": 14, "dosage": "1 tablet before breakfast for 14 days", "confidence": 0.92, "schedule": "H"},
    {"name": "Cetirizine", "brand": "Cetzine", "ingredient": "Cetirizine Hydrochloride", "strength": "10mg", "qty": 10, "dosage": "1 tablet at bedtime", "confidence": 0.97, "schedule": None},
]

def _build_response(rx: Prescription, meds=None) -> PrescriptionResponse:
    medicines = []
    if meds:
        medicines = [MedicineExtraction(
            medicine_name=m.medicine_name, brand_name=m.brand_name,
            active_ingredient=m.active_ingredient, strength=m.strength,
            quantity=m.quantity, dosage=m.dosage, confidence=m.confidence,
            verification_required=m.verification_required, schedule_category=m.schedule_category,
        ) for m in meds]
    return PrescriptionResponse(
        id=rx.id, user_id=rx.user_id, file_path=rx.file_path, file_type=rx.file_type,
        status=rx.status.value, doctor_name=rx.doctor_name, patient_name=rx.patient_name,
        medicines=medicines, created_at=rx.created_at,
    )

@router.post("/upload", response_model=PrescriptionResponse)
async def upload_prescription(file: UploadFile = File(...), user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    allowed = ["image/jpeg", "image/png", "application/pdf"]
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, PDF files accepted")
    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = (file.filename or "file.jpg").rsplit(".", 1)[-1]
    fname = f"{uuid.uuid4()}.{ext}"
    fpath = os.path.join(settings.UPLOAD_DIR, fname)
    async with aiofiles.open(fpath, "wb") as f:
        await f.write(content)
    rx = Prescription(user_id=user.id, file_path=f"/uploads/{fname}", file_type=file.content_type, status=PrescriptionStatus.UPLOADED)
    db.add(rx)
    await db.commit()
    await db.refresh(rx)
    return _build_response(rx)

@router.get("", response_model=List[PrescriptionResponse])
async def list_prescriptions(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Prescription).options(selectinload(Prescription.medicines)).where(Prescription.user_id == user.id).order_by(Prescription.created_at.desc()))
    return [_build_response(rx, rx.medicines) for rx in result.scalars().all()]

@router.get("/{prescription_id}", response_model=PrescriptionResponse)
async def get_prescription(prescription_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Prescription).options(selectinload(Prescription.medicines)).where(Prescription.id == prescription_id))
    rx = result.scalar_one_or_none()
    if not rx:
        raise HTTPException(status_code=404, detail="Prescription not found")
    return _build_response(rx, rx.medicines)

@router.post("/{prescription_id}/process", response_model=PrescriptionResponse)
async def process_prescription(prescription_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Prescription).where(Prescription.id == prescription_id))
    rx = result.scalar_one_or_none()
    if not rx:
        raise HTTPException(status_code=404, detail="Prescription not found")
    rx.status = PrescriptionStatus.PROCESSING
    await db.commit()
    # Demo AI extraction fallback
    for m in DEMO_MEDICINES:
        db.add(PrescriptionMedicine(
            prescription_id=rx.id, medicine_name=m["name"], brand_name=m["brand"],
            active_ingredient=m["ingredient"], strength=m["strength"], quantity=m["qty"],
            dosage=m["dosage"], confidence=m["confidence"], schedule_category=m["schedule"],
        ))
    rx.status = PrescriptionStatus.EXTRACTED
    rx.doctor_name = "Dr. Sharma (Demo)"
    rx.patient_name = user.full_name
    await db.commit()
    result = await db.execute(select(Prescription).options(selectinload(Prescription.medicines)).where(Prescription.id == prescription_id))
    rx = result.scalar_one()
    return _build_response(rx, rx.medicines)

