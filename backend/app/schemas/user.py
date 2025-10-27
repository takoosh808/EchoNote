from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    encryption_enabled: bool = False

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    encryption_enabled: Optional[bool] = None

class UserInDB(UserBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class User(UserInDB):
    pass

# Auth Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: Optional[bool] = False

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

# Entry Schemas
class EntryBase(BaseModel):
    title: str
    content: Optional[str] = None
    content_type: str  # 'text' or 'audio'

class EntryCreate(EntryBase):
    is_encrypted: bool = False

class EntryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class EntryInDB(EntryBase):
    id: UUID
    user_id: UUID
    is_encrypted: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class Entry(EntryInDB):
    pass

# Audio File Schemas
class AudioFileBase(BaseModel):
    s3_key: str
    file_size: int
    duration: Optional[float] = None

class AudioFileCreate(AudioFileBase):
    pass

class AudioFileInDB(AudioFileBase):
    id: UUID
    entry_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class AudioFile(AudioFileInDB):
    pass

# Summary Schemas
class SummaryBase(BaseModel):
    summary_text: str

class SummaryCreate(SummaryBase):
    is_encrypted: bool = False

class SummaryInDB(SummaryBase):
    id: UUID
    entry_id: UUID
    user_id: UUID
    is_encrypted: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Summary(SummaryInDB):
    pass

# AI Schemas
class SummarizeRequest(BaseModel):
    entry_id: UUID

class ReflectionRequest(BaseModel):
    week_start: datetime
    week_end: datetime
