// •UNI• Partner Pairing Page
// Share your code → Enter partner's code → Create chat room

import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import {
    doc, getDoc, setDoc, updateDoc, getDocs,
    query, where, collection, serverTimestamp,
} from 'firebase/firestore';

function roomIdFor(a, b) {
    return [a, b].sort((x, y) => x.localeCompare(y)).join('_');
}

export default function Pairing({ user, onPaired, onLogout }) {
    const [myCode, setMyCode] = useState('------');
    const [partnerCode, setPartnerCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [resonance, setResonance] = useState(false);

    // Load or generate pairing code
    useEffect(() => {
        if (!user) return;
        (async () => {
            const userRef = doc(db, 'users', user.uid);
            const snap = await getDoc(userRef);
            if (snap.exists() && snap.data().code) {
                setMyCode(snap.data().code);
            } else {
                const code = user.uid.slice(-6).toUpperCase();
                await setDoc(userRef, {
                    code,
                    displayName: user.displayName || user.email?.split('@')[0] || 'User',
                    pairedWith: null,
                    lastRoomId: null,
                    createdAt: serverTimestamp(),
                }, { merge: true });
                setMyCode(code);
            }
        })();
    }, [user]);

    // Watch for resonance (both ready)
    useEffect(() => {
        if (!user || !isWaiting) return;

        // Potential room ID if we have partner code
        const code = partnerCode.trim().toUpperCase();
        if (code.length < 3) return;

        let unsub = () => { };

        // Find partner to get their UID for the room listener
        (async () => {
            const q = query(collection(db, 'users'), where('code', '==', code));
            const snap = await getDocs(q);
            if (snap.empty) return;

            const partnerUid = snap.docs[0].id;
            const roomId = roomIdFor(user.uid, partnerUid);

            unsub = onSnapshot(doc(db, 'chatRooms', roomId), (room) => {
                if (room.exists()) {
                    const ready = room.data().ready || {};
                    if (ready[user.uid] && ready[partnerUid]) {
                        // RESONANCE ACHIEVED
                        setResonance(true);
                        setTimeout(() => {
                            onPaired(roomId);
                        }, 2500); // 2.5s for the "explosion" animation
                    }
                }
            });
        })();

        return () => unsub();
    }, [user, isWaiting, partnerCode, onPaired]);

    const copyCode = () => {
        navigator.clipboard?.writeText(myCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePair = async (e) => {
        e?.preventDefault();
        const code = partnerCode.trim().toUpperCase();
        if (!user || code.length < 3) {
            setError('Enter your partner\'s code.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const q = query(collection(db, 'users'), where('code', '==', code));
            const results = await getDocs(q);

            if (results.empty) {
                setError('No user found with that code.');
                setLoading(false);
                return;
            }

            const partnerUid = results.docs[0].id;
            const partnerData = results.docs[0].data();

            if (partnerUid === user.uid) {
                setError('Ask your partner for their code.');
                setLoading(false);
                return;
            }

            const roomId = roomIdFor(user.uid, partnerUid);
            const roomRef = doc(db, 'chatRooms', roomId);

            // Mark MYSELF as ready in this room
            await setDoc(roomRef, {
                members: [user.uid, partnerUid],
                memberNames: {
                    [user.uid]: user.displayName || 'You',
                    [partnerUid]: partnerData?.displayName || 'Partner',
                },
                ready: {
                    [user.uid]: true
                }
            }, { merge: true });

            const myRef = doc(db, 'users', user.uid);
            await updateDoc(myRef, { lastRoomId: roomId });

            setIsWaiting(true);
            setLoading(false);
        } catch (err) {
            console.error('[UNI] Pairing error:', err);
            setError('Connection failed. Try again.');
            setLoading(false);
        }
    };

    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(() => { });
            setIsPlaying(true);
        }
    };

    if (resonance) {
        return (
            <div className="pairing-page resonance-active">
                <audio autoPlay src="/wishes_in_the_wind.mp3" />
                <div className="resonance-spark" />
                <h1 className="resonance-text">BECOMING •UNI•</h1>
                <p className="resonance-subtext">Opening the heavens...</p>
            </div>
        );
    }

    return (
        <div className="pairing-page">
            <audio ref={audioRef} src="/wishes_in_the_wind.mp3" loop />

            {/* Resonance Player Toggle */}
            <div className={`audio-toggle ${isPlaying ? 'playing' : ''}`} onClick={toggleAudio}>
                <div className="resonance-dot" />
                <span>{isPlaying ? 'Resonance On' : 'Silent Mode'}</span>
            </div>

            <div className="wordmark" style={{ fontSize: 32 }}>•UNI•</div>
            <p style={{ color: 'var(--uni-text-dim)', fontSize: 14, marginTop: 8, marginBottom: 24 }}>
                {isWaiting ? 'Waiting for your person to resonate...' : 'Connect with your person'}
            </p>

            <div className="glass-card" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: 'var(--uni-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                    Your Code
                </p>
                <div className="my-code" onClick={copyCode} style={{ cursor: 'pointer' }} title="Click to copy">
                    {myCode}
                </div>
                <p className="code-hint">
                    {copied ? '✓ Copied!' : 'Tap to copy & send to them'}
                </p>

                <div className="divider"><span>then</span></div>

                <form onSubmit={handlePair}>
                    <div className="input-group" style={{ textAlign: 'left' }}>
                        <label>Partner's Code</label>
                        <input
                            className="input"
                            type="text"
                            placeholder="A1B2C3"
                            value={partnerCode}
                            onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                            maxLength={6}
                            disabled={isWaiting}
                            style={{ textAlign: 'center', letterSpacing: '0.2em', fontSize: 18, fontWeight: 600 }}
                        />
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button
                        className={`btn ${isWaiting ? 'btn-glass disabled' : 'btn-primary'}`}
                        type="submit"
                        disabled={loading || isWaiting}
                        style={{ width: '100%' }}
                    >
                        {loading ? <span className="spinner" /> : (isWaiting ? 'Sent. Waiting...' : 'Connect Interface')}
                    </button>
                </form>
            </div>

            <button
                className="btn btn-glass btn-sm"
                onClick={onLogout}
                style={{ marginTop: 20 }}
            >
                Sign Out
            </button>
        </div>
    );
}
