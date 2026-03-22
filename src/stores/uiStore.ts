import { create } from 'zustand';
import type { Theme } from '../types';

interface UIState {
  theme: Theme;
  sidebarCollapsed: boolean;
  aiPanelOpen: boolean;

  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  toggleAiPanel: () => void;
  initTheme: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: 'system',
  sidebarCollapsed: false,
  aiPanelOpen: false,

  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('noteflow-theme', theme);

    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  },

  toggleSidebar: () => {
    set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  toggleAiPanel: () => {
    set(state => ({ aiPanelOpen: !state.aiPanelOpen }));
  },

  initTheme: () => {
    const savedTheme = localStorage.getItem('noteflow-theme') as Theme | null;
    if (savedTheme) {
      get().setTheme(savedTheme);
    } else {
      get().setTheme('system');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (get().theme === 'system') {
        get().setTheme('system');
      }
    });
  },
}));
