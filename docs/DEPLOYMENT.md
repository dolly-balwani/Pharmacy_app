# MediBid AI — Deployment Guide

MediBid AI is architected for dual-service cloud deployment on platforms like Render, Railway, or AWS.

## Architecture Topology

```
                  ┌───────────────────────┐
                  │      User Browser     │
                  └───────────┬───────────┘
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
┌───────────────────────┐           ┌───────────────────────┐
│   Frontend (Render)   │           │   Backend (Render)    │
│    Next.js 15 PWA     │           │   FastAPI + Uvicorn   │
│  medibid-ai.onrender  │           │ medibid-api.onrender  │
└───────────────────────┘           └───────────┬───────────┘
                                                │
                                    ┌───────────┴───────────┐
                                    ▼                       ▼
                        ┌───────────────────────┐ ┌───────────────────┐
                        │   Supabase Postgres   │ │    Gemini API     │
                        │   Database + Storage  │ │   Vision / OCR    │
                        └───────────────────────┘ └───────────────────┘
```

## Local Development Setup

### 1. Prerequisites
- Node.js 18+ and npm
- Python 3.10 - 3.14
- Git

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python -m app.db.seed
uvicorn app.main:app --reload --port 8000
```
Backend will be live at `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.

### 3. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Frontend will be live at `http://localhost:3000`.

## Production Deployment (Render)

### Backend Web Service
- **Environment**: Python 3
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `DATABASE_URL`: `postgresql+asyncpg://user:pass@host:5432/db`
  - `SECRET_KEY`: `<generated-random-secret-key>`
  - `GEMINI_API_KEY`: `<your-gemini-key>`
  - `CORS_ORIGINS`: `["https://your-frontend.onrender.com"]`

### Frontend Static/Node Service
- **Environment**: Node
- **Root Directory**: `frontend`
- **Build Command**: `npm install --legacy-peer-deps && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: `https://your-backend.onrender.com`

