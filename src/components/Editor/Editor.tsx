import { useCallback, useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { common, createLowlight } from 'lowlight';
import { useNoteStore } from '../../stores/noteStore';
import { Toolbar } from './Toolbar';
import { Input } from '../ui/Input';
import { cn, countWords, getReadingTime, debounce } from '../../lib/utils';
import { FileText, Star, Save, Check } from 'lucide-react';

const lowlight = createLowlight(common);

export function Editor() {
  const { getSelectedNote, updateNote, toggleFavorite } = useNoteStore();
  const selectedNote = getSelectedNote();

  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: '开始书写...',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Highlight,
      Underline,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px]',
      },
    },
    onUpdate: ({ editor }) => {
      const json = JSON.stringify(editor.getJSON());
      setWordCount(countWords(json));

      // Auto-save with debounce
      debouncedSave(selectedNote?.id || '', title, json);
    },
  });

  const debouncedSave = useCallback(
    debounce(async (id: string, noteTitle: string, content: string) => {
      if (!id) return;
      setIsSaving(true);
      await updateNote(id, { title: noteTitle, content });
      setLastSaved(new Date());
      setIsSaving(false);
    }, 1000),
    [updateNote]
  );

  // Update editor content when selected note changes
  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setWordCount(countWords(selectedNote.content));

      if (editor && selectedNote.content) {
        try {
          const content = JSON.parse(selectedNote.content);
          editor.commands.setContent(content);
        } catch {
          editor.commands.setContent(selectedNote.content);
        }
      }
    } else {
      setTitle('');
      setWordCount(0);
      editor?.commands.clearContent();
    }
  }, [selectedNote?.id, editor]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (selectedNote) {
      setIsSaving(true);
      updateNote(selectedNote.id, { title: newTitle });
      setLastSaved(new Date());
      setIsSaving(false);
    }
  };

  if (!selectedNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <FileText size={64} className="mx-auto mb-4 text-[var(--text-muted)]" />
          <p className="text-lg text-[var(--text-secondary)]">选择一篇笔记开始编辑</p>
          <p className="text-sm text-[var(--text-muted)] mt-2">或点击左下角新建笔记</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-primary)] overflow-hidden">
      {/* Title */}
      <div className="px-8 pt-8 pb-4">
        <div className="max-w-[720px] mx-auto">
          <div className="flex items-start gap-3">
            <Input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="无标题笔记"
              className="text-3xl font-bold border-none bg-transparent px-0 focus:ring-0 placeholder-[var(--text-muted)]"
            />
            <button
              onClick={() => toggleFavorite(selectedNote.id)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                selectedNote.isFavorite
                  ? 'text-yellow-500 hover:bg-yellow-500/10'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]'
              )}
              title={selectedNote.isFavorite ? '取消收藏' : '收藏'}
            >
              <Star size={20} className={selectedNote.isFavorite ? 'fill-yellow-500' : ''} />
            </button>
          </div>

          {/* Tags */}
          {selectedNote.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {selectedNote.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-[var(--bg-tertiary)] rounded-full text-[var(--text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar editor={editor} />

      {/* Editor */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className="max-w-[720px] mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-8 py-2 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-[720px] mx-auto flex items-center justify-between text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-4">
            <span>{wordCount} 字</span>
            <span>{getReadingTime(wordCount)}</span>
          </div>

          <div className="flex items-center gap-2">
            {isSaving ? (
              <span className="flex items-center gap-1 text-[var(--accent-primary)]">
                <Save size={12} className="animate-pulse" />
                保存中...
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1 text-[var(--accent-secondary)]">
                <Check size={12} />
                已保存
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
