import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const rootEl = document.getElementById('root');
if (rootEl) {
    rootEl.innerHTML = '<div style="color:white;text-align:center;padding-top:45vh;font-family:sans-serif;letter-spacing:0.2em;font-size:10px;opacity:0.6;">RESONATING AT 72BPM...</div>';
}

try {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
        <>
            <App />
            <Analytics />
            <SpeedInsights />
        </>
    );
    console.log('[•UNI•] Sanctuary Manifested. Build: 02.14.0011');
} catch (err) {
    console.error('[•UNI•] Boot Error:', err);
    if (rootEl) rootEl.innerHTML = `<div style="color:red;padding:20px;">BOOT FAILED: ${err.message}</div>`;
}
