import { useState, useEffect, useCallback } from 'react';
import { Note, NOTE_COLORS } from '../types';
import { useNotesStore } from '../store/notesStore';
import { Pin, X, Palette, Tag, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  note: Note | null;
  onClose: () => void;
}

export default function NoteEditor({ note, onClose }: Props) {
  const { updateNote } = useNotesStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [color, setColor] = useState('#171717');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setColor(note.color);
      setIsDirty(false);
    }
  }, [note?.id]);

  const save = useCallback(async () => {
    if (!note || !isDirty) return;
    if (!title.trim()) { toast.error('Title is required'); return; }
    setIsSaving(true);
    try {
      await updateNote(note.id, { title: title.trim(), content, tags, color });
      setIsDirty(false);
    } catch {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  }, [note, title, content, tags, color, isDirty, updateNote]);

  // Auto-save debounce
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(save, 1500);
    return () => clearTimeout(timer);
  }, [title, content, tags, color, isDirty]);

  const markDirty = () => setIsDirty(true);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setIsDirty(true);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
    setIsDirty(true);
  };

  const handlePin = async () => {
    if (!note) return;
    await updateNote(note.id, { is_pinned: !note.is_pinned });
    toast.success(note.is_pinned ? 'Unpinned' : 'Pinned');
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1f1f1f] flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <p className="text-[#4a4a4a] text-sm">Select a note to edit</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0f0f0f]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-6 py-3.5 border-b border-[#1f1f1f]">
        <button onClick={handlePin} className={`p-1.5 rounded-lg transition-colors ${note.is_pinned ? 'text-[#d4a853] bg-[#d4a853]/10' : 'text-[#4a4a4a] hover:text-[#a8a090] hover:bg-[#1f1f1f]'}`}>
          <Pin size={16} className={note.is_pinned ? 'fill-current' : ''} />
        </button>
        <div className="relative">
          <button onClick={() => setShowColorPicker(!showColorPicker)} className="p-1.5 rounded-lg text-[#4a4a4a] hover:text-[#a8a090] hover:bg-[#1f1f1f] transition-colors">
            <Palette size={16} />
          </button>
          {showColorPicker && (
            <div className="absolute top-9 left-0 z-50 bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl p-3 shadow-xl animate-scale-in">
              <div className="grid grid-cols-4 gap-2">
                {NOTE_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setColor(c); setIsDirty(true); setShowColorPicker(false); }}
                    className="w-7 h-7 rounded-lg border-2 transition-all"
                    style={{ backgroundColor: c, borderColor: color === c ? '#d4a853' : 'transparent' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex-1" />
        {isDirty && (
          <span className="text-xs text-[#4a4a4a] flex items-center gap-1">
            {isSaving ? '💾 Saving...' : '● Unsaved'}
          </span>
        )}
        {!isDirty && !isSaving && (
          <span className="text-xs text-[#3a3a3a] flex items-center gap-1">
            <Check size={12} className="text-green-600" /> Saved
          </span>
        )}
        <button onClick={onClose} className="p-1.5 rounded-lg text-[#4a4a4a] hover:text-[#f5f0e8] hover:bg-[#1f1f1f] transition-colors lg:hidden">
          <X size={16} />
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); markDirty(); }}
          className="w-full bg-transparent text-xl font-display text-[#f5f0e8] placeholder:text-[#2a2a2a] focus:outline-none mb-4 leading-relaxed"
          placeholder="Note title..."
        />

        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); markDirty(); }}
          className="w-full bg-transparent text-sm text-[#a8a090] placeholder:text-[#2a2a2a] focus:outline-none resize-none leading-relaxed min-h-64"
          placeholder="Start writing..."
          style={{ minHeight: 'calc(100vh - 340px)' }}
        />
      </div>

      {/* Tags + Meta */}
      <div className="border-t border-[#1f1f1f] px-6 py-4">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <Tag size={13} className="text-[#4a4a4a] flex-shrink-0" />
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-[#d4a853]/10 text-[#d4a853]">
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors">
                <X size={10} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
            className="bg-transparent text-xs text-[#a8a090] placeholder:text-[#3a3a3a] focus:outline-none w-20"
            placeholder="Add tag..."
          />
        </div>
        <p className="text-[10px] text-[#3a3a3a]">
          Updated {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
