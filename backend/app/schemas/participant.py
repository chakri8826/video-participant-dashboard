from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class ParticipantBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    avatar_url: Optional[str] = None


class ParticipantCreate(ParticipantBase):
    pass


class ParticipantUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    avatar_url: Optional[str] = None


class ParticipantResponse(ParticipantBase):
    id: int
    is_online: bool
    mic_on: bool
    camera_on: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MicUpdateRequest(BaseModel):
    mic_on: bool


class CameraUpdateRequest(BaseModel):
    camera_on: bool


class StatusUpdateRequest(BaseModel):
    is_online: bool