import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './artifacts.css'



// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('[•UNI•] PWA Ready:', reg.scope))
            .catch(err => console.log('[•UNI•] PWA Offline failed:', err));
    });
}

try {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    )
} catch (err) {
    console.error('[•UNI•] Fatal Boot Error:', err);
    document.body.innerHTML = `<div style="padding:40px; color:white; background:black; font-family:sans-serif;"><h1>Boot Error</h1><pre>${err.stack || err.message}</pre></div>`;
}

