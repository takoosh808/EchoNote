from fastapi import APIRouter
from app.api.v1.endpoints import auth, entries, ai

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(entries.router, prefix="/entries", tags=["entries"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
