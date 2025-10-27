from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas import (
    SummarizeRequest,
    ReflectionRequest,
    Summary
)
from app.models import Entry as EntryModel, User, Summary as SummaryModel
from app.services.ai_service import AIService
from uuid import UUID

router = APIRouter()

@router.post("/summarize")
async def summarize_entry(
    request: SummarizeRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Trigger AI summarization for an entry"""
    # Verify entry exists and belongs to user
    entry = db.query(EntryModel).filter(
        EntryModel.id == request.entry_id,
        EntryModel.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )
    
    # Check if summary already exists
    existing_summary = db.query(SummaryModel).filter(
        SummaryModel.entry_id == request.entry_id
    ).first()
    
    if existing_summary:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Summary already exists for this entry"
        )
    
    # Add background task for AI processing
    background_tasks.add_task(
        process_entry_summarization,
        entry_id=str(request.entry_id),
        user_id=str(current_user.id)
    )
    
    return {"message": "Summarization started", "entry_id": str(request.entry_id)}

@router.get("/summaries", response_model=List[Summary])
async def get_summaries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's AI summaries"""
    summaries = db.query(SummaryModel).filter(
        SummaryModel.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return summaries

@router.post("/reflections")
async def generate_reflection(
    request: ReflectionRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate weekly reflection"""
    # Add background task for reflection generation
    background_tasks.add_task(
        process_weekly_reflection,
        user_id=str(current_user.id),
        week_start=request.week_start,
        week_end=request.week_end
    )
    
    return {
        "message": "Reflection generation started",
        "week_start": request.week_start.isoformat(),
        "week_end": request.week_end.isoformat()
    }

async def process_entry_summarization(entry_id: str, user_id: str):
    """Background task to process entry summarization"""
    # This would be implemented with Celery in production
    # For now, we'll simulate the process
    try:
        # Get entry from database
        from app.core.database import SessionLocal
        db = SessionLocal()
        
        entry = db.query(EntryModel).filter(EntryModel.id == entry_id).first()
        if not entry:
            return
        
        # Process with AI service
        ai_service = AIService()
        summary_text = await ai_service.summarize_text(entry.content or "")
        
        # Create summary record
        summary = SummaryModel(
            entry_id=entry.id,
            user_id=entry.user_id,
            summary_text=summary_text,
            is_encrypted=entry.is_encrypted
        )
        db.add(summary)
        db.commit()
        
    except Exception as e:
        print(f"Error processing summarization: {e}")
    finally:
        db.close()

async def process_weekly_reflection(user_id: str, week_start, week_end):
    """Background task to process weekly reflection"""
    # This would be implemented with Celery in production
    try:
        from app.core.database import SessionLocal
        db = SessionLocal()
        
        # Get entries for the week
        entries = db.query(EntryModel).filter(
            EntryModel.user_id == user_id,
            EntryModel.created_at >= week_start,
            EntryModel.created_at <= week_end
        ).all()
        
        if not entries:
            return
        
        # Process with AI service
        ai_service = AIService()
        reflection_text = await ai_service.generate_reflection(entries)
        
        # Store reflection (could be a separate model)
        print(f"Weekly reflection for {user_id}: {reflection_text}")
        
    except Exception as e:
        print(f"Error processing reflection: {e}")
    finally:
        db.close()
