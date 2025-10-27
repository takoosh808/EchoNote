from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas import (
    Entry,
    EntryCreate,
    EntryUpdate,
    AudioFileCreate,
    AudioFile
)
from app.models import Entry as EntryModel, User, AudioFile as AudioFileModel
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=List[Entry])
async def get_entries(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's journal entries"""
    query = db.query(EntryModel).filter(EntryModel.user_id == current_user.id)
    
    if search:
        query = query.filter(EntryModel.title.contains(search))
    
    entries = query.offset(skip).limit(limit).all()
    return entries

@router.post("/", response_model=Entry)
async def create_entry(
    entry_data: EntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new journal entry"""
    db_entry = EntryModel(
        title=entry_data.title,
        content=entry_data.content,
        content_type=entry_data.content_type,
        is_encrypted=entry_data.is_encrypted,
        user_id=current_user.id
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/{entry_id}", response_model=Entry)
async def get_entry(
    entry_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific journal entry"""
    entry = db.query(EntryModel).filter(
        EntryModel.id == entry_id,
        EntryModel.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )
    
    return entry

@router.put("/{entry_id}", response_model=Entry)
async def update_entry(
    entry_id: UUID,
    entry_data: EntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a journal entry"""
    entry = db.query(EntryModel).filter(
        EntryModel.id == entry_id,
        EntryModel.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )
    
    if entry_data.title is not None:
        entry.title = entry_data.title
    if entry_data.content is not None:
        entry.content = entry_data.content
    
    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/{entry_id}")
async def delete_entry(
    entry_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a journal entry"""
    entry = db.query(EntryModel).filter(
        EntryModel.id == entry_id,
        EntryModel.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )
    
    db.delete(entry)
    db.commit()
    return {"message": "Entry deleted successfully"}

@router.post("/{entry_id}/audio", response_model=AudioFile)
async def upload_audio(
    entry_id: UUID,
    audio_data: AudioFileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload audio file for an entry"""
    # Verify entry exists and belongs to user
    entry = db.query(EntryModel).filter(
        EntryModel.id == entry_id,
        EntryModel.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )
    
    # Create audio file record
    db_audio = AudioFileModel(
        entry_id=entry_id,
        s3_key=audio_data.s3_key,
        file_size=audio_data.file_size,
        duration=audio_data.duration
    )
    db.add(db_audio)
    db.commit()
    db.refresh(db_audio)
    
    return db_audio
