import { Search, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { useNoteStore } from '../../stores/noteStore';
import { useUIStore } from '../../stores/uiStore';
import { cn } from '../../lib/utils';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useNoteStore();
  const { sidebarCollapsed } = useUIStore();

  if (sidebarCollapsed) return null;

  return (
    <div className="px-3 py-2">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        />
        <Input
          type="text"
          placeholder="搜索笔记..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9 pr-8 bg-[var(--bg-secondary)] border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 p-1',
              'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
              'rounded transition-colors'
            )}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
