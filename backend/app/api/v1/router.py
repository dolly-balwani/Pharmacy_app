from fastapi import APIRouter
from app.api.v1.endpoints import auth, prescriptions, pharmacies, auctions, orders, agents, admin, merchant_webhook, medicines

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(prescriptions.router, prefix="/prescriptions", tags=["Prescriptions"])
api_router.include_router(pharmacies.router, prefix="/pharmacies", tags=["Pharmacies"])
api_router.include_router(auctions.router, prefix="/auctions", tags=["Auctions"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
api_router.include_router(agents.router, prefix="/agents", tags=["AI Agents"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
api_router.include_router(merchant_webhook.router, prefix="/merchant", tags=["Merchant Channels (WhatsApp / ERP)"])
api_router.include_router(medicines.router, prefix="/medicines", tags=["Medicine Pricing & Catalog"])


