export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  tags: string[];
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export type Theme = 'light' | 'dark' | 'system';
