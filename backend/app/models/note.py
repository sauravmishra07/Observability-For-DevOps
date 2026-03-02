from beanie import Document, Link, Indexed
from pydantic import Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId


class Note(Document):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(default="")
    tags: List[str] = Field(default_factory=list)
    color: str = Field(default="#ffffff")
    is_pinned: bool = False
    is_archived: bool = False
    owner_id: str  # Store as string for simplicity
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "notes"
        indexes = ["owner_id", "is_pinned", "is_archived", "tags"]
