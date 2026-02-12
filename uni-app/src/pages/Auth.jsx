// •UNI• Auth Page
// Login + Sign Up + Guest Mode

import React, { useState } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInAnonymously,
    signInWithPopup,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

export default function Auth({ onBack, onAuthed }) {
    const [mode, setMode] = useState('login'); // login | signup
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [primed, setPrimed] = useState(null); // 'google' | 'guest' | null

    const handleGoogleLogin = async () => {
        if (primed !== 'google') {
            setPrimed('google');
            setError('');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const cred = await signInWithPopup(auth, googleProvider);
            const user = cred.user;

            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                const code = user.uid.slice(-6).toUpperCase();
                await setDoc(doc(db, 'users', user.uid), {
                    displayName: user.displayName || 'You',
                    email: user.email,
                    photoURL: user.photoURL,
                    code,
                    pairedWith: null,
                    lastRoomId: null,
                    createdAt: serverTimestamp(),
                });
            }
            onAuthed();
        } catch (err) {
            console.error('[UNI] Google Auth Error:', err);
            setError('Google entry failed. Try Guest Mode?');
            setPrimed(null);
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        if (primed !== 'guest') {
            setPrimed('guest');
            setError('');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const cred = await signInAnonymously(auth);
            const uid = cred.user.uid;
            const name = `Guest ${uid.slice(-4)}`;
            await updateProfile(cred.user, { displayName: name });

            const code = uid.slice(-6).toUpperCase();
            await setDoc(doc(db, 'users', uid), {
                displayName: name,
                isGuest: true,
                code,
                pairedWith: null,
                lastRoomId: null,
                createdAt: serverTimestamp(),
            });
            onAuthed();
        } catch (err) {
            setError('Guest entry failed. Please try email.');
            setPrimed(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setPrimed(null);

        try {
            if (mode === 'signup') {
                const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
                const uid = cred.user.uid;
                const name = displayName.trim() || email.split('@')[0];
                await updateProfile(cred.user, { displayName: name });

                const code = uid.slice(-6).toUpperCase();
                await setDoc(doc(db, 'users', uid), {
                    displayName: name,
                    email: email.trim(),
                    code,
                    pairedWith: null,
                    lastRoomId: null,
                    createdAt: serverTimestamp(),
                });
            } else {
                await signInWithEmailAndPassword(auth, email.trim(), password);
            }
            onAuthed();
        } catch (err) {
            console.error('[UNI] Auth error:', err);
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already on the path. Try Logging In?');
            } else if (err.code === 'auth/weak-password') {
                setError('Make your password a bit stronger.');
            } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('The path is blocked. Check your credentials.');
            } else {
                setError('The gateway is hesitant. try again?');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="wordmark" style={{ cursor: 'pointer' }} onClick={onBack}>•UNI•</div>
            <p className="auth-subtitle">Your emotional canvas awaits</p>

            <div className="glass-card">
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        style={{
                            flex: 1,
                            background: primed === 'google' ? '#fff' : 'rgba(255,255,255,0.05)',
                            color: primed === 'google' ? '#000' : '#fff',
                            border: primed === 'google' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            transform: primed === 'google' ? 'scale(1.05)' : 'scale(1)'
                        }}
                    >
                        {loading && primed === 'google' ? <span className="spinner" /> : (primed === 'google' ? 'Confirm G·' : 'G·Google')}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleGuestLogin}
                        disabled={loading}
                        style={{
                            flex: 1,
                            background: primed === 'guest' ? 'var(--uni-gradient)' : 'rgba(255,255,255,0.05)',
                            border: primed === 'guest' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            transform: primed === 'guest' ? 'scale(1.05)' : 'scale(1)'
                        }}
                    >
                        {loading && primed === 'guest' ? <span className="spinner" /> : (primed === 'guest' ? 'Confirm 🚀' : '🚀 Guest')}
                    </button>
                </div>

                <p style={{
                    fontSize: '10px',
                    textAlign: 'center',
                    color: 'var(--uni-chrome)',
                    marginBottom: 20,
                    opacity: primed ? 1 : 0,
                    transition: 'opacity 0.3s'
                }}>
                    Tap again to enter the interface
                </p>

                <div className="divider" style={{ margin: '0 0 20px' }}><span>OR USE EMAIL</span></div>

                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => { setMode('login'); setError(''); setPrimed(null); }}
                    >
                        Log In
                    </button>
                    <button
                        className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
                        onClick={() => { setMode('signup'); setError(''); setPrimed(null); }}
                    >
                        Sign Up
                    </button>
                </div>

                {error && <p className="error-msg">{error}</p>}

                <form onSubmit={handleSubmit}>
                    {mode === 'signup' && (
                        <div className="input-group">
                            <input
                                className="input"
                                type="text"
                                placeholder="Display Name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <input
                            className="input"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            className="input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        className="btn btn-glass"
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', marginTop: 8 }}
                    >
                        {loading && !primed ? <span className="spinner" /> : (mode === 'login' ? 'Enter' : 'Create')}
                    </button>
                </form>
            </div>
        </div>

    );
}
