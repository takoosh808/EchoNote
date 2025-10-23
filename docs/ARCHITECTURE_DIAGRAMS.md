# EchoNote Architecture Diagrams

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Frontend]
        B[Web Audio API]
        C[Web Crypto API]
    end
    
    subgraph "API Gateway"
        D[Load Balancer]
        E[API Gateway]
    end
    
    subgraph "Application Layer"
        F[FastAPI Backend]
        G[Celery Workers]
        H[Redis Cache]
    end
    
    subgraph "Data Layer"
        I[PostgreSQL]
        J[AWS S3]
        K[OpenAI API]
    end
    
    A --> D
    B --> A
    C --> A
    D --> E
    E --> F
    F --> G
    F --> H
    F --> I
    F --> J
    G --> K
    G --> J
```

## Data Flow - Encrypted Mode

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant AI as OpenAI
    participant S3 as AWS S3
    
    U->>F: Create encrypted entry
    F->>F: Encrypt with user key
    F->>B: POST /entries (encrypted data)
    B->>DB: Store encrypted blob
    B->>G: Trigger AI processing
    G->>B: Decrypt for AI processing
    B->>AI: Send decrypted content
    AI->>B: Return summary
    B->>B: Encrypt summary with user key
    B->>DB: Store encrypted summary
    B->>F: Return success
    F->>U: Display confirmation
```

## Data Flow - Unencrypted Mode

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant AI as OpenAI
    participant S3 as AWS S3
    
    U->>F: Create entry
    F->>B: POST /entries (plaintext)
    B->>DB: Store plaintext
    B->>G: Trigger AI processing
    G->>AI: Send plaintext content
    AI->>B: Return summary
    B->>DB: Store plaintext summary
    B->>F: Return success
    F->>U: Display confirmation
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    
    U->>F: Login credentials
    F->>B: POST /auth/login
    B->>DB: Validate credentials
    DB->>B: User data
    B->>B: Generate JWT tokens
    B->>F: Access + Refresh tokens
    F->>F: Store tokens securely
    F->>B: API requests with JWT
    B->>B: Validate JWT
    B->>F: Protected data
```

## AI Processing Pipeline

```mermaid
graph TD
    A[Entry Created] --> B{Encrypted?}
    B -->|Yes| C[Decrypt for AI]
    B -->|No| D[Use Plaintext]
    C --> E[Send to OpenAI]
    D --> E
    E --> F[Generate Summary]
    F --> G{Encrypted?}
    G -->|Yes| H[Encrypt Summary]
    G -->|No| I[Store Plaintext]
    H --> J[Store Encrypted Summary]
    I --> J
    J --> K[Notify User]
```

## Security Architecture

```mermaid
graph TB
    subgraph "Client Security"
        A[HTTPS/TLS 1.3]
        B[Client-Side Encryption]
        C[Secure Key Storage]
        D[CSP Headers]
    end
    
    subgraph "API Security"
        E[JWT Authentication]
        F[Rate Limiting]
        G[Input Validation]
        H[CORS Policy]
    end
    
    subgraph "Data Security"
        I[Encrypted Storage]
        J[Zero-Knowledge Server]
        K[Audit Logging]
        L[Access Controls]
    end
    
    A --> E
    B --> I
    C --> B
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "AWS Cloud"
        A[CloudFront CDN]
        B[Application Load Balancer]
        C[ECS Fargate]
        D[RDS PostgreSQL]
        E[ElastiCache Redis]
        F[S3 Storage]
        G[CloudWatch]
    end
    
    subgraph "External Services"
        H[OpenAI API]
        I[GitHub Actions]
    end
    
    A --> B
    B --> C
    C --> D
    C --> E
    C --> F
    C --> H
    I --> C
    G --> C
```

## Database Schema

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email UK
        string password_hash
        boolean encryption_enabled
        timestamp created_at
        timestamp updated_at
    }
    
    ENTRIES {
        uuid id PK
        uuid user_id FK
        string title
        text content
        enum content_type
        boolean is_encrypted
        timestamp created_at
        timestamp updated_at
    }
    
    AUDIO_FILES {
        uuid id PK
        uuid entry_id FK
        string s3_key
        integer file_size
        float duration
        timestamp created_at
    }
    
    SUMMARIES {
        uuid id PK
        uuid entry_id FK
        text summary_text
        boolean is_encrypted
        timestamp created_at
    }
    
    USERS ||--o{ ENTRIES : creates
    ENTRIES ||--o{ AUDIO_FILES : has
    ENTRIES ||--o{ SUMMARIES : generates
```

## Component Interaction

```mermaid
graph LR
    subgraph "Frontend Components"
        A[AuthProvider]
        B[EntryList]
        C[EntryEditor]
        D[AudioRecorder]
        E[EncryptionToggle]
    end
    
    subgraph "Backend Services"
        F[AuthService]
        G[EntryService]
        H[AudioService]
        I[EncryptionService]
        J[AIService]
    end
    
    A --> F
    B --> G
    C --> G
    D --> H
    E --> I
    G --> J
    H --> J
```

## Error Handling Flow

```mermaid
graph TD
    A[Error Occurs] --> B{Error Type}
    B -->|Validation| C[Return 400 Bad Request]
    B -->|Authentication| D[Return 401 Unauthorized]
    B -->|Authorization| E[Return 403 Forbidden]
    B -->|Not Found| F[Return 404 Not Found]
    B -->|Server Error| G[Return 500 Internal Error]
    C --> H[Log Error]
    D --> H
    E --> H
    F --> H
    G --> H
    H --> I[Return Error Response]
    I --> J[Client Error Handling]
```
