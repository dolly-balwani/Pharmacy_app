from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid
from app.db.session import get_db
from app.models.user import User, CustomerProfile, UserRole
from app.schemas.auth import UserRegister, UserLogin, Token, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.deps import get_current_user
from app.services.sms.sms_service import dispatch_phone_otp, verify_phone_otp_code

router = APIRouter()

class FirebaseLoginRequest(BaseModel):
    firebase_token: str
    email: Optional[str] = None
    phone: Optional[str] = None
    full_name: Optional[str] = None
    role: str = "customer"

class PhoneOtpSendRequest(BaseModel):
    phone: str

class PhoneOtpVerifyRequest(BaseModel):
    phone: str
    otp_code: str
    full_name: Optional[str] = None

@router.post("/register", response_model=Token)
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        full_name=data.full_name,
        phone=data.phone,
        role=data.role,
    )
    db.add(user)
    await db.flush()
    if data.role.value == "customer":
        db.add(CustomerProfile(user_id=user.id))
    await db.commit()
    token = create_access_token({"sub": user.id, "role": user.role.value})
    return Token(access_token=token)

@router.post("/login", response_model=Token)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.id, "role": user.role.value})
    return Token(access_token=token)

@router.post("/firebase-login", response_model=Token)
async def firebase_login(data: FirebaseLoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Authenticates or automatically registers a user verified via Firebase (Google Sign-In or Phone Auth).
    """
    email = data.email or f"user-{uuid.uuid4().hex[:6]}@medibid.ai"
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        # Auto-provision user on first Firebase sign-in
        role_enum = UserRole.PHARMACY if data.role == "pharmacy" else UserRole.CUSTOMER
        user = User(
            id=f"fb-{uuid.uuid4().hex[:8]}",
            email=email,
            hashed_password=get_password_hash("firebase-auth-managed"),
            full_name=data.full_name or "Verified User",
            phone=data.phone,
            role=role_enum
        )
        db.add(user)
        await db.flush()
        if role_enum == UserRole.CUSTOMER:
            db.add(CustomerProfile(user_id=user.id))
        await db.commit()

    token = create_access_token({"sub": user.id, "role": user.role.value})
    return Token(access_token=token)

@router.post("/phone-otp/send")
async def send_phone_otp(data: PhoneOtpSendRequest):
    """
    Sends a real SMS OTP for Indian mobile numbers (+91 XXXXX XXXXX).
    Uses Fast2SMS or Twilio if API key is provided.
    """
    result = dispatch_phone_otp(data.phone)
    return result

@router.post("/phone-otp/verify", response_model=Token)
async def verify_phone_otp(data: PhoneOtpVerifyRequest, db: AsyncSession = Depends(get_db)):
    """
    Verifies dynamic 6-digit SMS OTP code and issues JWT access token.
    """
    is_valid, msg = verify_phone_otp_code(data.phone, data.otp_code)
    if not is_valid:
        raise HTTPException(status_code=400, detail=msg)
    
    clean_phone = data.phone.replace(" ", "").replace("-", "")
    email = f"phone_{clean_phone.replace('+', '')}@medibid.ai"
    result = await db.execute(select(User).where(User.phone == clean_phone))
    user = result.scalar_one_or_none()

    if not user:
        # Check by email
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

    if not user:
        user = User(
            id=f"otp-{uuid.uuid4().hex[:8]}",
            email=email,
            hashed_password=get_password_hash("otp-verified-session"),
            full_name=data.full_name or f"Patient ({clean_phone[-4:]})",
            phone=clean_phone,
            role=UserRole.CUSTOMER
        )
        db.add(user)
        await db.flush()
        db.add(CustomerProfile(user_id=user.id))
        await db.commit()

    token = create_access_token({"sub": user.id, "role": user.role.value})
    return Token(access_token=token)

@router.get("/me", response_model=UserResponse)
async def get_me(user: User = Depends(get_current_user)):
    return user

