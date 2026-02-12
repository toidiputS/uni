// •UNI• Chat Page
// The heart of CGEI — realtime messaging with emotion-reactive atmosphere
// The canvas IS the product. Bell is the voice, not the soul.

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { db } from '../lib/firebase';
import {
    collection, query, orderBy, onSnapshot, addDoc,
    serverTimestamp, doc, limit,
} from 'firebase/firestore';
import ArtifactFrame from '../components/ArtifactFrame';
import PricingOverlay from '../components/PricingOverlay';
import MemoryCard from '../components/MemoryCard';
import BellDot from '../components/BellDot';
import AtmosphereCanvas from '../components/AtmosphereCanvas';
import ResonancePlayer from '../components/ResonancePlayer';
import FeedbackModal from '../components/FeedbackModal';

import { analyzeMessage, composeSoulSong } from '../lib/gemini';
import { getDocs, updateDoc } from 'firebase/firestore';
import { redirectToCheckout } from '../lib/stripe';

// Bubble effect → particle type mapping
const BUBBLE_PARTICLE_MAP = {
    heartbeat: 'heart',
    glow: 'spark',
    pulse: 'spark',
    shake: 'spark',
    float: 'drop',
    ripple: 'spark',
    breathe: null, // no particles for subtle breathe
};

