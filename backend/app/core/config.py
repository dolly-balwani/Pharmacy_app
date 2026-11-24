from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "MediBid AI"
    VERSION: str = "1.0.0"
    SECRET_KEY: str = "medibid-dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    DATABASE_URL: str = "sqlite+aiosqlite:///./medibid.db"
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]
    GEMINI_API_KEY: str = ""
    FAST2SMS_API_KEY: str = ""
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024
    DEFAULT_AUCTION_DURATION_MINUTES: int = 15
    DEFAULT_SEARCH_RADIUS_KM: float = 1.0
    EXPANDED_SEARCH_RADIUS_KM: float = 2.0
    MIN_PHARMACIES_BEFORE_EXPAND: int = 3

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

settings = Settings()

