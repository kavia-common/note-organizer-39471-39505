import React, { useEffect, useMemo, useState } from 'react';
import { useNotes } from '../context/NotesContext';

// PUBLIC_INTERFACE
export default function Editor() {
  /** Main editor for selected note with title, content, and actions */
  const { notes, selectedId, updateNote, deleteNote, loading } = useNotes();
  const note = useMemo(() => notes.find(n => n.id === selectedId) || null, [notes, selectedId]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setSaving(false);
  }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const canEdit = !!note;

  const save = async () => {
    if (!note) return;
    setSaving(true);
    try {
      await updateNote(note.id, { title, content });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!note) return;
    const ok = window.confirm('Delete this note? This action cannot be undone.');
    if (!ok) return;
    await deleteNote(note.id);
  };

  if (!canEdit) {
    return (
      <main className="main">
        <div className="editor-card">
          <div className="helper">No note selected. Choose a note from the left or create a new one.</div>
        </div>
      </main>
    );
  }

  return (
    <main className="main">
      <div className="editor-card">
        <input
          className="input-title"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={save}
          disabled={loading}
        />
        <textarea
          className="textarea-content"
          placeholder="Start writing your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={save}
          disabled={loading}
        />
        <div className="editor-actions">
          <div className="helper">{saving ? 'Saving...' : 'Changes are auto-saved on blur.'}</div>
          <div className="right">
            <button className="btn btn-outline" onClick={save} disabled={saving || loading}>
              Save
            </button>
            <button className="btn" style={{ background: 'linear-gradient(135deg, #DC2626, #EF4444)', color: '#fff' }} onClick={onDelete} disabled={loading}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
