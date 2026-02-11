// •UNI• Firebase Configuration
// Using the existing uni-mvp Firebase project

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDZz5e2lH2RLo-lmefZJPWW2PjyfhL4P6k",
    authDomain: "uni-mvp.firebaseapp.com",
    projectId: "uni-mvp",
    storageBucket: "uni-mvp.appspot.com",
    messagingSenderId: "573518415288",
    appId: "1:573518415288:web:866da30e4b84d480c07b4d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
