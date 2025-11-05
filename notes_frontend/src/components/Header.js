import React from 'react';

// PUBLIC_INTERFACE
export default function Header() {
  /** Top header with brand and environment hint */
  const api = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
  const envHint = api ? 'Connected' : 'Offline (Mock)';

  return (
    <header className="header">
      <div className="brand">
        <div className="brand-logo" aria-hidden="true" />
        <div className="brand-title">Ocean Notes</div>
      </div>
      <div className="helper">
        API: {envHint}
      </div>
    </header>
  );
}
