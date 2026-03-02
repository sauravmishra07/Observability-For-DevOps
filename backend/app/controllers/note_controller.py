from fastapi import APIRouter, Depends, Query, status
from typing import Optional, List
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse, NoteListResponse
from app.services.note_service import NoteService
from app.middleware.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/notes", tags=["Notes"])


@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(
    note_data: NoteCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new note."""
    return await NoteService.create_note(note_data, current_user)


@router.get("/", response_model=NoteListResponse)
async def get_notes(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
    is_pinned: Optional[bool] = Query(None),
    is_archived: bool = Query(False),
    current_user: User = Depends(get_current_user)
):
    """Get all notes with pagination and filters."""
    return await NoteService.get_notes(
        user=current_user,
        page=page,
        page_size=page_size,
        search=search,
        tag=tag,
        is_pinned=is_pinned,
        is_archived=is_archived,
    )


@router.get("/tags", response_model=List[str])
async def get_tags(current_user: User = Depends(get_current_user)):
    """Get all unique tags for current user."""
    return await NoteService.get_tags(current_user)


@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(note_id: str, current_user: User = Depends(get_current_user)):
    """Get a specific note by ID."""
    return await NoteService.get_note_by_id(note_id, current_user)


@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: str,
    note_data: NoteUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a note."""
    return await NoteService.update_note(note_id, note_data, current_user)


@router.delete("/{note_id}")
async def delete_note(note_id: str, current_user: User = Depends(get_current_user)):
    """Delete a note."""
    return await NoteService.delete_note(note_id, current_user)
