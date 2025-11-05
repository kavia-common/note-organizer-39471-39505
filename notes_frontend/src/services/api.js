//
// API abstraction layer with graceful fallback to in-memory mock
//

// PUBLIC_INTERFACE
export class NotesApi {
  /**
   * NotesApi provides CRUD operations for notes.
   * If a backend URL is available via REACT_APP_API_BASE or REACT_APP_BACKEND_URL,
   * it will use HTTP requests. Otherwise it will fallback to an in-memory mock store.
   *
   * PUBLIC_INTERFACE
   */
  constructor() {
    // Read potential API base URLs from environment
    const apiBase = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || '';
    this.baseUrl = apiBase ? apiBase.replace(/\/+$/, '') : ''; // strip trailing slash
    this.useMock = !this.baseUrl;
    this.mockStore = null;
    if (this.useMock) {
      // Initialize in-memory store
      this.mockStore = new InMemoryNotesStore();
      // seed a few example notes
      this.mockStore.seed();
      // eslint-disable-next-line no-console
      console.info('[NotesApi] Using in-memory mock store. Set REACT_APP_API_BASE or REACT_APP_BACKEND_URL to use a real backend.');
    }
  }

  // PUBLIC_INTERFACE
  async listNotes() {
    /** Returns an array of {id, title, content, updatedAt} */
    if (this.useMock) return this.mockStore.list();
    const res = await fetch(`${this.baseUrl}/notes`, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`Failed to fetch notes: ${res.status}`);
    return res.json();
  }

  // PUBLIC_INTERFACE
  async getNote(id) {
    /** Returns a single note by id */
    if (this.useMock) return this.mockStore.get(id);
    const res = await fetch(`${this.baseUrl}/notes/${encodeURIComponent(id)}`, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`Failed to fetch note: ${res.status}`);
    return res.json();
  }

  // PUBLIC_INTERFACE
  async createNote(data) {
    /** Creates a note: data = {title, content} -> returns created note */
    if (this.useMock) return this.mockStore.create(data);
    const res = await fetch(`${this.baseUrl}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {}),
    });
    if (!res.ok) throw new Error(`Failed to create note: ${res.status}`);
    return res.json();
  }

  // PUBLIC_INTERFACE
  async updateNote(id, data) {
    /** Updates a note by id: data = {title?, content?} -> returns updated note */
    if (this.useMock) return this.mockStore.update(id, data);
    const res = await fetch(`${this.baseUrl}/notes/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {}),
    });
    if (!res.ok) throw new Error(`Failed to update note: ${res.status}`);
    return res.json();
  }

  // PUBLIC_INTERFACE
  async deleteNote(id) {
    /** Deletes a note by id and returns {success: true} or similar */
    if (this.useMock) return this.mockStore.delete(id);
    const res = await fetch(`${this.baseUrl}/notes/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete note: ${res.status}`);
    return res.json().catch(() => ({ success: true }));
  }
}

// Simple in-memory store used when no backend configured
class InMemoryNotesStore {
  constructor() {
    this.notes = [];
  }
  seed() {
    const now = new Date().toISOString();
    this.notes = [
      { id: '1', title: 'Welcome to Notes', content: 'This is a sample note. Start typing to edit!', updatedAt: now },
      { id: '2', title: 'Ocean Professional Theme', content: 'Blue and amber accents with subtle shadows and gradients.', updatedAt: now },
    ];
  }
  list() {
    return Promise.resolve(this.notes.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
  }
  get(id) {
    const note = this.notes.find(n => n.id === String(id));
    if (!note) return Promise.reject(new Error('Note not found'));
    return Promise.resolve({ ...note });
  }
  create(data) {
    const id = String(Date.now());
    const now = new Date().toISOString();
    const note = { id, title: data?.title || 'Untitled', content: data?.content || '', updatedAt: now };
    this.notes.unshift(note);
    return Promise.resolve({ ...note });
  }
  update(id, data) {
    const idx = this.notes.findIndex(n => n.id === String(id));
    if (idx === -1) return Promise.reject(new Error('Note not found'));
    const now = new Date().toISOString();
    const updated = { ...this.notes[idx], ...data, updatedAt: now };
    this.notes[idx] = updated;
    return Promise.resolve({ ...updated });
  }
  delete(id) {
    const idx = this.notes.findIndex(n => n.id === String(id));
    if (idx === -1) return Promise.reject(new Error('Note not found'));
    this.notes.splice(idx, 1);
    return Promise.resolve({ success: true });
  }
}
