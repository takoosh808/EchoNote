# EchoNote Architecture

## Overview
EchoNote is a privacy-first, AI-powered journaling web application that allows users to record text and voice entries with optional client-side encryption. The system processes AI summaries without storing plaintext when encryption is enabled.

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Audio Recording**: Web Audio API with MediaRecorder
- **Encryption**: Web Crypto API (AES-GCM)
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **File Storage**: AWS S3 for audio files
- **AI Processing**: OpenAI API for summarization
- **Authentication**: JWT tokens with refresh mechanism
- **Background Tasks**: Celery with Redis
- **API Documentation**: OpenAPI/Swagger

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose for local development
- **CI/CD**: GitHub Actions
- **Cloud**: AWS (S3, RDS, ECS)
- **Monitoring**: CloudWatch

## Architecture Principles

### Privacy-First Design
1. **Client-Side Encryption**: User data encrypted in browser before transmission
2. **Zero-Knowledge Backend**: Server cannot read encrypted entries
3. **Optional Encryption**: Users can choose encrypted or unencrypted mode
4. **Secure Key Management**: Encryption keys never leave the client

### Security Model
- **Authentication**: JWT-based with refresh tokens
- **Authorization**: Role-based access control
- **Data Encryption**: AES-GCM for client-side encryption
- **Transport Security**: HTTPS/TLS 1.3
- **Input Validation**: Comprehensive validation on all endpoints

## Data Flow

### Encrypted Mode
1. User creates entry in browser
2. Entry encrypted with user's key (never transmitted)
3. Encrypted blob uploaded to server
4. Server stores encrypted data without decryption capability
5. AI processing uses encrypted data (server-side decryption for AI only)
6. Summaries encrypted with same key before storage

### Unencrypted Mode
1. User creates entry in browser
2. Entry uploaded as plaintext
3. Server processes and stores normally
4. AI summarization on plaintext data
5. Summaries stored as plaintext

## API Design

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout

### Journal Endpoints
- `GET /entries` - List user entries
- `POST /entries` - Create new entry
- `GET /entries/{id}` - Get specific entry
- `PUT /entries/{id}` - Update entry
- `DELETE /entries/{id}` - Delete entry
- `POST /entries/{id}/audio` - Upload audio file

### AI Processing Endpoints
- `POST /ai/summarize` - Trigger summarization
- `GET /ai/summaries` - Get user summaries
- `POST /ai/reflections` - Generate weekly reflections

## Database Schema

### Users Table
- id (UUID, Primary Key)
- email (String, Unique)
- password_hash (String)
- encryption_enabled (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)

### Entries Table
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- title (String)
- content (Encrypted/Plaintext)
- content_type (Enum: text, audio)
- is_encrypted (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)

### Audio Files Table
- id (UUID, Primary Key)
- entry_id (UUID, Foreign Key)
- s3_key (String)
- file_size (Integer)
- duration (Float)
- created_at (Timestamp)

### Summaries Table
- id (UUID, Primary Key)
- entry_id (UUID, Foreign Key)
- summary_text (Encrypted/Plaintext)
- is_encrypted (Boolean)
- created_at (Timestamp)

## Deployment Architecture

### Development
- Docker Compose for local development
- PostgreSQL container
- Redis container for Celery
- Local file storage

### Production
- AWS ECS for container orchestration
- RDS PostgreSQL for database
- S3 for file storage
- CloudFront for CDN
- Application Load Balancer
- Auto Scaling Groups
