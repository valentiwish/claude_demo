import { type Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Minus,
  Link,
  Image,
  Table,
  Undo,
  Redo,
  Highlighter,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface ToolItem {
  icon: typeof Bold;
  title: string;
  action: () => void;
  isActive: () => boolean;
  disabled?: () => boolean;
}

interface ToolbarProps {
  editor: Editor | null;
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const tools: { group: string; items: ToolItem[] }[] = [
    {
      group: 'heading',
      items: [
        {
          icon: Heading1,
          title: '标题 1',
          action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
          icon: Heading2,
          title: '标题 2',
          action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
          icon: Heading3,
          title: '标题 3',
          action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: () => editor.isActive('heading', { level: 3 }),
        },
      ],
    },
    {
      group: 'format',
      items: [
        {
          icon: Bold,
          title: '粗体 (Ctrl+B)',
          action: () => editor.chain().focus().toggleBold().run(),
          isActive: () => editor.isActive('bold'),
        },
        {
          icon: Italic,
          title: '斜体 (Ctrl+I)',
          action: () => editor.chain().focus().toggleItalic().run(),
          isActive: () => editor.isActive('italic'),
        },
        {
          icon: Underline,
          title: '下划线 (Ctrl+U)',
          action: () => editor.chain().focus().toggleUnderline().run(),
          isActive: () => editor.isActive('underline'),
        },
        {
          icon: Strikethrough,
          title: '删除线',
          action: () => editor.chain().focus().toggleStrike().run(),
          isActive: () => editor.isActive('strike'),
        },
        {
          icon: Highlighter,
          title: '高亮',
          action: () => editor.chain().focus().toggleHighlight().run(),
          isActive: () => editor.isActive('highlight'),
        },
        {
          icon: Code,
          title: '行内代码',
          action: () => editor.chain().focus().toggleCode().run(),
          isActive: () => editor.isActive('code'),
        },
      ],
    },
    {
      group: 'list',
      items: [
        {
          icon: List,
          title: '无序列表',
          action: () => editor.chain().focus().toggleBulletList().run(),
          isActive: () => editor.isActive('bulletList'),
        },
        {
          icon: ListOrdered,
          title: '有序列表',
          action: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: () => editor.isActive('orderedList'),
        },
        {
          icon: ListChecks,
          title: '任务列表',
          action: () => editor.chain().focus().toggleTaskList().run(),
          isActive: () => editor.isActive('taskList'),
        },
      ],
    },
    {
      group: 'block',
      items: [
        {
          icon: Quote,
          title: '引用',
          action: () => editor.chain().focus().toggleBlockquote().run(),
          isActive: () => editor.isActive('blockquote'),
        },
        {
          icon: Minus,
          title: '分割线',
          action: () => editor.chain().focus().setHorizontalRule().run(),
          isActive: () => false,
        },
        {
          icon: Link,
          title: '链接',
          action: () => {
            const url = window.prompt('输入链接地址:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          },
          isActive: () => editor.isActive('link'),
        },
        {
          icon: Image,
          title: '图片',
          action: () => {
            const url = window.prompt('输入图片地址:');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          },
          isActive: () => false,
        },
        {
          icon: Table,
          title: '表格',
          action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
          isActive: () => editor.isActive('table'),
        },
      ],
    },
    {
      group: 'history',
      items: [
        {
          icon: Undo,
          title: '撤销 (Ctrl+Z)',
          action: () => editor.chain().focus().undo().run(),
          isActive: () => false,
          disabled: () => !editor.can().undo(),
        },
        {
          icon: Redo,
          title: '重做 (Ctrl+Y)',
          action: () => editor.chain().focus().redo().run(),
          isActive: () => false,
          disabled: () => !editor.can().redo(),
        },
      ],
    },
  ];

  return (
    <div className="px-8 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="max-w-[720px] mx-auto flex items-center gap-1 flex-wrap">
        {tools.map((group, groupIndex) => (
          <div key={group.group} className="flex items-center gap-0.5">
            {groupIndex > 0 && (
              <div className="w-px h-5 bg-[var(--border)] mx-1" />
            )}
            {group.items.map(tool => (
              <Button
                key={tool.title}
                variant="ghost"
                size="sm"
                onClick={tool.action}
                disabled={tool.disabled?.()}
                className={cn(
                  'w-8 h-8 p-0',
                  tool.isActive() && 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                )}
                title={tool.title}
              >
                <tool.icon size={16} />
              </Button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
