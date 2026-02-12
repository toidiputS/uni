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

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
