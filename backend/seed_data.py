import sys
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.participant import Participant
from app.utils.logger import setup_logger

logger = setup_logger(__name__)


def seed_participants():
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    try:
        existing_count = db.query(Participant).count()
        if existing_count > 0:
            logger.info(f"Database already has {existing_count} participants. Skipping seed.")
            return
        
        participants_data = [
            {
                "name": "John Doe",
                "email": "john.doe@example.com",
                "role": "Host",
                "avatar_url": "https://i.pravatar.cc/150?img=1",
                "is_online": True,
                "mic_on": True,
                "camera_on": True,
            },
            {
                "name": "Jane Smith",
                "email": "jane.smith@example.com",
                "role": "Participant",
                "avatar_url": "https://i.pravatar.cc/150?img=5",
                "is_online": True,
                "mic_on": False,
                "camera_on": True,
            },
            {
                "name": "Bob Johnson",
                "email": "bob.johnson@example.com",
                "role": "Participant",
                "avatar_url": "https://i.pravatar.cc/150?img=12",
                "is_online": False,
                "mic_on": False,
                "camera_on": False,
            },
            {
                "name": "Alice Williams",
                "email": "alice.williams@example.com",
                "role": "Moderator",
                "avatar_url": "https://i.pravatar.cc/150?img=9",
                "is_online": True,
                "mic_on": True,
                "camera_on": False,
            },
            {
                "name": "Charlie Brown",
                "email": "charlie.brown@example.com",
                "role": "Participant",
                "avatar_url": "https://i.pravatar.cc/150?img=33",
                "is_online": True,
                "mic_on": False,
                "camera_on": True,
            },
            {
                "name": "Diana Prince",
                "email": "diana.prince@example.com",
                "role": "Participant",
                "avatar_url": None,
                "is_online": False,
                "mic_on": False,
                "camera_on": False,
            },
        ]
        
        participants = [Participant(**data) for data in participants_data]
        
        db.add_all(participants)
        db.commit()
        
        logger.info(f"Successfully seeded {len(participants)} participants into the database!")
        
        for participant in participants:
            logger.info(f"  - {participant.name} (ID: {participant.id}) - {participant.role}")
            
    except Exception as e:
        logger.error(f"Error seeding database: {str(e)}", exc_info=True)
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    logger.info("Starting database seeding...")
    try:
        seed_participants()
        logger.info("Database seeding completed successfully!")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Database seeding failed: {str(e)}")
        sys.exit(1)

