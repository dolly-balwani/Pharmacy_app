from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.agent import AIAgent, AIExecutionLog

router = APIRouter()

@router.get("")
async def list_agents(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AIAgent).order_by(AIAgent.name))
    return [{"id": a.id, "name": a.name, "description": a.description, "agent_type": a.agent_type,
             "status": a.status.value if a.status else "idle", "current_task": a.current_task,
             "tasks_completed": a.tasks_completed, "tasks_failed": a.tasks_failed,
             "success_rate": a.success_rate,
             "last_execution": a.last_execution.isoformat() if a.last_execution else None}
            for a in result.scalars().all()]

@router.get("/logs")
async def get_logs(limit: int = 50, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AIExecutionLog).order_by(AIExecutionLog.created_at.desc()).limit(limit))
    return [{"id": l.id, "agent_id": l.agent_id, "agent_name": l.agent_name, "task_type": l.task_type,
             "status": l.status, "execution_time_ms": l.execution_time_ms,
             "created_at": l.created_at.isoformat() if l.created_at else None}
            for l in result.scalars().all()]

@router.get("/{agent_id}")
async def get_agent(agent_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AIAgent).where(AIAgent.id == agent_id))
    a = result.scalar_one_or_none()
    if not a: return {"error": "Agent not found"}
    return {"id": a.id, "name": a.name, "description": a.description, "agent_type": a.agent_type,
            "status": a.status.value if a.status else "idle", "tasks_completed": a.tasks_completed}

