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

export interface CreateNoteDto {
  title?: string;
  content?: string;
  folderId?: string | null;
  tags?: string[];
  isFavorite?: boolean;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  folderId?: string | null;
  tags?: string[];
  isFavorite?: boolean;
}

export interface CreateFolderDto {
  name: string;
  parentId?: string | null;
}

export interface UpdateFolderDto {
  name?: string;
  parentId?: string | null;
  order?: number;
}
