import uuid, enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, Enum, DateTime, Integer, Text, Float
from app.db.base import Base

class AgentStatus(str, enum.Enum):
    IDLE = "idle"
    PROCESSING = "processing"
    COMPLETED = "completed"
    NEEDS_REVIEW = "needs_review"
    FAILED = "failed"

class AIAgent(Base):
    __tablename__ = "ai_agents"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=False)
    agent_type = Column(String, nullable=False)
    status = Column(Enum(AgentStatus), default=AgentStatus.IDLE)
    current_task = Column(String, nullable=True)
    tasks_completed = Column(Integer, default=0)
    tasks_failed = Column(Integer, default=0)
    success_rate = Column(Float, default=100.0)
    last_execution = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class AIExecutionLog(Base):
    __tablename__ = "ai_execution_logs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    agent_id = Column(String, nullable=False)
    agent_name = Column(String, nullable=False)
    task_type = Column(String, nullable=False)
    input_data = Column(Text, nullable=True)
    output_data = Column(Text, nullable=True)
    status = Column(String, nullable=False)
    error_message = Column(Text, nullable=True)
    execution_time_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

