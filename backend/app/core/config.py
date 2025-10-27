"""
Application Configuration Settings

This module defines all application settings using Pydantic Settings:
- Environment variable loading with .env file support
- Type validation and conversion
- Default values for development
- Security-sensitive configuration
- Database and external service configuration

Features:
- Automatic environment variable parsing
- Type safety with Pydantic validation
- Development vs production configuration
- Security best practices for sensitive data
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    
    All settings can be overridden via environment variables.
    Sensitive settings should be set via environment variables in production.
    """
    
    # ==================== APPLICATION SETTINGS ====================
    PROJECT_NAME: str = "EchoNote"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # ==================== SECURITY SETTINGS ====================
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15  # Short-lived access tokens
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7    # Longer-lived refresh tokens
    ALGORITHM: str = "HS256"              # JWT signing algorithm
    
    # ==================== DATABASE SETTINGS ====================
    DATABASE_URL: str = "postgresql://echonote:echonote_dev@localhost:5432/echonote"
    
    # ==================== REDIS SETTINGS ====================
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # ==================== CORS SETTINGS ====================
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",  # React dev server
        "http://localhost:3001",  # Alternative dev port
        "http://127.0.0.1:3000", # Localhost variants
        "http://127.0.0.1:3001",
    ]
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    
    # ==================== AI SERVICE SETTINGS ====================
    OPENAI_API_KEY: Optional[str] = None
    
    # ==================== AWS SETTINGS ====================
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_S3_BUCKET: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    
    # ==================== FILE UPLOAD SETTINGS ====================
    MAX_FILE_SIZE_MB: int = 50
    ALLOWED_AUDIO_FORMATS: List[str] = ["mp3", "wav", "webm", "m4a"]
    
    # ==================== ENCRYPTION SETTINGS ====================
    ENCRYPTION_ALGORITHM: str = "AES-GCM"
    ENCRYPTION_KEY_LENGTH: int = 256
    
    class Config:
        """
        Pydantic configuration for settings
        """
        env_file = ".env"          # Load from .env file
        case_sensitive = True      # Environment variable names are case-sensitive

# Create global settings instance
settings = Settings()
