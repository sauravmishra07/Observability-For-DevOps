import { BookOpen, StickyNote, Pin, Archive, Tag, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNotesStore } from '../store/notesStore';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { filters, setFilters, tags } = useNotesStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'All Notes', icon: StickyNote, action: () => setFilters({ is_archived: false, is_pinned: null, tag: null, search: '' }) },
    { label: 'Pinned', icon: Pin, action: () => setFilters({ is_pinned: true, is_archived: false, tag: null }) },
    { label: 'Archived', icon: Archive, action: () => setFilters({ is_archived: true, is_pinned: null }) },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0d0d0d] border-r border-[#1f1f1f] flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#d4a853] flex items-center justify-center flex-shrink-0">
            <BookOpen size={15} className="text-[#0f0f0f]" />
          </div>
          <span className="font-display text-xl text-[#f5f0e8]">Nota</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-3 space-y-0.5 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className={`sidebar-item w-full text-left ${
              item.label === 'Archived' && filters.is_archived
                ? 'active'
                : item.label === 'Pinned' && filters.is_pinned && !filters.is_archived
                ? 'active'
                : item.label === 'All Notes' && !filters.is_archived && filters.is_pinned === null && !filters.tag
                ? 'active'
                : ''
            }`}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        ))}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="pt-4">
            <p className="px-3 py-1 text-xs text-[#4a4a4a] uppercase tracking-widest font-medium">Tags</p>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilters({ tag, is_archived: false, is_pinned: null })}
                className={`sidebar-item w-full text-left ${filters.tag === tag ? 'active' : ''}`}
              >
                <Tag size={14} />
                <span className="truncate">{tag}</span>
                <ChevronRight size={12} className="ml-auto opacity-40" />
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-[#1f1f1f]">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-7 h-7 rounded-full bg-[#d4a853]/20 flex items-center justify-center text-[#d4a853] text-xs font-medium flex-shrink-0">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[#f5f0e8] truncate">{user?.username}</p>
            <p className="text-xs text-[#4a4a4a] truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-md text-[#4a4a4a] hover:text-red-400 hover:bg-red-400/10 transition-colors">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
