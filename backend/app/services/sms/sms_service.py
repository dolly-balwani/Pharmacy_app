import os
import time
import secrets
import logging
import requests
from typing import Dict, Any, Tuple

logger = logging.getLogger(__name__)

# In-memory OTP storage: { phone_number: {"otp": "123456", "expires_at": 1795...} }
OTP_STORE: Dict[str, Dict[str, Any]] = {}

FAST2SMS_API_KEY = os.getenv("FAST2SMS_API_KEY", "").strip()
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "").strip()
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "").strip()
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER", "").strip()

def clean_phone_number(phone: str) -> Tuple[str, str]:
    """
    Returns (e164_format, ten_digit_format)
    e.g. (+919876543210, 9876543210)
    """
    digits = "".join(filter(str.isdigit, phone))
    if digits.startswith("91") and len(digits) == 12:
        return f"+{digits}", digits[2:]
    elif len(digits) == 10:
        return f"+91{digits}", digits
    return f"+{digits}", digits[-10:] if len(digits) >= 10 else digits

def generate_otp() -> str:
    """Generates a secure 6-digit random OTP."""
    return str(secrets.randbelow(900000) + 100000)

def send_real_sms(phone: str, otp_code: str) -> Dict[str, Any]:
    """
    Dispatches real SMS to user's mobile device.
    Supports Fast2SMS (India instant) and Twilio (Global).
    """
    e164_phone, ten_digit = clean_phone_number(phone)

    # 1. Check Fast2SMS (Recommended for India)
    fast2sms_key = os.getenv("FAST2SMS_API_KEY", FAST2SMS_API_KEY)
    if fast2sms_key:
        try:
            url = "https://www.fast2sms.com/dev/bulkV2"
            headers = {
                "authorization": fast2sms_key,
                "Content-Type": "application/json"
            }
            payload = {
                "route": "otp",
                "variables_values": otp_code,
                "numbers": ten_digit
            }
            res = requests.post(url, headers=headers, json=payload, timeout=10)
            data = res.json()
            if res.status_code == 200 and data.get("return") is True:
                return {
                    "sent": True,
                    "provider": "Fast2SMS",
                    "message": f"Real SMS OTP dispatched to {e164_phone}"
                }
            else:
                logger.warning(f"Fast2SMS error: {data}")
                return {
                    "sent": False,
                    "provider": "Fast2SMS",
                    "error": data.get("message") or "Provider rejected dispatch"
                }
        except Exception as e:
            logger.error(f"Fast2SMS request failed: {e}")

    # 2. Check Twilio (Global)
    twilio_sid = os.getenv("TWILIO_ACCOUNT_SID", TWILIO_ACCOUNT_SID)
    twilio_token = os.getenv("TWILIO_AUTH_TOKEN", TWILIO_AUTH_TOKEN)
    twilio_from = os.getenv("TWILIO_PHONE_NUMBER", TWILIO_PHONE_NUMBER)
    if twilio_sid and twilio_token and twilio_from:
        try:
            url = f"https://api.twilio.com/2010-04-01/Accounts/{twilio_sid}/Messages.json"
            data = {
                "From": twilio_from,
                "To": e164_phone,
                "Body": f"Your MediBid AI verification code is {otp_code}. Valid for 10 minutes."
            }
            res = requests.post(url, data=data, auth=(twilio_sid, twilio_token), timeout=10)
            if res.status_code in [200, 201]:
                return {
                    "sent": True,
                    "provider": "Twilio",
                    "message": f"Real SMS OTP dispatched to {e164_phone}"
                }
            else:
                return {
                    "sent": False,
                    "provider": "Twilio",
                    "error": res.text
                }
        except Exception as e:
            logger.error(f"Twilio dispatch failed: {e}")

    # If no gateway key is configured yet:
    logger.info(f"==> [SMS GATEWAY PENDING] Generated OTP for {e164_phone}: {otp_code}")
    return {
        "sent": False,
        "provider": "Local Gateway Buffer",
        "pending_config": "FAST2SMS_API_KEY or TWILIO credentials",
        "console_otp": otp_code,
        "message": f"OTP {otp_code} generated. Add FAST2SMS_API_KEY in backend/.env to send directly to your phone."
    }

def dispatch_phone_otp(phone: str) -> Dict[str, Any]:
    """
    Creates dynamic OTP, stores it with 10 min TTL, and dispatches via SMS.
    """
    e164_phone, ten_digit = clean_phone_number(phone)
    otp_code = generate_otp()
    expires_at = time.time() + 600 # 10 minutes

    # Store in memory
    OTP_STORE[e164_phone] = {
        "otp": otp_code,
        "expires_at": expires_at
    }
    # Also store by 10 digit format
    OTP_STORE[ten_digit] = {
        "otp": otp_code,
        "expires_at": expires_at
    }

    delivery_status = send_real_sms(e164_phone, otp_code)
    return {
        "status": "success",
        "phone": e164_phone,
        "delivery": delivery_status,
        # Only surface fallback if gateway is not connected yet so testing is never blocked
        "gateway_connected": delivery_status["sent"],
        "otp_code": otp_code if not delivery_status["sent"] else None
    }

def verify_phone_otp_code(phone: str, submitted_code: str) -> Tuple[bool, str]:
    """
    Validates dynamic OTP code and checks expiry.
    """
    e164_phone, ten_digit = clean_phone_number(phone)
    record = OTP_STORE.get(e164_phone) or OTP_STORE.get(ten_digit)

    if not record:
        return False, "No OTP request found for this mobile number. Please request a new OTP."

    if time.time() > record["expires_at"]:
        OTP_STORE.pop(e164_phone, None)
        OTP_STORE.pop(ten_digit, None)
        return False, "OTP has expired. Please request a fresh OTP."

    if submitted_code.strip() != record["otp"]:
        return False, "Incorrect verification code. Please check and try again."

    # Invalidate after successful verification
    OTP_STORE.pop(e164_phone, None)
    OTP_STORE.pop(ten_digit, None)
    return True, "Verification successful"
