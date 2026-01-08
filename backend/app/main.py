from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.core.config import CORS_ORIGINS
from app.routes import participants
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

app = FastAPI(
    title="Video Participant Dashboard API",
    description="REST API for managing video call participants",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(participants.router)


@app.on_event("startup")
async def startup_event():
    logger.info("Starting up application...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}", exc_info=True)
        raise


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down application...")


@app.get("/")
async def root():
    return {
        "message": "Video Participant Dashboard API",
        "docs": "/docs",
        "version": "1.0.0"
    }
