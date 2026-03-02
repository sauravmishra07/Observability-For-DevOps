import { useEffect, useState } from 'react';
import { useNotesStore } from '../store/notesStore';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import CreateNoteModal from '../components/CreateNoteModal';
import { Search, Plus, StickyNote } from 'lucide-react';
import { Note } from '../types';

export default function NotesPage() {
  const { notes, filters, setFilters, fetchNotes, fetchTags, isLoading, selectedNote, setSelectedNote } = useNotesStore();
  const [showCreate, setShowCreate] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchNotes();
    fetchTags();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: searchInput, page: 1 });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleNoteCreated = (id: string) => {
    setShowCreate(false);
    fetchNotes().then(() => {
      const note = notes.find((n) => n.id === id);
      if (note) setSelectedNote(note);
    });
  };

  const getTitle = () => {
    if (filters.tag) return `#${filters.tag}`;
    if (filters.is_archived) return 'Archived';
    if (filters.is_pinned) return 'Pinned';
    return 'All Notes';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f0f]">
      <Sidebar />

      {/* Note list */}
      <div className="w-80 flex-shrink-0 border-r border-[#1f1f1f] flex flex-col h-screen">
        {/* Header */}
        <div className="p-4 border-b border-[#1f1f1f]">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display text-lg text-[#f5f0e8]">{getTitle()}</h1>
            <button
              onClick={() => setShowCreate(true)}
              className="p-1.5 rounded-lg bg-[#d4a853] text-[#0f0f0f] hover:bg-[#e8c47a] transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a4a]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-field pl-9 text-xs"
              placeholder="Search notes..."
            />
          </div>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-[#d4a853] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <StickyNote size={32} className="text-[#2a2a2a] mb-3" />
              <p className="text-[#4a4a4a] text-sm">No notes found</p>
              <button onClick={() => setShowCreate(true)} className="mt-3 text-xs text-[#d4a853] hover:underline">
                Create your first note
              </button>
            </div>
          ) : (
            notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => setSelectedNote(note)}
                isSelected={selectedNote?.id === note.id}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {/* Footer count */}
        <div className="p-3 border-t border-[#1f1f1f]">
          <p className="text-xs text-[#3a3a3a] text-center">{notes.length} notes</p>
        </div>
      </div>

      {/* Editor */}
      <NoteEditor
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
      />

      {/* Create modal */}
      {showCreate && (
        <CreateNoteModal
          onClose={() => setShowCreate(false)}
          onCreated={handleNoteCreated}
        />
      )}
    </div>
  );
}
