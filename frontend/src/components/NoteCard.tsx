import { Note } from '../types';
import { Pin, Archive, Trash2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState, useRef, useEffect } from 'react';
import { useNotesStore } from '../store/notesStore';
import toast from 'react-hot-toast';

interface Props {
  note: Note;
  onClick: () => void;
  isSelected: boolean;
}

export default function NoteCard({ note, onClick, isSelected }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { updateNote, deleteNote } = useNotesStore();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handlePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await updateNote(note.id, { is_pinned: !note.is_pinned });
    toast.success(note.is_pinned ? 'Unpinned' : 'Pinned');
  };

  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await updateNote(note.id, { is_archived: !note.is_archived });
    toast.success(note.is_archived ? 'Unarchived' : 'Archived');
    setMenuOpen(false);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this note?')) {
      await deleteNote(note.id);
      toast.success('Note deleted');
    }
    setMenuOpen(false);
  };

  const preview = note.content.replace(/[#*`_~]/g, '').slice(0, 120);

  return (
    <div
      onClick={onClick}
      className={`note-card animate-scale-in group ${isSelected ? 'border-[#d4a853]/50 bg-[#1a1a14]' : ''}`}
      style={{ borderLeftColor: note.color !== '#171717' ? note.color : undefined, borderLeftWidth: note.color !== '#171717' ? '3px' : undefined }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-medium text-[#f5f0e8] line-clamp-2 flex-1 leading-snug">{note.title}</h3>
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handlePin} className={`p-1 rounded-md transition-colors ${note.is_pinned ? 'text-[#d4a853]' : 'text-[#4a4a4a] hover:text-[#a8a090]'}`}>
            <Pin size={13} className={note.is_pinned ? 'fill-current' : ''} />
          </button>
          <div className="relative" ref={menuRef}>
            <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} className="p-1 rounded-md text-[#4a4a4a] hover:text-[#a8a090] transition-colors">
              <MoreHorizontal size={14} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-7 z-50 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg shadow-xl py-1 min-w-36 animate-scale-in">
                <button onClick={handleArchive} className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-[#a8a090] hover:bg-[#2a2a2a] hover:text-[#f5f0e8]">
                  <Archive size={13} /> {note.is_archived ? 'Unarchive' : 'Archive'}
                </button>
                <button onClick={handleDelete} className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-400/10">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      {preview && <p className="text-xs text-[#6a6a5a] line-clamp-3 mb-3 leading-relaxed">{preview}</p>}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {note.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-[10px] rounded-full bg-[#d4a853]/10 text-[#d4a853] font-medium">
              {tag}
            </span>
          ))}
          {note.tags.length > 2 && (
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#2a2a2a] text-[#4a4a4a]">+{note.tags.length - 2}</span>
          )}
        </div>
        <span className="text-[10px] text-[#3a3a3a] flex-shrink-0">
          {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
