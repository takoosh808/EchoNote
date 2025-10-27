# Import all models here so they are registered with SQLAlchemy
from app.models.user import User, Entry, AudioFile, Summary
from app.core.database import Base

# Create a models object that contains all models
models = Base

__all__ = ["User", "Entry", "AudioFile", "Summary", "models"]
