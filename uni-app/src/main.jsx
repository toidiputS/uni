import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootEl = document.getElementById('root');
if (rootEl) {
    rootEl.innerHTML = '<div style="color:white;text-align:center;padding-top:45vh;font-family:sans-serif;letter-spacing:0.2em;font-size:10px;opacity:0.6;">RESONATING AT 72BPM...</div>';
}

try {
    const root = ReactDOM.createRoot(rootEl);
    root.render(<App />);
    console.log('[•UNI•] Sanctuary Manifested.');
} catch (err) {
    console.error('[•UNI•] Boot Error:', err);
    if (rootEl) rootEl.innerHTML = `<div style="color:red;padding:20px;">BOOT FAILED: ${err.message}</div>`;
}
