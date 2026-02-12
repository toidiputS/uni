import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDZz5e2lH2RLo-lmefZJPWW2PjyfhL4P6k",
    authDomain: "uni-mvp.firebaseapp.com",
    projectId: "uni-mvp",
    storageBucket: "uni-mvp.firebasestorage.app",
    messagingSenderId: "573518415288",
    appId: "1:573518415288:web:866da30e4b84d480c07b4d",
    measurementId: "G-TSHBTZBS37"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

let analytics;
try {
    analytics = getAnalytics(app);
} catch (e) {
    console.warn('[•UNI•] Analytics inhibited:', e);
}
export { analytics };

export const googleProvider = new GoogleAuthProvider();
export default app;

