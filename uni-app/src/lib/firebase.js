import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app = null;
let auth = null;
let db = null;
let storage = null;
let googleProvider = null;

// Debugging block — will help us confirm if Vite is seeing the .env
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
if (!apiKey) {
    console.warn('[•UNI•] VITE_FIREBASE_API_KEY is missing in the current build environment.');
} else {
    console.log(`[•UNI•] Firebase key detected: ${apiKey.slice(0, 4)}...`);
}

if (apiKey) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
        googleProvider = new GoogleAuthProvider();
    } catch (err) {
        console.error('[•UNI•] Firebase Init Error:', err);
    }
}

export { auth, db, storage, googleProvider };

let analytics = null;
try {
    if (app) analytics = getAnalytics(app);
} catch (e) {
    console.warn('[•UNI•] Analytics inhibited:', e);
}
export { analytics };

export default app;

