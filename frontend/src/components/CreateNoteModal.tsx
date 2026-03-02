import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useNotesStore } from '../store/notesStore';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
  onCreated: (id: string) => void;
}

export default function CreateNoteModal({ onClose, onCreated }: Props) {
  const { createNote } = useNotesStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) { toast.error('Title is required'); return; }
    setIsLoading(true);
    try {
      const note = await createNote({ title: title.trim(), content });
      toast.success('Note created!');
      onCreated(note.id);
    } catch {
      toast.error('Failed to create note');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#171717] border border-[#2a2a2a] rounded-2xl w-full max-w-md shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a]">
          <h2 className="text-base font-medium text-[#f5f0e8]">New Note</h2>
          <button onClick={onClose} className="p-1 rounded-md text-[#4a4a4a] hover:text-[#a8a090] hover:bg-[#1f1f1f] transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field text-base font-display"
              placeholder="Note title..."
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field resize-none"
              rows={4}
              placeholder="Start writing... (optional)"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button onClick={handleCreate} disabled={isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Plus size={15} /> Create Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
