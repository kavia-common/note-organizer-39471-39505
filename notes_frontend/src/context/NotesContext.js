import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { NotesApi } from '../services/api';

// PUBLIC_INTERFACE
export const NotesContext = createContext(undefined);

/**
 * PUBLIC_INTERFACE
 * NotesProvider wraps the app and manages notes state and operations.
 * It provides: notes, selectedId, selectNote, createNote, updateNote, deleteNote, reload, loading, error.
 */
export function NotesProvider({ children }) {
  const api = useMemo(() => new NotesApi(), []);
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.listNotes();
      setNotes(data);
      if (data.length && !selectedId) {
        setSelectedId(data[0].id);
      }
    } catch (e) {
      setError(e?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PUBLIC_INTERFACE
  const selectNote = (id) => setSelectedId(id);

  // PUBLIC_INTERFACE
  const createNote = async () => {
    const created = await api.createNote({ title: 'New Note', content: '' });
    setNotes(prev => [created, ...prev]);
    setSelectedId(created.id);
    return created;
    };

  // PUBLIC_INTERFACE
  const updateNote = async (id, patch) => {
    const updated = await api.updateNote(id, patch);
    setNotes(prev => prev.map(n => (n.id === id ? updated : n)));
    return updated;
  };

  // PUBLIC_INTERFACE
  const deleteNote = async (id) => {
    await api.deleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selectedId === id) {
      setSelectedId(prev => {
        const remaining = notes.filter(n => n.id !== id);
        return remaining.length ? remaining[0].id : null;
      });
    }
  };

  const value = {
    notes,
    selectedId,
    loading,
    error,
    selectNote,
    createNote,
    updateNote,
    deleteNote,
    reload,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

// PUBLIC_INTERFACE
export function useNotes() {
  /** Hook to access notes context safely */
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
