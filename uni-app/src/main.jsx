import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './artifacts.css'

try {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
    console.log('[•UNI•] Sanctuary Manifested.');
} catch (err) {
    console.error('[•UNI•] Fatal Boot Error:', err);
    document.body.innerHTML = `
        <div style="padding:40px; color:white; background:#050508; font-family:sans-serif; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
            <h1 style="letter-spacing:0.2em;">BOOT ERROR</h1>
            <pre style="opacity:0.6; font-size:12px; max-width:100%; overflow:auto; margin:20px 0;">${err.stack || err.message}</pre>
            <button onclick="window.location.reload()" style="background:#fff; color:#000; border:none; padding:10px 20px; border-radius:20px; cursor:pointer;">Retry</button>
        </div>
    `;
}
