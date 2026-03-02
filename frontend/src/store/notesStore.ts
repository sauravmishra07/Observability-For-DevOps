import { create } from 'zustand';
import { Note, NoteFilters } from '../types';
import { notesService, CreateNoteData, UpdateNoteData } from '../services/notesService';

interface NotesStore {
  notes: Note[];
  tags: string[];
  total: number;
  totalPages: number;
  filters: NoteFilters;
  isLoading: boolean;
  selectedNote: Note | null;

  fetchNotes: () => Promise<void>;
  fetchTags: () => Promise<void>;
  createNote: (data: CreateNoteData) => Promise<Note>;
  updateNote: (id: string, data: UpdateNoteData) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setFilters: (filters: Partial<NoteFilters>) => void;
  setSelectedNote: (note: Note | null) => void;
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],
  tags: [],
  total: 0,
  totalPages: 1,
  isLoading: false,
  selectedNote: null,
  filters: {
    search: '',
    tag: null,
    is_pinned: null,
    is_archived: false,
    page: 1,
  },

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const { filters } = get();
      const params: Record<string, unknown> = {
        page: filters.page,
        page_size: 20,
      };
      if (filters.search) params.search = filters.search;
      if (filters.tag) params.tag = filters.tag;
      if (filters.is_pinned !== null) params.is_pinned = filters.is_pinned;
      params.is_archived = filters.is_archived;

      const res = await notesService.getNotes(params as any);
      set({ notes: res.notes, total: res.total, totalPages: res.total_pages });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTags: async () => {
    const tags = await notesService.getTags();
    set({ tags });
  },

  createNote: async (data) => {
    const note = await notesService.createNote(data);
    await get().fetchNotes();
    await get().fetchTags();
    return note;
  },

  updateNote: async (id, data) => {
    const updated = await notesService.updateNote(id, data);
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? updated : n)),
      selectedNote: state.selectedNote?.id === id ? updated : state.selectedNote,
    }));
    await get().fetchTags();
  },

  deleteNote: async (id) => {
    await notesService.deleteNote(id);
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
      selectedNote: state.selectedNote?.id === id ? null : state.selectedNote,
    }));
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters, page: filters.page ?? 1 },
    }));
    get().fetchNotes();
  },

  setSelectedNote: (note) => set({ selectedNote: note }),
}));
