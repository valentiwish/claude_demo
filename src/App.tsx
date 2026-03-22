import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { AIPanel } from './components/AI_Panel';
import { useNoteStore } from './stores/noteStore';
import { useFolderStore } from './stores/folderStore';
import { useUIStore } from './stores/uiStore';

function App() {
  const { loadNotes } = useNoteStore();
  const { loadFolders } = useFolderStore();
  const { initTheme } = useUIStore();

  useEffect(() => {
    // Initialize theme
    initTheme();

    // Load data
    loadNotes();
    loadFolders();
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-primary)]">
      <Sidebar />
      <Editor />
      <AIPanel />
    </div>
  );
}

export default App;
