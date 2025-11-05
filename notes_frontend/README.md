# Ocean Notes - Frontend

A modern, lightweight React notes app implementing the Ocean Professional theme (blue and amber accents) with support for listing, creating, editing, and deleting notes.

## Features
- Sidebar list of notes with search and selection
- Main editor panel with title and content
- Add Note button, save on blur, and Delete
- Responsive layout (sidebar collapses on small screens)
- API abstraction that uses:
  - Real backend when `REACT_APP_API_BASE` or `REACT_APP_BACKEND_URL` is set
  - Graceful in-memory mock store when no backend is configured

## Environment Variables
- `REACT_APP_API_BASE` or `REACT_APP_BACKEND_URL` (one of these): Base URL of backend (e.g., `http://localhost:8000`).
  - If neither is provided, the app uses an in-memory mock for notes.

Other variables supported by the environment (not required by this app):  
`REACT_APP_FRONTEND_URL, REACT_APP_WS_URL, REACT_APP_NODE_ENV, REACT_APP_NEXT_TELEMETRY_DISABLED, REACT_APP_ENABLE_SOURCE_MAPS, REACT_APP_PORT, REACT_APP_TRUST_PROXY, REACT_APP_LOG_LEVEL, REACT_APP_HEALTHCHECK_PATH, REACT_APP_FEATURE_FLAGS, REACT_APP_EXPERIMENTS_ENABLED`

## Development

Install dependencies and start the app:
```bash
npm install
npm start
```

Open http://localhost:3000

## Backend API Contract (expected)
- GET    /notes           -> [{ id, title, content, updatedAt }]
- POST   /notes           -> { id, title, content, updatedAt }
- GET    /notes/:id       -> { id, title, content, updatedAt }
- PUT    /notes/:id       -> { id, title, content, updatedAt }
- DELETE /notes/:id       -> { success: true }

If your backend differs, adjust `src/services/api.js` accordingly.

## Structure
- `src/services/api.js` - API abstraction with in-memory fallback
- `src/context/NotesContext.js` - Global state and actions
- `src/components/Sidebar.js` - Notes list and Add button
- `src/components/Editor.js` - Editor for selected note
- `src/components/Header.js` - Top bar with branding and connection status
- `src/styles/ocean.css` - Ocean Professional theme styles

## License
MIT
