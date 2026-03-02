import api from './api';
import { Note, NoteListResponse } from '../types';

export interface CreateNoteData {
  title: string;
  content?: string;
  tags?: string[];
  color?: string;
  is_pinned?: boolean;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  tags?: string[];
  color?: string;
  is_pinned?: boolean;
  is_archived?: boolean;
}

export interface GetNotesParams {
  page?: number;
  page_size?: number;
  search?: string;
  tag?: string;
  is_pinned?: boolean;
  is_archived?: boolean;
}

export const notesService = {
  async getNotes(params: GetNotesParams = {}): Promise<NoteListResponse> {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );
    const res = await api.get('/notes/', { params: cleanParams });
    return res.data;
  },
  async getNote(id: string): Promise<Note> {
    const res = await api.get(`/notes/${id}`);
    return res.data;
  },
  async createNote(data: CreateNoteData): Promise<Note> {
    const res = await api.post('/notes/', data);
    return res.data;
  },
  async updateNote(id: string, data: UpdateNoteData): Promise<Note> {
    const res = await api.put(`/notes/${id}`, data);
    return res.data;
  },
  async deleteNote(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  },
  async getTags(): Promise<string[]> {
    const res = await api.get('/notes/tags');
    return res.data;
  },
};
