"""
EchoNote FastAPI Application Entry Point

This module initializes the FastAPI application with:
- Database connection and table creation
- CORS middleware for frontend communication
- Security middleware for trusted hosts
- API route registration
- Health check endpoints
- Development server configuration

Architecture:
- Uses FastAPI for high-performance async API
- Integrates with PostgreSQL via SQLAlchemy
- Implements JWT authentication
- Provides automatic API documentation
- Supports hot reloading in development

Security features:
- CORS protection for cross-origin requests
- Trusted host middleware
- JWT token validation
- Input validation with Pydantic
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import uvicorn

from app.core.config import settings
from app.api.v1.api import api_router
from app.core.database import engine
from app.models import models

# Create database tables on startup
# In production, use Alembic migrations instead
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI application with metadata
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="EchoNote - AI-Powered Journaling API",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",  # Swagger UI documentation
    redoc_url="/redoc",  # ReDoc documentation
)

# Configure CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,  # Allowed frontend origins
    allow_credentials=True,  # Allow cookies and authentication headers
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Add trusted host middleware for security
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS,  # Prevent host header attacks
)

# Register API routes with version prefix
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    """
    Root endpoint providing API information
    
    Returns:
        dict: API metadata and documentation links
    """
    return {
        "message": "Welcome to EchoNote API",
        "version": settings.VERSION,
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring and load balancers
    
    Returns:
        dict: Application health status and version
    """
    return {"status": "healthy", "version": settings.VERSION}

if __name__ == "__main__":
    # Development server configuration
    uvicorn.run(
        "main:app",
        host="0.0.0.0",  # Listen on all interfaces
        port=8000,       # Default port
        reload=True,     # Enable hot reloading
        log_level="info" # Logging level
    )
