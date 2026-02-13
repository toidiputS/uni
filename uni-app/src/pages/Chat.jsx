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
import { AD_SCENES, simulateTyping } from '../lib/director';

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

export default function Chat({
    user,
    userData,
    roomId,
    onMoodChange,
    onBubbleEmit,
    onSceneChange,
    onUnpair,
    onLogout,
    isPlaying,
    onToggleAudio,
    playSong,
    currentSongTitle,
    setBellConfig,
    setDrawEmit,
    setBellPos,
    setBubblePositions
}) {
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
    const bellRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [isDirector, setIsDirector] = useState(false);
    const [entropy, setEntropy] = useState(0); // 0 (Peace) to 1 (Dissolution)
    const [clarity, setClarity] = useState(1); // 1 (Clear) to 0 (Blur)

    // Track Bell's position for gravity calculations in global canvas
    useEffect(() => {
        const updateBellPos = () => {
            if (bellRef.current) {
                const rect = bellRef.current.getBoundingClientRect();
                setBellPos({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                });
            }
        };
        updateBellPos();
        window.addEventListener('resize', updateBellPos);
        return () => window.removeEventListener('resize', updateBellPos);
    }, [setBellPos]);

    // Track bubble positions for "morphing" energy effects in global canvas
    useEffect(() => {
        const updateBubblePositions = () => {
            if (messagesContainerRef.current) {
                const bubbles = messagesContainerRef.current.querySelectorAll('.bubble');
                const positions = Array.from(bubbles).map(b => {
                    const rect = b.getBoundingClientRect();
                    return {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                        width: rect.width,
                        height: rect.height,
                        sentiment: b.getAttribute('data-sentiment') || 'neutral'
                    };
                });
                setBubblePositions(positions);
            }
        };

        // Update when messages change or scroll
        updateBubblePositions();
        const container = messagesContainerRef.current;
        if (container) {
            container.addEventListener('scroll', updateBubblePositions);
        }

        const timer = setTimeout(updateBubblePositions, 500); // Wait for animations
        return () => {
            if (container) container.removeEventListener('scroll', updateBubblePositions);
            clearTimeout(timer);
        };
    }, [messages, setBubblePositions]);

    // Sync Global Bell config
    useEffect(() => {
        setBellConfig({
            state: bellState,
            size: 64,
            sentiment: mood,
            top: '84vh',
            left: '88vw'
        });
    }, [bellState, mood, setBellConfig]);

    const isMyTurn = useMemo(() => {
        if (!roomData?.turn) return true; // Free chat if unset
        return roomData.turn === user?.uid;
    }, [roomData, user]);

    // Behavioral Entropy logic
    useEffect(() => {
        let lastScroll = Date.now();
        const onScroll = () => {
            const now = Date.now();
            const delta = now - lastScroll;
            if (delta < 50) setEntropy(prev => Math.min(1, prev + 0.05));
            lastScroll = now;
        };
        const onSelection = () => setEntropy(prev => Math.min(0.8, prev + 0.1));
        const interval = setInterval(() => setEntropy(prev => Math.max(0, prev - 0.005)), 100);

        window.addEventListener('scroll', onScroll, true);
        document.addEventListener('selectionchange', onSelection);
        return () => {
            clearInterval(interval);
            window.removeEventListener('scroll', onScroll, true);
            document.removeEventListener('selectionchange', onSelection);
        };
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--moral-entropy', entropy);
        const targetClarity = entropy > 0.3 ? 0 : 1;
        setClarity(prev => prev + (targetClarity - prev) * 0.1);
        root.style.setProperty('--atmosphere-clarity', clarity);
    }, [entropy, clarity]);

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
            showToast("Discount Unlocked! ✨");
        } catch (err) { }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleSponsor = async (type) => {
        if (!user) return;
        setBellState('thinking');
        showToast("Preparing the Gateway...");
        try {
            await redirectToCheckout(type, user.email, hasDiscount);
        } catch (err) {
            showToast(err.message || "Gateway closed.");
        } finally {
            setBellState('idle');
        }
    };

    // Firebase Sync: Messages & Room Data
    useEffect(() => {
        if (!roomId) return;
        const unsub = onSnapshot(doc(db, 'chatRooms', roomId), (snap) => {
            if (snap.exists()) setRoomData(snap.data());
        });
        return unsub;
    }, [roomId]);

    useEffect(() => {
        if (!roomId) return;
        const q = query(collection(db, 'chatRooms', roomId, 'messages'), orderBy('createdAt', 'asc'), limit(200));
        const unsub = onSnapshot(q, (snap) => {
            const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setMessages(msgs);
            const lastUserMsg = [...msgs].reverse().find(m => !m.isUni && m.sentiment);
            if (lastUserMsg) {
                setMood(lastUserMsg.sentiment);
                onMoodChange({ mood: lastUserMsg.sentiment, intensity: lastUserMsg.intensity || 0.5, sceneColors: lastUserMsg.sceneColors });
            }
        });
        return unsub;
    }, [roomId, onMoodChange]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleTextChange = (e) => {
        const val = e.target.value;
        setText(val);
        if (val.trim()) {
            setBellState('listening');
            if (typingTimer.current) clearTimeout(typingTimer.current);
            typingTimer.current = setTimeout(() => setBellState('idle'), 2500);
        } else setBellState('idle');
    };

    const sendMessage = useCallback(async () => {
        const trimmed = text.trim();
        if (!trimmed || sending || !roomId || !user || !isMyTurn) return;
        setSending(true); setText(''); setBellState('thinking');
        try {
            const context = messages.slice(-8).map(m => ({ text: m.text, senderName: m.senderName, isUni: m.isUni }));
            const analysis = await analyzeMessage(trimmed, context);
            await addDoc(collection(db, 'chatRooms', roomId, 'messages'), {
                text: trimmed,
                sender: user.uid,
                senderName: user.displayName || 'You',
                sentiment: analysis.sentiment,
                intensity: analysis.intensity,
                bubbleEffect: analysis.bubbleEffect,
                sceneColors: analysis.sceneColors,
                isUni: false,
                createdAt: serverTimestamp()
            });

            // EMOJI INTEGRATION: Trigger particles for detected emojis
            const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
            const emojis = trimmed.match(emojiRegex);
            if (emojis && emojis.length > 0) {
                // Focus on the first 3 emojis to avoid overcrowding
                emojis.slice(0, 3).forEach((emoji, i) => {
                    setTimeout(() => {
                        onBubbleEmit({
                            type: 'emoji',
                            emoji: emoji,
                            x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                            y: window.innerHeight - 100,
                            count: 5
                        });
                    }, i * 200);
                });
            }

            if (analysis.shouldRespond && analysis.quip) {
                setBellState('generating');
                setTimeout(() => {
                    addDoc(collection(db, 'chatRooms', roomId, 'messages'), {
                        text: analysis.quip,
                        sender: 'Bell',
                        senderName: 'Bell',
                        sentiment: analysis.sentiment,
                        isUni: true,
                        createdAt: serverTimestamp()
                    });
                    setBellState('idle');

                    // If Bell responds with emojis, trigger those too
                    const bellEmojis = analysis.quip.match(emojiRegex);
                    if (bellEmojis) {
                        bellEmojis.slice(0, 3).forEach((emoji, i) => {
                            setTimeout(() => {
                                onBubbleEmit({
                                    type: 'emoji',
                                    emoji: emoji,
                                    x: window.innerWidth / 2,
                                    y: 100, // From Bell's area
                                    count: 5
                                });
                            }, i * 200);
                        });
                    }
                }, 800);
            } else {
                setBellState('idle');
            }

            // TURN TAKING: Switch turn to partner
            const partnerUid = roomData?.members?.find(m => m !== user.uid);
            if (partnerUid) {
                await updateDoc(doc(db, 'chatRooms', roomId), { turn: partnerUid });
            }

        } catch (err) {
            console.error('[UNI] Send Error:', err);
            setText(trimmed);
            showToast('The resonance failed.');
            setBellState('idle');
        } finally {
            setSending(false);
        }
    }, [text, sending, roomId, user, messages, isMyTurn, roomData, onBubbleEmit]);

    const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

    const partnerName = useMemo(() => {
        if (!roomData?.memberNames || !user) return 'Partner';
        const p = Object.entries(roomData.memberNames).find(([uid]) => uid !== user.uid);
        return p ? p[1] : 'Partner';
    }, [roomData, user]);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const typingTimer = useRef(null);

    return (
        <div className="chat-page">
            <div className="chat-header">
                <div className="chat-header-left">
                    <button className="chat-back" onClick={onUnpair}>←</button>
                    <span className="chat-partner-name">{partnerName}</span>
                </div>
                {!isDirector && (
                    <div className="chat-header-actions">
                        <button className="btn btn-glass btn-sm" onClick={() => setShowSurvey(true)}>★</button>
                        <button className={`btn btn-glass btn-sm ${isPlaying ? 'resonance-active-btn' : ''}`} onClick={() => setShowMusic(true)}>♫</button>
                        <button className="btn btn-glass btn-sm" onClick={() => { setBellState('thinking'); showToast("Reading the room..."); }} disabled={sending}>⟢</button>
                        <button className="btn btn-glass btn-sm" onClick={() => setShowMemory(true)}>✦</button>
                        <button className="btn btn-glass btn-icon" onClick={onLogout}>⚙</button>
                    </div>
                )}
            </div>

            <div className="messages-container" ref={messagesContainerRef}>
                {messages.length === 0 ? (
                    <div className="empty-chat">
                        <BellDot state="idle" size={24} sentiment={mood} />
                        <p style={{ marginTop: 16 }}>Your canvas is ready.</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.sender === user?.uid;
                        const isUni = msg.isUni;
                        const isArchived = messages.length > 12 && idx < messages.length - 12;
                        return (
                            <div key={msg.id} className={`msg-row ${isUni ? 'uni-msg' : isMe ? 'sent' : 'received'} ${isArchived ? 'archived' : ''}`}>
                                <div className={`bubble ${isUni ? 'uni' : isMe ? 'sent' : 'received'}`} data-sentiment={msg.sentiment || 'neutral'} data-effect={isArchived ? 'none' : (msg.bubbleEffect || 'breathe')}>
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="bell-gravitation-well" ref={bellRef} />

            <div className={`input-bar ${!isMyTurn ? 'disabled-turn' : ''}`}>
                <input
                    ref={inputRef}
                    className="input"
                    type="text"
                    placeholder={isMyTurn ? "Say something…" : `Waiting for ${partnerName}…`}
                    value={text}
                    onChange={handleTextChange}
                    onKeyDown={handleKeyDown}
                    disabled={sending || !isMyTurn}
                    autoFocus
                />
                <button className="send-btn" onClick={sendMessage} disabled={!text.trim() || sending || !isMyTurn}>
                    {isMyTurn ? '↑' : '⌛'}
                </button>
            </div>

            {showMemory && <MemoryCard roomId={roomId} messages={messages} mood={mood} partnerName={partnerName} userName={user?.displayName || 'You'} onClose={() => setShowMemory(false)} onToast={(m) => { setBellState('glow'); showToast(m); setTimeout(() => setBellState('idle'), 2000); }} />}
            {showArtifact && soulSong && <ArtifactFrame title={soulSong.title} lyrics={soulSong.lyrics} onClose={() => setShowArtifact(false)} />}
            {showPricing && <PricingOverlay onClose={() => setShowPricing(false)} onSponsor={handleSponsor} hasDiscount={hasDiscount} />}
            {showSurvey && <FeedbackModal onClose={() => setShowSurvey(false)} onSubmit={handleFeedbackSubmit} />}
            {showMusic && <ResonancePlayer roomId={roomId} user={user} onPlay={playSong} onClose={() => setShowMusic(false)} currentTitle={currentSongTitle} isPlaying={isPlaying} onToggle={onToggleAudio} />}

            {toast && <div className="toast">{toast}</div>}
            <div className="cgei-watermark">{roomData?.isSanctified ? 'FOUNDER PROTOCOL v4 • ETERNAL RESONANCE' : 'CGEI PROTOCOL v4 • AUTHENTIC RESONANCE'}</div>
        </div>
    );
}
