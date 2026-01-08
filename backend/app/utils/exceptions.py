from fastapi import HTTPException


class ParticipantNotFoundError(HTTPException):
    def __init__(self, participant_id: int):
        super().__init__(status_code=404, detail=f"Participant with ID {participant_id} not found")


class DatabaseError(HTTPException):
    def __init__(self, detail: str = "Database operation failed"):
        super().__init__(status_code=500, detail=detail)