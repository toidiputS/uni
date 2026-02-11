// •UNI• Auth Page
// Login + Sign Up + Guest Mode

import React, { useState } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInAnonymously,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function Auth({ onBack, onAuthed }) {
    const [mode, setMode] = useState('login'); // login | signup
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGuestLogin = async () => {
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
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

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
            // ... (error handling logic) ...
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="wordmark" style={{ cursor: 'pointer' }} onClick={onBack}>•UNI•</div>
            <p className="auth-subtitle">Your emotional canvas awaits</p>

            <div className="glass-card">
                <button
                    className="btn btn-primary"
                    onClick={handleGuestLogin}
                    disabled={loading}
                    style={{ width: '100%', marginBottom: 20, background: 'var(--uni-gradient)' }}
                >
                    {loading && mode === 'guest' ? <span className="spinner" /> : '🚀 Quick Entry (Guest)'}
                </button>

                <div className="divider" style={{ margin: '0 0 20px' }}><span>OR</span></div>

                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => { setMode('login'); setError(''); }}
                    >
                        Log In
                    </button>
                    <button
                        className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
                        onClick={() => { setMode('signup'); setError(''); }}
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
                        {loading && mode !== 'guest' ? <span className="spinner" /> : (mode === 'login' ? 'Enter' : 'Create')}
                    </button>
                </form>
            </div>
        </div>
    );
}
