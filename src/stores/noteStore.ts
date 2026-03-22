import { create } from 'zustand';
import type { Note } from '../types';
import { notesApi } from '../lib/api';

interface NoteState {
  notes: Note[];
  selectedNoteId: string | null;
  isLoading: boolean;
  searchQuery: string;

  loadNotes: () => Promise<void>;
  createNote: (folderId?: string | null) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  selectNote: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  getSelectedNote: () => Note | undefined;
  toggleFavorite: (id: string) => Promise<void>;
  getFilteredNotes: () => Note[];
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  selectedNoteId: null,
  isLoading: false,
  searchQuery: '',

  loadNotes: async () => {
    set({ isLoading: true });
    try {
      const notes = await notesApi.getAll();
      set({ notes: notes.sort((a: Note, b: Note) => b.updatedAt - a.updatedAt), isLoading: false });
    } catch (error) {
      console.error('Failed to load notes:', error);
      set({ isLoading: false });
    }
  },

  createNote: async (folderId = null) => {
    const newNote = await notesApi.create({
      title: '无标题笔记',
      content: '',
      folderId,
      tags: [],
      isFavorite: false,
    });
    set(state => ({
      notes: [newNote, ...state.notes],
      selectedNoteId: newNote.id,
    }));
    return newNote;
  },

  updateNote: async (id, updates) => {
    const updatedNote = await notesApi.update(id, updates);
    set(state => ({
      notes: state.notes.map(note =>
        note.id === id ? updatedNote : note
      ),
    }));
  },

  deleteNote: async (id) => {
    await notesApi.delete(id);
    set(state => ({
      notes: state.notes.filter(note => note.id !== id),
      selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId,
    }));
  },

  selectNote: (id) => {
    set({ selectedNoteId: id });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  getSelectedNote: () => {
    const { notes, selectedNoteId } = get();
    return notes.find(n => n.id === selectedNoteId);
  },

  toggleFavorite: async (id) => {
    const note = get().notes.find(n => n.id === id);
    if (note) {
      const updatedNote = await notesApi.update(id, { isFavorite: !note.isFavorite });
      set(state => ({
        notes: state.notes.map(n => n.id === id ? updatedNote : n),
      }));
    }
  },

  getFilteredNotes: () => {
    const { notes, searchQuery, selectedNoteId } = get();
    let filtered = notes.filter(n => !n.deletedAt);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        n =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => {
      if (a.id === selectedNoteId) return -1;
      if (b.id === selectedNoteId) return 1;
      return b.updatedAt - a.updatedAt;
    });
  },
}));
