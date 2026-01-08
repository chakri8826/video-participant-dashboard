from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.participant import (
    ParticipantResponse,
    MicUpdateRequest,
    CameraUpdateRequest,
    StatusUpdateRequest
)
from app.services.participant_service import ParticipantService
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

router = APIRouter(prefix="/participants", tags=["participants"])


@router.get("", response_model=List[ParticipantResponse])
def get_participants(
    search: Optional[str] = Query(None, description="Search participants by name (case-insensitive)"),
    db: Session = Depends(get_db)
):
    try:
        participants = ParticipantService.get_participants(db, search)
        return participants
    except Exception as e:
        logger.error(f"Error fetching participants: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error while fetching participants")


@router.get("/{participant_id}", response_model=ParticipantResponse)
def get_participant(participant_id: int, db: Session = Depends(get_db)):
    try:
        participant = ParticipantService.get_participant_by_id(db, participant_id)
        
        if not participant:
            logger.warning(f"Participant {participant_id} not found")
            raise HTTPException(status_code=404, detail=f"Participant with ID {participant_id} not found")
        
        return participant
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching participant {participant_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error while fetching participant")


@router.patch("/{participant_id}/mic", response_model=ParticipantResponse)
def update_mic_state(
    participant_id: int,
    request: MicUpdateRequest,
    db: Session = Depends(get_db)
):
    try:
        participant = ParticipantService.update_mic_state(db, participant_id, request.mic_on)
        
        if not participant:
            logger.warning(f"Participant {participant_id} not found for mic update")
            raise HTTPException(status_code=404, detail=f"Participant with ID {participant_id} not found")
        
        return participant
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating mic state for participant {participant_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error while updating mic state")


@router.patch("/{participant_id}/camera", response_model=ParticipantResponse)
def update_camera_state(
    participant_id: int,
    request: CameraUpdateRequest,
    db: Session = Depends(get_db)
):
    try:
        participant = ParticipantService.update_camera_state(db, participant_id, request.camera_on)
        
        if not participant:
            logger.warning(f"Participant {participant_id} not found for camera update")
            raise HTTPException(status_code=404, detail=f"Participant with ID {participant_id} not found")
        
        return participant
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating camera state for participant {participant_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error while updating camera state")


@router.patch("/{participant_id}/status", response_model=ParticipantResponse)
def update_online_status(
    participant_id: int,
    request: StatusUpdateRequest,
    db: Session = Depends(get_db)
):
    try:
        participant = ParticipantService.update_online_status(db, participant_id, request.is_online)
        
        if not participant:
            logger.warning(f"Participant {participant_id} not found for status update")
            raise HTTPException(status_code=404, detail=f"Participant with ID {participant_id} not found")
        
        return participant
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating online status for participant {participant_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error while updating online status")

