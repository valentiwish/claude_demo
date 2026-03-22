import { create } from 'zustand';
import type { Folder } from '../types';
import { foldersApi } from '../lib/api';

interface FolderState {
  folders: Folder[];
  selectedFolderId: string | null;
  isLoading: boolean;

  loadFolders: () => Promise<void>;
  createFolder: (name: string, parentId?: string | null) => Promise<Folder>;
  updateFolder: (id: string, updates: Partial<Folder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  selectFolder: (id: string | null) => void;
  getFolderById: (id: string) => Folder | undefined;
  getSubfolders: (parentId: string | null) => Folder[];
}

export const useFolderStore = create<FolderState>((set, get) => ({
  folders: [],
  selectedFolderId: null,
  isLoading: false,

  loadFolders: async () => {
    set({ isLoading: true });
    try {
      const folders = await foldersApi.getAll();
      set({ folders, isLoading: false });
    } catch (error) {
      console.error('Failed to load folders:', error);
      set({ isLoading: false });
    }
  },

  createFolder: async (name, parentId = null) => {
    const newFolder = await foldersApi.create({ name, parentId });
    set(state => ({
      folders: [...state.folders, newFolder],
    }));
    return newFolder;
  },

  updateFolder: async (id, updates) => {
    const updatedFolder = await foldersApi.update(id, updates);
    set(state => ({
      folders: state.folders.map(folder =>
        folder.id === id ? updatedFolder : folder
      ),
    }));
  },

  deleteFolder: async (id) => {
    await foldersApi.delete(id);
    set(state => ({
      folders: state.folders.filter(f => f.id !== id),
      selectedFolderId: state.selectedFolderId === id ? null : state.selectedFolderId,
    }));
  },

  selectFolder: (id) => {
    set({ selectedFolderId: id });
  },

  getFolderById: (id) => {
    return get().folders.find(f => f.id === id);
  },

  getSubfolders: (parentId) => {
    return get().folders.filter(f => f.parentId === parentId).sort((a, b) => a.order - b.order);
  },
}));
