import Dexie, { type Table } from 'dexie';
import type { Note, Folder } from '../types';

export class NoteFlowDB extends Dexie {
  notes!: Table<Note, string>;
  folders!: Table<Folder, string>;

  constructor() {
    super('NoteFlowDB');
    this.version(1).stores({
      notes: 'id, title, folderId, *tags, isFavorite, createdAt, updatedAt, deletedAt',
      folders: 'id, name, parentId, order, createdAt',
    });
  }
}

export const db = new NoteFlowDB();

// Note operations
export async function createNote(note: Note): Promise<string> {
  return await db.notes.add(note);
}

export async function updateNote(id: string, updates: Partial<Note>): Promise<number> {
  return await db.notes.update(id, { ...updates, updatedAt: Date.now() });
}

export async function deleteNote(id: string): Promise<number> {
  return await db.notes.update(id, { deletedAt: Date.now() });
}

export async function permanentlyDeleteNote(id: string): Promise<void> {
  await db.notes.delete(id);
}

export async function getNote(id: string): Promise<Note | undefined> {
  return await db.notes.get(id);
}

export async function getAllNotes(): Promise<Note[]> {
  return await db.notes.where('deletedAt').equals(0).or('deletedAt').equals(null as any).toArray();
}

export async function getNotesByFolder(folderId: string | null): Promise<Note[]> {
  const query = folderId
    ? db.notes.where('folderId').equals(folderId)
    : db.notes.where('folderId').equals(null as any);
  return await query.filter(n => !n.deletedAt).toArray();
}

export async function searchNotes(query: string): Promise<Note[]> {
  const lowerQuery = query.toLowerCase();
  const all = await db.notes.toArray();
  return all.filter(n =>
    !n.deletedAt &&
    (n.title.toLowerCase().includes(lowerQuery) ||
     n.content.toLowerCase().includes(lowerQuery))
  );
}

export async function getFavoriteNotes(): Promise<Note[]> {
  return await db.notes.where('isFavorite').equals(1).filter(n => !n.deletedAt).toArray();
}

export async function getRecentNotes(limit: number = 10): Promise<Note[]> {
  return await db.notes
    .orderBy('updatedAt')
    .reverse()
    .filter(n => !n.deletedAt)
    .limit(limit)
    .toArray();
}

// Folder operations
export async function createFolder(folder: Folder): Promise<string> {
  return await db.folders.add(folder);
}

export async function updateFolder(id: string, updates: Partial<Folder>): Promise<number> {
  return await db.folders.update(id, { ...updates, updatedAt: Date.now() });
}

export async function deleteFolder(id: string): Promise<void> {
  await db.folders.delete(id);
}

export async function getAllFolders(): Promise<Folder[]> {
  return await db.folders.orderBy('order').toArray();
}

export async function getSubfolders(parentId: string | null): Promise<Folder[]> {
  const query = parentId
    ? db.folders.where('parentId').equals(parentId)
    : db.folders.where('parentId').equals(null as any);
  return await query.toArray();
}

// Initialize with default data
export async function initializeDB() {
  const noteCount = await db.notes.count();
  const folderCount = await db.folders.count();

  if (noteCount === 0 && folderCount === 0) {
    // Create default folder
    await db.folders.add({
      id: 'default',
      name: '我的笔记',
      parentId: null,
      order: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create sample notes
    const sampleNotes: Note[] = [
      {
        id: 'welcome',
        title: '欢迎使用 NoteFlow',
        content: JSON.stringify({
          type: 'doc',
          content: [
            { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '欢迎使用 NoteFlow' }] },
            { type: 'paragraph', content: [{ type: 'text', text: '这是一款融合 AI 能力的智能笔记应用。' }] },
            { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '核心功能' }] },
            { type: 'bulletList', content: [
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '流畅的富文本编辑体验' }] }] },
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '灵活的文件夹整理系统' }] }] },
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '强大的搜索功能' }] }] },
            ]},
            { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '开始使用' }] },
            { type: 'paragraph', content: [{ type: 'text', text: '点击左侧的"新建笔记"按钮，开始记录你的想法吧！' }] },
          ]
        }),
        folderId: 'default',
        tags: ['欢迎'],
        isFavorite: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: null,
      },
      {
        id: 'markdown-guide',
        title: 'Markdown 写作指南',
        content: JSON.stringify({
          type: 'doc',
          content: [
            { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Markdown 写作指南' }] },
            { type: 'paragraph', content: [{ type: 'text', text: 'NoteFlow 支持丰富的 Markdown 语法，让你专注于写作。' }] },
            { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '常用语法' }] },
            { type: 'paragraph', content: [
              { type: 'text', marks: [{ type: 'bold' }], text: '粗体文字' },
              { type: 'text', text: ' 和 ' },
              { type: 'text', marks: [{ type: 'italic' }], text: '斜体文字' },
            ]},
            { type: 'bulletList', content: [
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '无序列表项' }] }] },
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '另一个列表项' }] }] },
            ]},
            { type: 'codeBlock', attrs: { language: 'javascript' }, content: [{ type: 'text', text: 'const greeting = "Hello, NoteFlow!";\nconsole.log(greeting);' }] },
          ]
        }),
        folderId: 'default',
        tags: ['教程', 'Markdown'],
        isFavorite: false,
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 86400000,
        deletedAt: null,
      },
    ];

    await db.notes.bulkAdd(sampleNotes);
  }
}
