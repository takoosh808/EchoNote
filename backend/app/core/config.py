from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "EchoNote"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"
    
    # Database
    DATABASE_URL: str = "postgresql://echonote:echonote_dev@localhost:5432/echonote"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    
    # OpenAI
    OPENAI_API_KEY: Optional[str] = None
    
    # AWS
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_S3_BUCKET: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    
    # File Upload
    MAX_FILE_SIZE_MB: int = 50
    ALLOWED_AUDIO_FORMATS: List[str] = ["mp3", "wav", "webm", "m4a"]
    
    # Encryption
    ENCRYPTION_ALGORITHM: str = "AES-GCM"
    ENCRYPTION_KEY_LENGTH: int = 256
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