export default function Chat({ user, userData, roomId, onMoodChange, bubbleEmit, onBubbleEmit, onSceneChange, onUnpair, onLogout, isPlaying, onToggleAudio, playSong, currentSongTitle }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [roomData, setRoomData] = useState(null);
    const [mood, setMood] = useState('neutral');
    const [intensity, setIntensity] = useState(0.5);
    const [showMemory, setShowMemory] = useState(false);
    const [showArtifact, setShowArtifact] = useState(false);
    const [showPricing, setShowPricing] = useState(false);
    const [showMusic, setShowMusic] = useState(false);
    const [showSurvey, setShowSurvey] = useState(false);
    const [hasDiscount, setHasDiscount] = useState(false);
    const [soulSong, setSoulSong] = useState(null);
    const [toast, setToast] = useState('');
    const [bellState, setBellState] = useState('idle');

    const handleFeedbackSubmit = async (data) => {
        if (!user || !roomId) return;
        try {
            await addDoc(collection(db, 'feedback'), {
                uid: user.uid,
                email: user.email,
                roomId,
                ...data,
                createdAt: serverTimestamp()
            });
            setHasDiscount(true);
            setShowSurvey(false);
            showToast("Discount Unlocked! Check Pricing ✨");
        } catch (err) {
            console.error('[UNI] Feedback error:', err);
            showToast("The archive is full. Try later.");
        }
    };


    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    // Handle return from Stripe
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get('session_id');
        if (sessionId && user) {
            const userRef = doc(db, 'users', user.uid);
            updateDoc(userRef, {
                isSubscriber: true,
                subscriptionType: 'founder',
                lastPaymentAt: serverTimestamp()
            }).then(() => {
                showToast("Your Sanctuary is Sanctified ✨");
                window.history.replaceState({}, document.title, "/");
            });
        }
    }, [user]);

    const handleSponsor = async (type, amount) => {
        if (!user) return;
        setBellState('thinking');
        showToast("Preparing the Gateway...");
        try {
            // amount can be used here if stripe helper supports it
            await redirectToCheckout(type, user.email);
        } catch (err) {
            console.error('[UNI] Stripe Redirect failed:', err);
            showToast("The Gateway is closed. Try later.");
        } finally {
            setBellState('idle');
        }
    };


    const handleWeave = async () => {
        if (!roomId || sending) return;
        setSending(true);
        setBellState('thinking');
        showToast("Bell is reading the room's history...");
        try {
            const memoriesRef = collection(db, 'chatRooms', roomId, 'memories');
            const q = query(memoriesRef, orderBy('createdAt', 'desc'), limit(15));
            const snap = await getDocs(q);

            if (snap.empty) {
                showToast("Archive some memories first ✦");
                setBellState('idle');
                return;
            }

            const memories = snap.docs.map(d => d.data());
            const song = await composeSoulSong(memories);
            setSoulSong(song);
            setShowArtifact(true);
            setBellState('glow');
        } catch (err) {
            console.error('[UNI] Weave error:', err);
            showToast("The resonance is faint. Try later.");
        } finally {
            setSending(false);
        }
    };

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const typingTimer = useRef(null);
    const lastMsgCount = useRef(0);

    const bellActive = bellState !== 'idle';

    const partnerName = useMemo(() => {
        if (!roomData?.memberNames || !user) return 'Partner';
        const entries = Object.entries(roomData.memberNames);
        const partner = entries.find(([uid]) => uid !== user.uid);
        return partner ? partner[1] : 'Partner';
    }, [roomData, user]);

    useEffect(() => {
        if (!roomId) return;
        const unsub = onSnapshot(doc(db, 'chatRooms', roomId), (snap) => {
            if (snap.exists()) setRoomData(snap.data());
        });
        return unsub;
    }, [roomId]);

    const [partnerPresent, setPartnerPresent] = useState(false);

    useEffect(() => {
        if (!roomId || !user) return;
        const q = query(collection(db, 'chatRooms', roomId, 'presence'), orderBy('timestamp', 'desc'), limit(1));
        const unsubPresence = onSnapshot(q, (snap) => {
            if (!snap.empty) {
                const presence = snap.docs[0].data();
                if (presence.uid !== user.uid) {
                    if (presence.isTyping) {
                        setBellState('listening');
                        clearTimeout(typingTimer.current);
                        typingTimer.current = setTimeout(() => setBellState('idle'), 3000);
                    }
                    const lastActive = presence.timestamp?.toMillis() || 0;
                    const now = Date.now();
                    const isRecent = (now - lastActive) < 15000;
                    setPartnerPresent(isRecent);
                }
            }
        });
        const presenceInterval = setInterval(() => { updateTypingStatus(false); }, 10000);
        return () => { unsubPresence(); clearInterval(presenceInterval); };
    }, [roomId, user]);

    useEffect(() => {
        if (!roomId) return;
        const messagesRef = collection(db, 'chatRooms', roomId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'), limit(200));
        const unsub = onSnapshot(q, (snap) => {
            const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setMessages(msgs);
            const lastUserMsg = [...msgs].reverse().find(m => !m.isUni && m.sentiment);
            if (lastUserMsg) {
                setMood(lastUserMsg.sentiment);
                onMoodChange?.({ mood: lastUserMsg.sentiment, intensity: lastUserMsg.intensity || 0.5, sceneColors: lastUserMsg.sceneColors });
            }
            if (msgs.length > lastMsgCount.current && lastMsgCount.current > 0) {
                const newMsg = msgs[msgs.length - 1];
                if (newMsg && !newMsg.isUni && newMsg.bubbleEffect) {
                    const particleType = BUBBLE_PARTICLE_MAP[newMsg.bubbleEffect];
                    if (particleType) {
                        const isMe = newMsg.sender === user?.uid;
                        const x = isMe ? window.innerWidth * 0.75 : window.innerWidth * 0.25;
                        const y = window.innerHeight * 0.7;
                        onBubbleEmit?.({ type: particleType, x, y, count: 8 });
                    }
                }
            }
            lastMsgCount.current = msgs.length;
        });
        return () => unsub();
    }, [roomId, onMoodChange, onBubbleEmit, user]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    useEffect(() => {
        const app = document.querySelector('.app');
        if (!app) return;
        if (bellActive) app.classList.add('bell-active');
        else app.classList.remove('bell-active');
    }, [bellActive]);

    const handleTextChange = (e) => {
        const val = e.target.value;
        setText(val);
        if (val.trim()) {
            setBellState('listening');
            updateTypingStatus(true);
            clearTimeout(typingTimer.current);
            typingTimer.current = setTimeout(() => { setBellState('idle'); updateTypingStatus(false); }, 2500);
        } else {
            setBellState('idle');
            updateTypingStatus(false);
        }
    };

    const [drawEmit, setDrawEmit] = useState(null);
    const handleDraw = async (point) => {
        if (!roomId || !user) return;
        try { await addDoc(collection(db, 'chatRooms', roomId, 'drawing'), { uid: user.uid, x: point.x, y: point.y, timestamp: serverTimestamp() }); } catch (err) { }
    };

    useEffect(() => {
        if (!roomId || !user) return;
        const q = query(collection(db, 'chatRooms', roomId, 'drawing'), orderBy('timestamp', 'desc'), limit(1));
        const unsubDrawing = onSnapshot(q, (snap) => {
            if (!snap.empty) {
                const drawData = snap.docs[0].data();
                if (drawData.uid !== user.uid) setDrawEmit({ x: drawData.x, y: drawData.y });
            }
        });
        return () => unsubDrawing();
    }, [roomId, user]);

    const updateTypingStatus = async (isTyping) => {
        if (!roomId || !user) return;
        try { await addDoc(collection(db, 'chatRooms', roomId, 'presence'), { uid: user.uid, isTyping, timestamp: serverTimestamp() }); } catch (err) { }
    };

    const sendMessage = useCallback(async () => {
        const trimmed = text.trim();
        if (!trimmed || sending || !roomId || !user) return;
        setSending(true); setText(''); setBellState('thinking');
        try {
            const messagesRef = collection(db, 'chatRooms', roomId, 'messages');
            const recentContext = messages.slice(-8).map(m => ({ text: m.text, senderName: m.senderName || 'User', isUni: m.isUni || false }));
            const analysis = await analyzeMessage(trimmed, recentContext);
            await addDoc(messagesRef, { text: trimmed, sender: user.uid, senderName: user.displayName || 'You', sentiment: analysis.sentiment, intensity: analysis.intensity, bubbleEffect: analysis.bubbleEffect, sceneColors: analysis.sceneColors, isUni: false, createdAt: serverTimestamp() });
            if (analysis.shouldRespond && analysis.quip) {
                setBellState('generating');
                setTimeout(async () => {
                    try { await addDoc(messagesRef, { text: analysis.quip, sender: 'Bell', senderName: 'Bell', sentiment: analysis.sentiment, isUni: true, createdAt: serverTimestamp() }); } catch (err) { }
                    setBellState('idle');
                }, 800);
            } else setBellState('idle');
        } catch (err) {
            console.error('[Bell] Send error:', err); setText(trimmed); showToast('Failed to send. Try again.'); setBellState('idle');
        } finally { setSending(false); inputRef.current?.focus(); }
    }, [text, sending, roomId, user, messages]);

    const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
    const handleMemoryToast = (msg) => { setBellState('glow'); showToast(msg); setTimeout(() => setBellState('idle'), 2000); };
    const formatTime = (timestamp) => { if (!timestamp?.toDate) return ''; const d = timestamp.toDate(); return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); };

    return (
        <div className="chat-page">
            <div className="chat-header">
                <div className="chat-header-left">
                    <button className="chat-back" onClick={onUnpair} title="Back">←</button>
                    <span className="chat-partner-name">{partnerName}</span>
                </div>
                <div className="bell-dot-center"><BellDot state={bellState} size={10} /></div>
                <div className="chat-header-actions">
                    <button
                        className="btn btn-glass btn-sm"
                        onClick={() => setShowSurvey(true)}
                        title="Share your thoughts"
                        style={{ color: hasDiscount ? 'var(--emo-happy)' : 'inherit' }}
                    >
                        ★
                    </button>
                    <button className={`btn btn-glass btn-sm ${isPlaying ? 'resonance-active-btn' : ''}`} onClick={() => setShowMusic(true)} title="Shared Resonance">♫</button>

                    <button className="btn btn-glass btn-sm" onClick={handleWeave} title="Weave Soul Song" disabled={sending}>⟢</button>
                    {!roomData?.isSanctified && (
                        <button className="btn btn-glass btn-sm" onClick={() => setShowPricing(true)} title="Sanctify the Room" style={{ color: 'var(--emo-happy)' }}>🕯️</button>
                    )}
                    <button className="btn btn-glass btn-sm" onClick={() => setShowMemory(true)} title="Save this moment">✦</button>
                    <button className="btn btn-glass btn-icon" onClick={onLogout} title="Sign out" style={{ fontSize: 14 }}>⚙</button>
                </div>
            </div>
            <div className="messages-container">
                {messages.length === 0 ? (
                    <div className="empty-chat"><BellDot state="idle" size={16} /><p style={{ marginTop: 16, color: 'var(--uni-chrome)' }}>Your canvas is ready.</p></div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender === user?.uid;
                        const isUni = msg.isUni;
                        return (
                            <div key={msg.id} className={`msg-row ${isUni ? 'uni-msg' : isMe ? 'sent' : 'received'}`}>
                                <div><div className={`bubble ${isUni ? 'uni' : isMe ? 'sent' : 'received'}`} data-sentiment={msg.sentiment || 'neutral'} data-effect={msg.bubbleEffect || 'breathe'}>{msg.text}</div>{!isUni && <div className="msg-time">{formatTime(msg.createdAt)}</div>}</div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-bar">
                <input ref={inputRef} className="input" type="text" placeholder="Say something…" value={text} onChange={handleTextChange} onKeyDown={handleKeyDown} disabled={sending} autoFocus />
                <button className="send-btn" onClick={sendMessage} disabled={!text.trim() || sending} title="Send">{sending ? '·' : '↑'}</button>
            </div>
            <div className={`presence-pulse ${partnerPresent ? 'active' : ''}`} />
            <AtmosphereCanvas mood={mood} intensity={intensity} bubbleEmit={bubbleEmit} drawEmit={drawEmit} onDraw={handleDraw} />
            {showMemory && <MemoryCard roomId={roomId} messages={messages} mood={mood} partnerName={partnerName} userName={user?.displayName || 'You'} onClose={() => setShowMemory(false)} onToast={handleMemoryToast} />}
            {showArtifact && soulSong && <ArtifactFrame title={soulSong.title} lyrics={soulSong.lyrics} date={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} participants={[user?.displayName || 'You', partnerName]} onClose={() => setShowArtifact(false)} />}
            {showPricing && (
                <PricingOverlay
                    onClose={() => setShowPricing(false)}
                    onSponsor={handleSponsor}
                    hasDiscount={hasDiscount}
                    onOpenSurvey={() => { setShowPricing(false); setShowSurvey(true); }}
                />
            )}
            {showSurvey && (
                <FeedbackModal
                    onClose={() => setShowSurvey(false)}
                    onSubmit={handleFeedbackSubmit}
                />
            )}
            {showMusic && <ResonancePlayer roomId={roomId} user={user} onPlay={playSong} onClose={() => setShowMusic(false)} currentTitle={currentSongTitle} isPlaying={isPlaying} onToggle={onToggleAudio} />}

            {toast && <div className="toast">{toast}</div>}
            <div className="cgei-watermark">{roomData?.isSanctified ? 'FOUNDER PROTOCOL v4 • ETERNAL RESONANCE' : 'CGEI PROTOCOL v4 • AUTHENTIC RESONANCE'}</div>
        </div>
    );
}
