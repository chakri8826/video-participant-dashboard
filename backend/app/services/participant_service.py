from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.models.participant import Participant
from app.schemas.participant import ParticipantCreate, ParticipantUpdate
from app.utils.logger import setup_logger

logger = setup_logger(__name__)


class ParticipantService:

    @staticmethod
    def get_participants(db: Session, search: Optional[str] = None) -> List[Participant]:
        logger.info(f"Fetching participants with search query: {search}")
        
        query = db.query(Participant)
        
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(Participant.name.ilike(search_pattern))
            logger.info(f"Filtered participants by name pattern: {search_pattern}")
        
        participants = query.all()
        logger.info(f"Retrieved {len(participants)} participants")
        
        return participants

    @staticmethod
    def get_participant_by_id(db: Session, participant_id: int) -> Optional[Participant]:
        logger.info(f"Fetching participant with ID: {participant_id}")
        
        participant = db.query(Participant).filter(Participant.id == participant_id).first()
        
        if participant:
            logger.info(f"Found participant: {participant.name} (ID: {participant_id})")
        else:
            logger.warning(f"Participant with ID {participant_id} not found")
        
        return participant

    @staticmethod
    def update_mic_state(db: Session, participant_id: int, mic_on: bool) -> Optional[Participant]:
        logger.info(f"Updating mic state for participant {participant_id} to {mic_on}")
        
        participant = ParticipantService.get_participant_by_id(db, participant_id)
        
        if not participant:
            logger.error(f"Cannot update mic state: participant {participant_id} not found")
            return None
        
        participant.mic_on = mic_on
        
        db.commit()
        db.refresh(participant)
        
        logger.info(f"Successfully updated mic state for participant {participant_id}")
        return participant

    @staticmethod
    def update_camera_state(db: Session, participant_id: int, camera_on: bool) -> Optional[Participant]:
        logger.info(f"Updating camera state for participant {participant_id} to {camera_on}")
        
        participant = ParticipantService.get_participant_by_id(db, participant_id)
        
        if not participant:
            logger.error(f"Cannot update camera state: participant {participant_id} not found")
            return None
        
        participant.camera_on = camera_on
        
        db.commit()
        db.refresh(participant)
        
        logger.info(f"Successfully updated camera state for participant {participant_id}")
        return participant

    @staticmethod
    def update_online_status(db: Session, participant_id: int, is_online: bool) -> Optional[Participant]:
        logger.info(f"Updating online status for participant {participant_id} to {is_online}")
        
        participant = ParticipantService.get_participant_by_id(db, participant_id)
        
        if not participant:
            logger.error(f"Cannot update online status: participant {participant_id} not found")
            return None
        
        participant.is_online = is_online
        
        db.commit()
        db.refresh(participant)
        
        logger.info(f"Successfully updated online status for participant {participant_id}")
        return participant
