# 📝 Nota — Notes App

A **production-ready** full-stack Notes application built with FastAPI, React, and MongoDB.

---

## 🏗️ Architecture

```
notes-app/
├── backend/                  # FastAPI (Python)
│   ├── app/
│   │   ├── controllers/      # Route handlers (MVC - Controller)
│   │   │   ├── auth_controller.py
│   │   │   └── note_controller.py
│   │   ├── models/           # Database models (MVC - Model)
│   │   │   ├── user.py
│   │   │   └── note.py
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   │   ├── user.py
│   │   │   └── note.py
│   │   ├── services/         # Business logic layer
│   │   │   ├── auth_service.py
│   │   │   └── note_service.py
│   │   ├── routes/           # API router
│   │   │   └── api.py
│   │   ├── middleware/       # Auth middleware/dependencies
│   │   │   └── auth.py
│   │   ├── core/             # Config, DB, Security
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   └── main.py           # FastAPI app entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   └── run.py
│
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── NoteCard.tsx
│   │   │   ├── NoteEditor.tsx
│   │   │   ├── CreateNoteModal.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/            # Page-level components
│   │   │   ├── AuthPage.tsx
│   │   │   └── NotesPage.tsx
│   │   ├── services/         # API communication layer
│   │   │   ├── api.ts        # Axios instance
│   │   │   ├── authService.ts
│   │   │   └── notesService.ts
│   │   ├── store/            # Zustand state management
│   │   │   ├── authStore.ts
│   │   │   └── notesStore.ts
│   │   ├── types/            # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── nginx.conf
│
└── docker-compose.yml
```

---

## ✨ Features

- **Authentication** — JWT-based register/login
- **CRUD Notes** — Create, read, update, delete
- **Rich Notes** — Title, content, tags, color coding
- **Pin & Archive** — Organize your notes
- **Search** — Full-text search across title and content
- **Tag Filtering** — Filter notes by tags
- **Auto-save** — Notes save automatically while typing
- **Pagination** — Efficient loading of large note collections

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
git clone <repo>
cd notes-app
docker-compose up --build
```

Then open: `http://localhost`

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Edit .env with your settings
python run.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**MongoDB:**
```bash
# Make sure MongoDB is running locally on port 27017
# Or use MongoDB Atlas and update MONGODB_URL in .env
```

---

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_URL` | `mongodb://localhost:27017` | MongoDB connection string |
| `DATABASE_NAME` | `notes_db` | Database name |
| `SECRET_KEY` | *(change this!)* | JWT secret key |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Token expiry |
| `CORS_ORIGINS` | `[...]` | Allowed CORS origins |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/me` | Get current user |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/notes/` | List notes (with filters) |
| POST | `/api/v1/notes/` | Create note |
| GET | `/api/v1/notes/{id}` | Get note |
| PUT | `/api/v1/notes/{id}` | Update note |
| DELETE | `/api/v1/notes/{id}` | Delete note |
| GET | `/api/v1/notes/tags` | Get all tags |

**Query params:** `page`, `page_size`, `search`, `tag`, `is_pinned`, `is_archived`

**API Docs:** `http://localhost:8000/api/docs`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI, Python 3.11+ |
| Database | MongoDB + Beanie ODM |
| Auth | JWT (python-jose) + bcrypt |
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| HTTP | Axios |
| Build | Vite |
| Containerization | Docker + Docker Compose |
