// •UNI• Partner Pairing Page
// Share your code → Enter partner's code → Create chat room

import React, { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import {
    doc, getDoc, setDoc, updateDoc, getDocs,
    query, where, collection, serverTimestamp, onSnapshot
} from 'firebase/firestore';

function roomIdFor(a, b) {
    return [a, b].sort((x, y) => x.localeCompare(y)).join('_');
}

export default function Pairing({ user, onPaired, onLogout, isPlaying, onToggleAudio, setBellConfig }) {
    const [myCode, setMyCode] = useState('------');
    const [partnerCode, setPartnerCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [resonance, setResonance] = useState(false);

    useEffect(() => {
        setBellConfig({
            state: resonance ? 'generating' : (loading ? 'thinking' : 'idle'),
            size: 64,
            sentiment: resonance ? 'love' : 'neutral',
            top: '25%',
            left: '50%'
        });
    }, [resonance, loading, setBellConfig]);

    // Initial setup: Get my code & listen for pair
    useEffect(() => {
        if (!user) return;

        // Load or generate pairing code
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

        // Listen for when we are paired AND both are ready
        const unsub = onSnapshot(doc(db, 'users', user.uid), (userSnap) => {
            if (userSnap.exists()) {
                const userData = userSnap.data();
                if (userData.pairedWith && userData.lastRoomId) {
                    // Check room readiness
                    const roomUnsub = onSnapshot(doc(db, 'chatRooms', userData.lastRoomId), (roomSnap) => {
                        if (roomSnap.exists()) {
                            const room = roomSnap.data();
                            const partnerId = userData.pairedWith;
                            if (room[`ready_${user.uid}`] && room[`ready_${partnerId}`]) {
                                setResonance(true);
                                setTimeout(() => onPaired(userData.lastRoomId), 3000);
                                roomUnsub(); // Stop listening to room
                            }
                        }
                    });
                }
            }
        });
        return unsub;
    }, [user, onPaired]);

    const copyCode = () => {
        navigator.clipboard?.writeText(myCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSharePWA = async () => {
        const shareData = {
            title: '•UNI•',
            text: 'Experience messaging as living art. Join me in the Sanctuary.',
            url: 'https://uni.itsai.chat'
        };

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share failed', err);
            }
        } else {
            navigator.clipboard?.writeText(shareData.url);
            alert('Link copied to clipboard');
        }
    };

    const handleInvitePartner = async () => {
        const shareData = {
            title: '•UNI• Invite',
            text: `Connect with me on •UNI•. My resonance code is: ${myCode}`,
            url: 'https://uni.itsai.chat'
        };

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Invite failed', err);
            }
        } else {
            navigator.clipboard?.writeText(`${shareData.text} — ${shareData.url}`);
            alert('Invite copied to clipboard');
        }
    };

    const handlePair = async (e) => {
        e.preventDefault();
        if (!partnerCode.trim() || partnerCode.length < 6) {
            setError('Enter your partner\'s code.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            // 1. Find the partner
            const q = query(
                collection(db, 'users'),
                where('code', '==', partnerCode.trim().toUpperCase())
            );
            const snap = await getDocs(q);

            if (snap.empty) {
                setError("Resonance not found. Check the code.");
                setLoading(false);
                return;
            }

            const partnerDoc = snap.docs[0];
            const partnerData = partnerDoc.data();
            const partnerId = partnerDoc.id;

            if (partnerId === user.uid) {
                setError("You cannot pair with yourself.");
                setLoading(false);
                return;
            }

            // 2. Create the room ID
            const roomId = roomIdFor(user.uid, partnerId);

            // 3. Update both users
            const myRef = doc(db, 'users', user.uid);
            const pRef = doc(db, 'users', partnerId);

            const roomData = {
                id: roomId,
                members: [user.uid, partnerId],
                memberNames: {
                    [user.uid]: user.displayName || 'You',
                    [partnerId]: partnerData.displayName || 'Partner'
                },
                createdAt: serverTimestamp(),
                isSanctified: false
            };

            // 4. Set the room & update users
            await setDoc(doc(db, 'chatRooms', roomId), {
                ...roomData,
                [`ready_${user.uid}`]: true
            }, { merge: true });

            await updateDoc(myRef, {
                pairedWith: partnerId,
                lastRoomId: roomId
            });

            await updateDoc(pRef, {
                pairedWith: user.uid,
                lastRoomId: roomId
            });

            // We don't transition here anymore. 
            // We let the listener below handle it when BOTH are ready.
            setLoading(false);
            setResonance(true);

        } catch (err) {
            console.error('[UNI] Pairing error:', err);
            setError('Connection failed. Try again.');
            setLoading(false);
        }
    };

    if (resonance) {
        return (
            <div className="pairing-resonance">
                <div className="resonance-ring" />
                <div className="resonance-content">
                    <div className="wordmark">•UNI•</div>
                    <p>Resonance Initialized</p>
                    <div className="resonance-status">
                        Waiting for partner to connect...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pairing-page">
            {/* Resonance Player Toggle */}
            <div className={`audio-toggle ${isPlaying ? 'playing' : ''}`} onClick={onToggleAudio}>
                <div className="resonance-dot" />
                <span>{isPlaying ? 'Resonance On' : 'Silent Mode'}</span>
            </div>

            <div className="wordmark" style={{ fontSize: 32 }}>•UNI•</div>
            <p style={{ color: 'var(--uni-text-dim)', fontSize: 14, marginTop: 8, marginBottom: 24 }}>
                Connect with your person
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
                            style={{ textAlign: 'center', letterSpacing: '0.2em', fontSize: 18, fontWeight: 600 }}
                        />
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', marginBottom: 12 }}
                    >
                        {loading ? <span className="spinner" /> : 'Connect Interface'}
                    </button>
                </form>

                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button
                        className="btn btn-glass btn-sm"
                        onClick={handleSharePWA}
                        style={{ flex: 1, fontSize: 10, letterSpacing: '0.1em' }}
                    >
                        Share PWA
                    </button>
                    <button
                        className="btn btn-glass btn-sm"
                        onClick={handleInvitePartner}
                        style={{ flex: 1, fontSize: 10, letterSpacing: '0.1em' }}
                    >
                        Invite Partner
                    </button>
                </div>
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
