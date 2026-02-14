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

const hasConfig = firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_KEY_HERE';

if (hasConfig) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
    } catch (err) {
        console.error('[•UNI•] Firebase Services Failure:', err);
    }
} else {
    console.warn('[•UNI•] Firebase API Key missing. Sanctuary running in offline mode.');
}

export { auth, db, storage };

let analytics;
try {
    analytics = getAnalytics(app);
} catch (e) {
    console.warn('[•UNI•] Analytics inhibited:', e);
}
export { analytics };

export const googleProvider = new GoogleAuthProvider();
export default app;

