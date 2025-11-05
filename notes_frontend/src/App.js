import React from 'react';
import './styles/ocean.css';
import { NotesProvider, useNotes } from './context/NotesContext';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Header from './components/Header';

// PUBLIC_INTERFACE
function AppShell() {
  /** Shell that renders header, sidebar, and main editor */
  const { loading, error } = useNotes();

  return (
    <div className="app-shell">
      <Header />
      <Sidebar />
      <Editor />
      {loading && <div style={loadingStyle} role="status">Loading notes…</div>}
      {error && <div style={errorStyle} role="alert">Error: {error}</div>}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root component providing Notes context and rendering the app shell */
  return (
    <NotesProvider>
      <AppShell />
    </NotesProvider>
  );
}

const loadingStyle = {
  position: 'fixed',
  bottom: 12,
  left: 12,
  background: 'rgba(255,255,255,0.95)',
  padding: '8px 12px',
  borderRadius: 8,
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  border: '1px solid rgba(17,24,39,0.06)',
  fontSize: 13,
};

const errorStyle = {
  position: 'fixed',
  bottom: 12,
  right: 12,
  background: '#fff5f5',
  padding: '10px 14px',
  borderRadius: 8,
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  border: '1px solid #fecaca',
  color: '#991b1b',
  fontWeight: 600,
  fontSize: 13,
};

export default App;
