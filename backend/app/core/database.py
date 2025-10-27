"""
Database Configuration and Session Management

This module handles:
- SQLAlchemy engine configuration with connection pooling
- Database session management
- Dependency injection for FastAPI endpoints
- Connection lifecycle management

Features:
- Connection pooling for better performance
- Automatic connection health checks
- Proper session cleanup
- Development-friendly configuration
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create SQLAlchemy engine with optimized settings
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,    # Verify connections before use
    pool_recycle=300,      # Recycle connections every 5 minutes
    pool_size=10,          # Maintain 10 connections in pool
    max_overflow=20,       # Allow up to 20 additional connections
    echo=False,            # Set to True for SQL query logging
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,  # Manual transaction control
    autoflush=False,   # Manual flush control
    bind=engine        # Bind to our engine
)

# Create declarative base for models
Base = declarative_base()

def get_db():
    """
    Dependency function to get database session
    
    This function provides a database session to FastAPI endpoints.
    It ensures proper session cleanup after each request.
    
    Yields:
        Session: SQLAlchemy database session
        
    Example:
        @app.get("/users/")
        async def get_users(db: Session = Depends(get_db)):
            return db.query(User).all()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()  # Always close session to prevent leaks
