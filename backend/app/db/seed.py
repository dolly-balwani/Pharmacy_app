import asyncio
from app.db.session import engine, async_session
from app.db.base import Base
from app.models.user import User, UserRole, CustomerProfile
from app.models.pharmacy import Pharmacy, Pharmacist, VerificationStatus
from app.models.agent import AIAgent, AgentStatus
from app.core.security import get_password_hash
from sqlalchemy import select

PHARMACY_DATA = [
    {"uid": "demo-ph-user-001", "email": "pharmacy@medibid.ai", "owner": "Rajesh Kumar",
     "name": "MedPlus Pharmacy - Koramangala", "lat": 12.9340, "lng": 77.6260,
     "addr": "123, 4th Block, Koramangala, Bangalore", "city": "Bangalore", "state": "Karnataka",
     "pin": "560034", "lic": "KA/BNG/20/12345", "gst": "29ABCDE1234F1Z5",
     "ph_name": "Dr. Anand Reddy", "ph_reg": "KA-PHARM-001", "rating": 4.7},
    {"uid": "demo-ph-user-002", "email": "pharmacy2@medibid.ai", "owner": "Sunita Patel",
     "name": "Apollo Pharmacy - HSR Layout", "lat": 12.9116, "lng": 77.6389,
     "addr": "56, 27th Main, HSR Layout, Bangalore", "city": "Bangalore", "state": "Karnataka",
     "pin": "560102", "lic": "KA/BNG/20/12346", "gst": "29ABCDE1234F2Z6",
     "ph_name": "Dr. Meera Iyer", "ph_reg": "KA-PHARM-002", "rating": 4.5},
    {"uid": "demo-ph-user-003", "email": "pharmacy3@medibid.ai", "owner": "Vikram Singh",
     "name": "Netmeds Store - BTM Layout", "lat": 12.9166, "lng": 77.6101,
     "addr": "78, 2nd Stage, BTM Layout, Bangalore", "city": "Bangalore", "state": "Karnataka",
     "pin": "560076", "lic": "KA/BNG/20/12347", "gst": "29ABCDE1234F3Z7",
     "ph_name": "Dr. Suresh Nair", "ph_reg": "KA-PHARM-003", "rating": 4.3},
    {"uid": "demo-ph-user-004", "email": "pharmacy4@medibid.ai", "owner": "Deepa Murthy",
     "name": "Wellness Forever - Jayanagar", "lat": 12.9250, "lng": 77.5938,
     "addr": "34, 11th Main, Jayanagar 4th Block, Bangalore", "city": "Bangalore", "state": "Karnataka",
     "pin": "560041", "lic": "KA/BNG/20/12348", "gst": "29ABCDE1234F4Z8",
     "ph_name": "Dr. Kavita Hegde", "ph_reg": "KA-PHARM-004", "rating": 4.8},
    {"uid": "demo-ph-user-005", "email": "pharmacy5@medibid.ai", "owner": "Arun Menon",
     "name": "1mg Store - Indiranagar", "lat": 12.9784, "lng": 77.6408,
     "addr": "90, 100 Feet Road, Indiranagar, Bangalore", "city": "Bangalore", "state": "Karnataka",
     "pin": "560038", "lic": "KA/BNG/20/12349", "gst": "29ABCDE1234F5Z9",
     "ph_name": "Dr. Ravi Shankar", "ph_reg": "KA-PHARM-005", "rating": 4.6},
]

AGENTS = [
    ("Prescription Vision Agent", "Extracts medicine details from prescription images using AI-powered OCR", "prescription_vision", 142, 3),
    ("Geo-Broadcast Agent", "Discovers nearby pharmacies and manages real-time bidding sessions", "geo_broadcast", 89, 1),
    ("Pharmacy Co-Pilot Agent", "Interprets quotations, validates pricing, provides competitive insights", "pricing_copilot", 76, 2),
    ("Compliance Agent", "Audits pharmacy documents, drug schedules, substitution safety", "compliance_audit", 61, 1),
    ("Merchant Onboarding Agent", "Processes pharmacy registration documents and validates onboarding", "merchant_onboarding", 23, 0),
    ("Logistics Agent", "Coordinates delivery partner assignment and dispatch tracking", "logistics_dispatch", 54, 1),
    ("Analytics Agent", "Generates marketplace intelligence and operational insights", "admin_analytics", 38, 0),
    ("Central Orchestrator", "Coordinates all agents through the prescription-to-delivery workflow", "orchestrator", 142, 2),
]

async def seed_database():
    print("Creating database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created.")
    
    async with async_session() as db:
        result = await db.execute(select(User).where(User.email == "customer@medibid.ai"))
        if result.scalar_one_or_none():
            print("Already seeded.")
            return

        print("Hashing password...")
        demo_hash = get_password_hash("password123")
        print("Password hashed.")

        # Customer
        customer = User(id="cust-001", email="customer@medibid.ai",
            hashed_password=demo_hash, full_name="Priya Sharma",
            phone="+91-9876543210", role=UserRole.CUSTOMER)
        db.add(customer)
        db.add(CustomerProfile(user_id="cust-001", address="42, MG Road, Koramangala",
            city="Bangalore", state="Karnataka", pincode="560034", latitude="12.9352", longitude="77.6245"))

        # Admin
        db.add(User(id="admin-001", email="admin@medibid.ai",
            hashed_password=demo_hash, full_name="Compliance Officer",
            phone="+91-9876543211", role=UserRole.ADMIN))

        # Pharmacies
        for pd in PHARMACY_DATA:
            db.add(User(id=pd["uid"], email=pd["email"], hashed_password=demo_hash,
                full_name=pd["owner"], phone="+91-9876543212", role=UserRole.PHARMACY))
            await db.flush()
            pharmacy = Pharmacy(owner_id=pd["uid"], name=pd["name"], contact_number="+91-9876543212",
                email=pd["email"], address=pd["addr"], city=pd["city"], state=pd["state"],
                pincode=pd["pin"], latitude=pd["lat"], longitude=pd["lng"],
                drug_license_number=pd["lic"], gst_number=pd["gst"],
                verification_status=VerificationStatus.VERIFIED, rating=pd["rating"])
            db.add(pharmacy)
            await db.flush()
            db.add(Pharmacist(pharmacy_id=pharmacy.id, name=pd["ph_name"], registration_number=pd["ph_reg"]))

        # AI Agents
        for name, desc, atype, completed, failed in AGENTS:
            rate = round(completed / max(completed + failed, 1) * 100, 1)
            db.add(AIAgent(name=name, description=desc, agent_type=atype, status=AgentStatus.IDLE,
                tasks_completed=completed, tasks_failed=failed, success_rate=rate))
        
        await db.commit()
        print("✅ Database seeded with demo data!")

if __name__ == "__main__":
    asyncio.run(seed_database())
