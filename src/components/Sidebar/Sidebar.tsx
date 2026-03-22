import { useUIStore } from '../../stores/uiStore';
import { useNoteStore } from '../../stores/noteStore';
import { useFolderStore } from '../../stores/folderStore';
import { SearchBar } from './SearchBar';
import { FolderTree } from './FolderTree';
import { NoteList } from './NoteList';
import { Button } from '../ui/Button';
import { Plus, PanelLeftClose, PanelLeft, Sparkles, Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, theme, setTheme, aiPanelOpen, toggleAiPanel } = useUIStore();
  const { createNote } = useNoteStore();
  const { selectedFolderId } = useFolderStore();

  const handleNewNote = async () => {
    await createNote(selectedFolderId);
  };

  return (
    <aside
      className={cn(
        'h-full flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border)]',
        'transition-all duration-250 ease-out',
        sidebarCollapsed ? 'w-[60px]' : 'w-[260px]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
        {!sidebarCollapsed && (
          <h1 className="text-lg font-bold text-[var(--accent-primary)]">NoteFlow</h1>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="w-8 h-8 p-0"
            title={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
          >
            {sidebarCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </Button>
        </div>
      </div>

      {/* Search */}
      <SearchBar />

      {/* AI Button */}
      {!sidebarCollapsed && (
        <div className="px-3 py-2">
          <Button
            variant={aiPanelOpen ? 'primary' : 'secondary'}
            size="sm"
            onClick={toggleAiPanel}
            className="w-full justify-start gap-2"
          >
            <Sparkles size={16} />
            <span>AI 助手</span>
          </Button>
        </div>
      )}

      {/* Folders */}
      {!sidebarCollapsed && <FolderTree />}

      {/* Notes */}
      {!sidebarCollapsed && <NoteList />}

      {/* Footer */}
      <div className="p-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleNewNote}
            className={cn('flex-1', sidebarCollapsed && 'w-8 p-0 justify-center')}
            title="新建笔记"
          >
            <Plus size={16} />
            {!sidebarCollapsed && <span>新建笔记</span>}
          </Button>

          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 p-0"
              title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
