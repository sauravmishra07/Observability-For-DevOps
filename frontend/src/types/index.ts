export interface User {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  is_pinned: boolean;
  is_archived: boolean;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface NoteListResponse {
  notes: Note[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface NoteFilters {
  search: string;
  tag: string | null;
  is_pinned: boolean | null;
  is_archived: boolean;
  page: number;
}

export const NOTE_COLORS = [
  '#171717', '#1a1a2e', '#16213e', '#1a2a1a',
  '#2a1a1a', '#2a1a2a', '#1a2a2a', '#2a2a1a',
];
