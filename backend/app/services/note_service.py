from fastapi import HTTPException, status
from app.models.note import Note
from app.models.user import User
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse, NoteListResponse
from typing import Optional, List
from datetime import datetime
import math


def note_to_response(note: Note) -> NoteResponse:
    return NoteResponse(
        id=str(note.id),
        title=note.title,
        content=note.content,
        tags=note.tags,
        color=note.color,
        is_pinned=note.is_pinned,
        is_archived=note.is_archived,
        owner_id=note.owner_id,
        created_at=note.created_at,
        updated_at=note.updated_at,
    )


class NoteService:
    @staticmethod
    async def create_note(note_data: NoteCreate, user: User) -> NoteResponse:
        note = Note(
            title=note_data.title,
            content=note_data.content,
            tags=note_data.tags,
            color=note_data.color,
            is_pinned=note_data.is_pinned,
            owner_id=str(user.id)
        )
        await note.insert()
        return note_to_response(note)

    @staticmethod
    async def get_notes(
        user: User,
        page: int = 1,
        page_size: int = 20,
        search: Optional[str] = None,
        tag: Optional[str] = None,
        is_pinned: Optional[bool] = None,
        is_archived: bool = False,
    ) -> NoteListResponse:
        query = {"owner_id": str(user.id), "is_archived": is_archived}

        if is_pinned is not None:
            query["is_pinned"] = is_pinned

        if tag:
            query["tags"] = tag

        notes_query = Note.find(query)

        if search:
            notes_query = Note.find(
                {**query, "$or": [
                    {"title": {"$regex": search, "$options": "i"}},
                    {"content": {"$regex": search, "$options": "i"}}
                ]}
            )

        total = await notes_query.count()
        total_pages = math.ceil(total / page_size) if total > 0 else 1
        skip = (page - 1) * page_size

        notes = await notes_query.sort(
            [(-Note.is_pinned, Note.updated_at)]
        ).skip(skip).limit(page_size).to_list()

        return NoteListResponse(
            notes=[note_to_response(n) for n in notes],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )

    @staticmethod
    async def get_note_by_id(note_id: str, user: User) -> NoteResponse:
        note = await Note.get(note_id)
        if not note or note.owner_id != str(user.id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Note not found"
            )
        return note_to_response(note)

    @staticmethod
    async def update_note(note_id: str, note_data: NoteUpdate, user: User) -> NoteResponse:
        note = await Note.get(note_id)
        if not note or note.owner_id != str(user.id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Note not found"
            )

        update_data = note_data.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()

        for field, value in update_data.items():
            setattr(note, field, value)

        await note.save()
        return note_to_response(note)

    @staticmethod
    async def delete_note(note_id: str, user: User) -> dict:
        note = await Note.get(note_id)
        if not note or note.owner_id != str(user.id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Note not found"
            )
        await note.delete()
        return {"message": "Note deleted successfully"}

    @staticmethod
    async def get_tags(user: User) -> List[str]:
        pipeline = [
            {"$match": {"owner_id": str(user.id)}},
            {"$unwind": "$tags"},
            {"$group": {"_id": "$tags"}},
            {"$sort": {"_id": 1}}
        ]
        result = await Note.aggregate(pipeline).to_list()
        return [r["_id"] for r in result]
