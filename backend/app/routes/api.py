from fastapi import APIRouter
from app.controllers.auth_controller import router as auth_router
from app.controllers.note_controller import router as notes_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(notes_router)
