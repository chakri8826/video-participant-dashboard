from sqlalchemy import Column, Integer, String, Boolean, DateTime, Index
from sqlalchemy.sql import func
from app.core.database import Base


class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    email = Column(String, nullable=False)
    role = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    is_online = Column(Boolean, default=False, nullable=False)
    mic_on = Column(Boolean, default=False, nullable=False)
    camera_on = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    __table_args__ = (
        Index('idx_participant_name', 'name'),
    )

