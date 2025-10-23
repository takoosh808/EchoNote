# EchoNote Technical Specification

## 1. System Overview

EchoNote is a privacy-first journaling application that provides AI-powered insights while maintaining user privacy through optional client-side encryption. The system supports both text and voice entries with intelligent summarization and reflection generation.

## 2. Architecture Components

### 2.1 Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Zustand for lightweight state management
- **Audio Recording**: Web Audio API with MediaRecorder
- **Encryption**: Web Crypto API for client-side encryption
- **HTTP Client**: Axios for API communication

### 2.2 Backend (FastAPI + Python)
- **Framework**: FastAPI for high-performance API
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT with refresh tokens
- **Background Tasks**: Celery with Redis
- **AI Integration**: OpenAI API for summarization
- **File Storage**: AWS S3 for audio files

### 2.3 Infrastructure
- **Containerization**: Docker for consistent environments
- **Orchestration**: Docker Compose for local development
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Cloud**: AWS (ECS, RDS, S3, CloudFront)

## 3. Data Models

### 3.1 User Model
```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  encryptionEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.2 Entry Model
```typescript
interface Entry {
  id: string;
  userId: string;
  title: string;
  content: string; // Encrypted or plaintext
  contentType: 'text' | 'audio';
  isEncrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.3 Audio File Model
```typescript
interface AudioFile {
  id: string;
  entryId: string;
  s3Key: string;
  fileSize: number;
  duration: number;
  createdAt: Date;
}
```

### 3.4 Summary Model
```typescript
interface Summary {
  id: string;
  entryId: string;
  summaryText: string; // Encrypted or plaintext
  isEncrypted: boolean;
  createdAt: Date;
}
```

## 4. API Endpoints

### 4.1 Authentication
```
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
```

### 4.2 Entries
```
GET    /entries              # List user entries
POST   /entries              # Create new entry
GET    /entries/{id}         # Get specific entry
PUT    /entries/{id}         # Update entry
DELETE /entries/{id}         # Delete entry
POST   /entries/{id}/audio   # Upload audio file
```

### 4.3 AI Processing
```
POST /ai/summarize           # Trigger summarization
GET  /ai/summaries           # Get user summaries
POST /ai/reflections         # Generate weekly reflections
```

## 5. Security Architecture

### 5.1 Encryption Model
- **Client-Side Encryption**: AES-GCM encryption in browser
- **Key Management**: User keys never transmitted to server
- **Dual Mode**: Encrypted and unencrypted modes supported
- **Zero-Knowledge**: Server cannot decrypt user data

### 5.2 Authentication Flow
1. User registers/logs in
2. JWT access token issued (15 min expiry)
3. Refresh token issued (7 day expiry)
4. Access token refreshed automatically
5. Logout invalidates all tokens

### 5.3 Data Privacy
- **Encrypted Mode**: All data encrypted client-side
- **Unencrypted Mode**: Standard server-side processing
- **AI Processing**: Server-side decryption for AI only
- **Storage**: Encrypted data stored as binary blobs

## 6. AI Processing Pipeline

### 6.1 Summarization Flow
1. Entry created (encrypted or plaintext)
2. Background task triggered
3. Content decrypted for AI processing (if encrypted)
4. OpenAI API called for summarization
5. Summary encrypted with user key (if encrypted)
6. Summary stored in database

### 6.2 Weekly Reflections
1. User entries collected for week
2. AI processes all entries together
3. Reflection generated with themes and insights
4. Reflection stored with same encryption as entries

## 7. File Storage Strategy

### 7.1 Audio Files
- **Storage**: AWS S3 with CloudFront CDN
- **Format**: WebM/MP4 for browser compatibility
- **Encryption**: Client-side encryption before upload
- **Access**: Signed URLs for secure access

### 7.2 File Processing
- **Upload**: Direct to S3 with presigned URLs
- **Transcription**: Whisper API for speech-to-text
- **Compression**: FFmpeg for audio optimization

## 8. Performance Considerations

### 8.1 Frontend Optimization
- **Code Splitting**: Route-based lazy loading
- **Caching**: Service worker for offline support
- **Bundle Size**: Tree shaking and optimization
- **Images**: WebP format with fallbacks

### 8.2 Backend Optimization
- **Database**: Connection pooling and indexing
- **Caching**: Redis for session and API caching
- **Background Tasks**: Celery for async processing
- **Rate Limiting**: API rate limiting and throttling

## 9. Monitoring and Logging

### 9.1 Application Monitoring
- **Health Checks**: Endpoint monitoring
- **Performance**: Response time tracking
- **Errors**: Exception tracking and alerting
- **Usage**: User activity analytics

### 9.2 Security Monitoring
- **Authentication**: Failed login attempts
- **API Usage**: Unusual access patterns
- **Data Access**: Audit logs for sensitive operations
- **Encryption**: Key usage and rotation

## 10. Deployment Strategy

### 10.1 Development Environment
- **Local**: Docker Compose for full stack
- **Database**: PostgreSQL container
- **Cache**: Redis container
- **Storage**: Local file system

### 10.2 Production Environment
- **Containers**: AWS ECS with Fargate
- **Database**: RDS PostgreSQL with Multi-AZ
- **Cache**: ElastiCache Redis
- **Storage**: S3 with CloudFront CDN
- **Load Balancing**: Application Load Balancer
- **Auto Scaling**: Based on CPU and memory usage
