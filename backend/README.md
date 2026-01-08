# Video Participant Dashboard API

A RESTful API backend built with FastAPI for managing video call participants. This service provides endpoints to track participant status, microphone, and camera states in real-time.

## Technology Stack

- **Framework**: FastAPI 0.104.1
- **Language**: Python 3.x
- **Database**: PostgreSQL (via SQLAlchemy ORM)
- **ORM**: SQLAlchemy 2.0.23
- **Validation**: Pydantic 2.5.0
- **Server**: Uvicorn 0.24.0

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── core/
│   │   ├── config.py          # Configuration and environment variables
│   │   └── database.py        # Database connection and session management
│   ├── models/
│   │   └── participant.py     # SQLAlchemy database models
│   ├── routes/
│   │   └── participants.py    # API route handlers
│   ├── schemas/
│   │   └── participant.py     # Pydantic request/response schemas
│   ├── services/
│   │   └── participant_service.py  # Business logic layer
│   └── utils/
│       ├── logger.py          # Logging configuration
│       └── exceptions.py      # Custom exception classes
├── requirements.txt            # Python dependencies
└── seed_data.py               # Database seeding script
```

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- PostgreSQL database
- pip (Python package manager)

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables:**
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/dbname
   CORS_ORIGINS=http://localhost:5173
   ```
   Multiple CORS origins can be specified as a comma-separated list.

6. **Run database migrations:**
   The application automatically creates database tables on startup. Ensure your PostgreSQL database is running and accessible.

7. **Seed the database (optional):**
   ```bash
   python seed_data.py
   ```
   This script populates the database with sample participant data if the database is empty.

## Running the Application

### Development Server

Start the development server using Uvicorn:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive API Documentation (Swagger UI)**: http://localhost:8000/docs
- **Alternative API Documentation (ReDoc)**: http://localhost:8000/redoc

### Production Server

For production, use a production ASGI server like Gunicorn with Uvicorn workers:

```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL database connection string (format: `postgresql://user:password@host:port/dbname`) |
| `CORS_ORIGINS` | No | `http://localhost:5173` | Comma-separated list of allowed CORS origins |

## Architecture Overview

### Request Flow

1. **HTTP Request** → FastAPI receives the request
2. **CORS Middleware** → Validates origin (if configured)
3. **Route Handler** → Processes the request in `app/routes/`
4. **Service Layer** → Business logic in `app/services/`
5. **Database Layer** → SQLAlchemy ORM operations via `app/models/`
6. **Response** → Pydantic schema validation and JSON response

### Key Modules

- **`app/main.py`**: Application initialization, middleware configuration, and startup/shutdown events
- **`app/core/config.py`**: Centralized configuration management and environment variable loading
- **`app/core/database.py`**: Database engine, session factory, and dependency injection for database sessions
- **`app/models/participant.py`**: SQLAlchemy model defining the `participants` table schema
- **`app/schemas/participant.py`**: Pydantic models for request validation and response serialization
- **`app/services/participant_service.py`**: Business logic for participant operations (CRUD, state updates)
- **`app/routes/participants.py`**: FastAPI route handlers that expose REST endpoints
- **`app/utils/logger.py`**: Centralized logging configuration
- **`app/utils/exceptions.py`**: Custom exception classes for error handling

## API Endpoints

### Root

- **GET** `/` - API information and version

### Participants

- **GET** `/participants` - List all participants
  - Query Parameters:
    - `search` (optional): Search participants by name (case-insensitive)
  - Response: Array of `ParticipantResponse` objects

- **GET** `/participants/{participant_id}` - Get participant by ID
  - Path Parameters:
    - `participant_id` (integer): Participant ID
  - Response: `ParticipantResponse` object
  - Errors: 404 if participant not found

- **PATCH** `/participants/{participant_id}/mic` - Update microphone state
  - Path Parameters:
    - `participant_id` (integer): Participant ID
  - Request Body: `MicUpdateRequest` with `mic_on` (boolean)
  - Response: Updated `ParticipantResponse` object
  - Errors: 404 if participant not found

- **PATCH** `/participants/{participant_id}/camera` - Update camera state
  - Path Parameters:
    - `participant_id` (integer): Participant ID
  - Request Body: `CameraUpdateRequest` with `camera_on` (boolean)
  - Response: Updated `ParticipantResponse` object
  - Errors: 404 if participant not found

- **PATCH** `/participants/{participant_id}/status` - Update online status
  - Path Parameters:
    - `participant_id` (integer): Participant ID
  - Request Body: `StatusUpdateRequest` with `is_online` (boolean)
  - Response: Updated `ParticipantResponse` object
  - Errors: 404 if participant not found

### Data Models

**ParticipantResponse** includes:
- `id` (integer)
- `name` (string)
- `email` (string, validated email format)
- `role` (string)
- `avatar_url` (string, optional)
- `is_online` (boolean)
- `mic_on` (boolean)
- `camera_on` (boolean)
- `created_at` (datetime)
- `updated_at` (datetime)

## Database Schema

The `participants` table includes:
- Primary key: `id`
- Indexed fields: `id`, `name`
- Timestamps: `created_at`, `updated_at` (automatically managed)
- State fields: `is_online`, `mic_on`, `camera_on`

## Logging

The application uses Python's `logging` module configured in `app/utils/logger.py`. Logs are output to stdout with the following format:
```
YYYY-MM-DD HH:MM:SS - module_name - LEVEL - message
```

Log level is set to `INFO` by default.

## Error Handling

The API uses standard HTTP status codes:
- `200`: Success
- `404`: Resource not found
- `500`: Internal server error

Custom exceptions are defined in `app/utils/exceptions.py`:
- `ParticipantNotFoundError`: Raised when a participant ID doesn't exist
- `DatabaseError`: Raised for database operation failures

## Development

### Code Style

The codebase follows Python PEP 8 conventions. Consider using:
- `black` for code formatting
- `flake8` or `pylint` for linting
- `mypy` for type checking

### Testing

No test suite is currently present. Consider adding:
- Unit tests for service layer logic
- Integration tests for API endpoints
- Database transaction tests

## Dependencies

See `requirements.txt` for the complete list of dependencies. Key packages:
- `fastapi==0.104.1` - Web framework
- `uvicorn[standard]==0.24.0` - ASGI server
- `sqlalchemy==2.0.23` - ORM
- `psycopg2-binary==2.9.9` - PostgreSQL adapter
- `pydantic==2.5.0` - Data validation
- `python-dotenv==1.0.0` - Environment variable management

## License

[Specify your license here]
