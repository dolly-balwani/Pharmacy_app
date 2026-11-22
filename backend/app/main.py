from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
from app.core.config import settings
from app.api.v1.router import api_router
from app.db.session import engine
from app.db.base import Base
import app.models

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    # Seed on startup
    try:
        from app.db.seed import seed_database
        await seed_database()
    except Exception as e:
        print(f"Seed warning: {e}")
    yield
    await engine.dispose()

app = FastAPI(
    title="MediBid AI API",
    description="AI-Native Hyperlocal Pharmacy Bidding & Fulfillment Platform",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

# WebSocket route for auctions is registered in auctions endpoint
# but we also expose it at top level for convenience
from app.api.v1.endpoints.auctions import router as auction_router
app.include_router(auction_router, prefix="/ws", tags=["WebSockets"])

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "MediBid AI", "version": "1.0.0", "demo": True}

