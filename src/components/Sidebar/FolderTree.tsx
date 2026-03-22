import { useState } from 'react';
import { Folder, FolderOpen, ChevronRight, ChevronDown, Plus, Trash2, Edit2 } from 'lucide-react';
import { useFolderStore } from '../../stores/folderStore';
import { useNoteStore } from '../../stores/noteStore';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export function FolderTree() {
  const { folders, selectedFolderId, selectFolder, createFolder, updateFolder, deleteFolder, getSubfolders } = useFolderStore();
  const { notes } = useNoteStore();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['default']));
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');

  const rootFolders = getSubfolders(null);

  const toggleExpanded = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleStartEdit = (folderId: string, currentName: string) => {
    setEditingFolderId(folderId);
    setEditingName(currentName);
  };

  const handleFinishEdit = async () => {
    if (editingFolderId && editingName.trim()) {
      await updateFolder(editingFolderId, { name: editingName.trim() });
    }
    setEditingFolderId(null);
    setEditingName('');
  };

  const handleCreateFolder = async (parentId: string | null) => {
    if (newFolderName.trim()) {
      await createFolder(newFolderName.trim(), parentId);
    }
    setNewFolderName('');
    setShowNewFolderInput(null);
  };

  const getNoteCount = (folderId: string) => {
    return notes.filter(n => n.folderId === folderId && !n.deletedAt).length;
  };

  const renderFolder = (folder: typeof folders[0], depth: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const subfolders = getSubfolders(folder.id);
    const noteCount = getNoteCount(folder.id);

    return (
      <div key={folder.id}>
        <div
          className={cn(
            'flex items-center gap-1 px-3 py-1.5 cursor-pointer rounded-lg',
            'text-sm transition-colors duration-150',
            'hover:bg-[var(--bg-tertiary)]',
            isSelected && 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
          )}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
          onClick={() => selectFolder(folder.id)}
        >
          {subfolders.length > 0 ? (
            <button
              onClick={e => {
                e.stopPropagation();
                toggleExpanded(folder.id);
              }}
              className="p-0.5 hover:bg-[var(--bg-tertiary)] rounded"
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-5" />
          )}

          {isExpanded ? (
            <FolderOpen size={16} className="text-[var(--text-secondary)]" />
          ) : (
            <Folder size={16} className="text-[var(--text-secondary)]" />
          )}

          {editingFolderId === folder.id ? (
            <input
              type="text"
              value={editingName}
              onChange={e => setEditingName(e.target.value)}
              onBlur={handleFinishEdit}
              onKeyDown={e => {
                if (e.key === 'Enter') handleFinishEdit();
                if (e.key === 'Escape') {
                  setEditingFolderId(null);
                  setEditingName('');
                }
              }}
              className="flex-1 px-1 py-0.5 text-sm bg-[var(--bg-primary)] border border-[var(--accent-primary)] rounded outline-none"
              autoFocus
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <span className="flex-1 truncate">{folder.name}</span>
          )}

          {noteCount > 0 && (
            <span className="text-xs text-[var(--text-muted)]">{noteCount}</span>
          )}

          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
            <button
              onClick={e => {
                e.stopPropagation();
                setShowNewFolderInput(folder.id);
              }}
              className="p-1 hover:bg-[var(--bg-tertiary)] rounded"
              title="新建子文件夹"
            >
              <Plus size={12} />
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                handleStartEdit(folder.id, folder.name);
              }}
              className="p-1 hover:bg-[var(--bg-tertiary)] rounded"
              title="重命名"
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                deleteFolder(folder.id);
              }}
              className="p-1 hover:bg-[var(--bg-tertiary)] rounded text-red-500"
              title="删除"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {isExpanded && subfolders.length > 0 && (
          <div>
            {subfolders.map(subfolder => renderFolder(subfolder, depth + 1))}
          </div>
        )}

        {showNewFolderInput === folder.id && (
          <div
            className="flex items-center gap-1 px-3 py-1"
            style={{ paddingLeft: `${28 + depth * 16}px` }}
          >
            <Folder size={14} className="text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="文件夹名称"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onBlur={() => handleCreateFolder(folder.id)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCreateFolder(folder.id);
                if (e.key === 'Escape') {
                  setShowNewFolderInput(null);
                  setNewFolderName('');
                }
              }}
              className="flex-1 px-2 py-1 text-sm bg-[var(--bg-primary)] border border-[var(--border)] rounded outline-none focus:border-[var(--accent-primary)]"
              autoFocus
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-3 mb-2">
        <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          文件夹
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowNewFolderInput(null)}
          className="h-6 w-6 p-0"
          title="新建文件夹"
        >
          <Plus size={14} />
        </Button>
      </div>

      <div className="group">
        {/* All Notes option */}
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-lg',
            'text-sm transition-colors duration-150',
            'hover:bg-[var(--bg-tertiary)]',
            selectedFolderId === null && 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
          )}
          onClick={() => selectFolder(null)}
        >
          <Folder size={16} className="text-[var(--text-secondary)]" />
          <span className="flex-1">全部笔记</span>
          <span className="text-xs text-[var(--text-muted)]">
            {notes.filter(n => !n.deletedAt).length}
          </span>
        </div>

        {/* Folder list */}
        {rootFolders.map(folder => renderFolder(folder))}

        {/* New folder input at root */}
        {showNewFolderInput === null && (
          <button
            onClick={() => setShowNewFolderInput(null)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 w-full',
              'text-sm text-[var(--text-muted)] transition-colors',
              'hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-secondary)]'
            )}
          >
            <Plus size={16} />
            <span>新建文件夹</span>
          </button>
        )}

        {showNewFolderInput === null && (
          <div className="px-3 py-1">
            <input
              type="text"
              placeholder="文件夹名称"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onBlur={() => handleCreateFolder(null)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCreateFolder(null);
                if (e.key === 'Escape') {
                  setShowNewFolderInput(null as any);
                  setNewFolderName('');
                }
              }}
              className="w-full px-2 py-1 text-sm bg-[var(--bg-primary)] border border-[var(--border)] rounded outline-none focus:border-[var(--accent-primary)]"
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
}
