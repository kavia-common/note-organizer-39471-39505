import React, { useMemo, useState } from 'react';
import { useNotes } from '../context/NotesContext';

// PUBLIC_INTERFACE
export default function Sidebar() {
  /** Sidebar includes Add Note, search, and a list of notes with selection */
  const { notes, selectedId, selectNote, createNote, loading } = useNotes();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return notes;
    return notes.filter(n =>
      (n.title || '').toLowerCase().includes(term) ||
      (n.content || '').toLowerCase().includes(term)
    );
  }, [q, notes]);

  return (
    <aside className="sidebar">
      <div className="sidebar-actions">
        <button className="btn btn-primary" onClick={createNote} disabled={loading} aria-label="Add note">
          + Add Note
        </button>
        <span className="badge" title="In-memory when no backend configured">Ocean</span>
      </div>
      <input
        className="search"
        placeholder="Search notes..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="note-list" role="list">
        {filtered.map(n => (
          <div
            key={n.id}
            role="listitem"
            className={`note-item ${selectedId === n.id ? 'active' : ''}`}
            onClick={() => selectNote(n.id)}
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' ? selectNote(n.id) : null)}
            aria-label={`Select note ${n.title || 'Untitled'}`}
          >
            <div className="note-title">{n.title || 'Untitled'}</div>
            <div className="note-updated">{formatDate(n.updatedAt)}</div>
          </div>
        ))}
        {!filtered.length && (
          <div className="helper">No notes found. Try a different search.</div>
        )}
      </div>
    </aside>
  );
}

function formatDate(ts) {
  try {
    if (!ts) return '';
    const d = new Date(ts);
    return `Updated ${d.toLocaleString()}`;
  } catch {
    return '';
  }
}
