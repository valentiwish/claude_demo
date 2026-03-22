import { Star, Trash2 } from 'lucide-react';
import { useNoteStore } from '../../stores/noteStore';
import { useFolderStore } from '../../stores/folderStore';
import { cn, formatDate } from '../../lib/utils';
import type { Note } from '../../types';

export function NoteList() {
  const { notes, selectedNoteId, selectNote, deleteNote, toggleFavorite, getFilteredNotes } = useNoteStore();
  const { selectedFolderId } = useFolderStore();

  const filteredNotes = getFilteredNotes().filter(note => {
    if (selectedFolderId === null) return true;
    return note.folderId === selectedFolderId;
  });

  const getPreview = (content: string): string => {
    try {
      const doc = JSON.parse(content);
      let text = '';

      function extractText(node: any) {
        if (node.text) {
          text += node.text + ' ';
        }
        if (node.content) {
          node.content.forEach(extractText);
        }
      }

      extractText(doc);
      return text.slice(0, 80).trim() || '无内容';
    } catch {
      return '无内容';
    }
  };

  if (filteredNotes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-sm text-[var(--text-muted)] text-center">
          {notes.length === 0 ? '还没有笔记\n点击下方按钮创建第一篇笔记' : '未找到相关笔记'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-2">
      {filteredNotes.map(note => (
        <NoteItem
          key={note.id}
          note={note}
          isSelected={selectedNoteId === note.id}
          onSelect={() => selectNote(note.id)}
          onDelete={() => deleteNote(note.id)}
          onToggleFavorite={() => toggleFavorite(note.id)}
          preview={getPreview(note.content)}
        />
      ))}
    </div>
  );
}

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  preview: string;
}

function NoteItem({ note, isSelected, onSelect, onDelete, onToggleFavorite, preview }: NoteItemProps) {
  return (
    <div
      className={cn(
        'group flex items-start gap-2 px-3 py-2 mx-2 rounded-lg cursor-pointer',
        'transition-colors duration-150',
        isSelected
          ? 'bg-[var(--accent-primary)]/10 border-l-2 border-[var(--accent-primary)]'
          : 'hover:bg-[var(--bg-tertiary)]'
      )}
      onClick={onSelect}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={cn(
            'text-sm font-medium truncate',
            isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
          )}>
            {note.title || '无标题笔记'}
          </h3>
          {note.isFavorite && (
            <Star size={12} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{preview}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-[var(--text-muted)]">{formatDate(note.updatedAt)}</span>
          {note.tags.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-secondary)]">
              {note.tags[0]}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={e => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={cn(
            'p-1.5 rounded hover:bg-[var(--bg-tertiary)] transition-colors',
            note.isFavorite ? 'text-yellow-500' : 'text-[var(--text-muted)]'
          )}
          title={note.isFavorite ? '取消收藏' : '收藏'}
        >
          <Star size={14} className={note.isFavorite ? 'fill-yellow-500' : ''} />
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-red-500 transition-colors"
          title="删除"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
