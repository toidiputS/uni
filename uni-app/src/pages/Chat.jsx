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
import MemoryCard from '../components/MemoryCard';
import BellDot from '../components/BellDot';
import { analyzeMessage, composeSoulSong } from '../lib/gemini';
import { getDocs } from 'firebase/firestore';

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

export default function Chat({ user, userData, roomId, onMoodChange, onBubbleEmit, onSceneChange, onUnpair, onLogout }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [roomData, setRoomData] = useState(null);
    const [mood, setMood] = useState('neutral');
    const [showMemory, setShowMemory] = useState(false);
    const [showArtifact, setShowArtifact] = useState(false);
    const [soulSong, setSoulSong] = useState(null);
    const [toast, setToast] = useState('');
    const [bellState, setBellState] = useState('idle');

    // ... inside the component logic ...
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

    // Bell is active when she's doing something other than idle
    const bellActive = bellState !== 'idle';

    // Get partner's name from room data
    const partnerName = useMemo(() => {
        if (!roomData?.memberNames || !user) return 'Partner';
        const entries = Object.entries(roomData.memberNames);
        const partner = entries.find(([uid]) => uid !== user.uid);
        return partner ? partner[1] : 'Partner';
    }, [roomData, user]);

    // Listen to room metadata
    useEffect(() => {
        if (!roomId) return;
        const unsub = onSnapshot(doc(db, 'chatRooms', roomId), (snap) => {
            if (snap.exists()) setRoomData(snap.data());
        });
        return unsub;
    }, [roomId]);

    const [partnerPresent, setPartnerPresent] = useState(false);

    // Presence Pulse (Psychic Presence) Logic
    useEffect(() => {
        if (!roomId || !user) return;

        const q = query(
            collection(db, 'chatRooms', roomId, 'presence'),
            orderBy('timestamp', 'desc'),
            limit(1)
        );

        const unsubPresence = onSnapshot(q, (snap) => {
            if (!snap.empty) {
                const presence = snap.docs[0].data();
                if (presence.uid !== user.uid) {
                    // Partner is typing
                    if (presence.isTyping) {
                        setBellState('listening');
                        clearTimeout(typingTimer.current);
                        typingTimer.current = setTimeout(() => setBellState('idle'), 3000);
                    }

                    // Partner is in the room
                    const lastActive = presence.timestamp?.toMillis() || 0;
                    const now = Date.now();
                    const isRecent = (now - lastActive) < 15000; // Active in last 15s
                    setPartnerPresent(isRecent);
                }
            }
        });

        // Broadcast my own presence every 10s
        const presenceInterval = setInterval(() => {
            updateTypingStatus(false);
        }, 10000);

        return () => {
            unsubPresence();
            clearInterval(presenceInterval);
        };
    }, [roomId, user]);

    // Initial message listener
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
                onMoodChange?.({
                    mood: lastUserMsg.sentiment,
                    intensity: lastUserMsg.intensity || 0.5,
                    sceneColors: lastUserMsg.sceneColors,
                });
            }

            if (msgs.length > lastMsgCount.current && lastMsgCount.current > 0) {
                const newMsg = msgs[msgs.length - 1];
                if (newMsg && !newMsg.isUni && newMsg.bubbleEffect) {
                    const particleType = BUBBLE_PARTICLE_MAP[newMsg.bubbleEffect];
                    if (particleType) {
                        const isMe = newMsg.sender === user?.uid;
                        const x = isMe ? window.innerWidth * 0.75 : window.innerWidth * 0.25;
                        const y = window.innerHeight * 0.7;
                        onBubbleEmit?.({
                            type: particleType,
                            x, y,
                            count: 8
                        });
                    }
                }
            }
            lastMsgCount.current = msgs.length;
        });

        return () => unsub();
    }, [roomId, onMoodChange, onBubbleEmit, user]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Apply bell-active class to app shell
    useEffect(() => {
        const app = document.querySelector('.app');
        if (!app) return;
        if (bellActive) {
            app.classList.add('bell-active');
        } else {
            app.classList.remove('bell-active');
        }
    }, [bellActive]);

    // Bell listens when user types & syncs to Firestore for partner resonance
    const handleTextChange = (e) => {
        const val = e.target.value;
        setText(val);

        // Local Bell state
        if (val.trim()) {
            setBellState('listening');
            updateTypingStatus(true);

            clearTimeout(typingTimer.current);
            typingTimer.current = setTimeout(() => {
                setBellState('idle');
                updateTypingStatus(false);
            }, 2500);
        } else {
            setBellState('idle');
            updateTypingStatus(false);
        }
    };

    const [drawEmit, setDrawEmit] = useState(null);

    const handleDraw = async (point) => {
        if (!roomId || !user) return;
        try {
            await addDoc(collection(db, 'chatRooms', roomId, 'drawing'), {
                uid: user.uid,
                x: point.x,
                y: point.y,
                timestamp: serverTimestamp()
            });
        } catch (err) {
            // silent fail
        }
    };

    // Shared Drawing Listener
    useEffect(() => {
        if (!roomId || !user) return;
        const q = query(
            collection(db, 'chatRooms', roomId, 'drawing'),
            orderBy('timestamp', 'desc'),
            limit(1)
        );

        const unsubDrawing = onSnapshot(q, (snap) => {
            if (!snap.empty) {
                const drawData = snap.docs[0].data();
                if (drawData.uid !== user.uid) {
                    setDrawEmit({ x: drawData.x, y: drawData.y });
                }
            }
        });

        return () => unsubDrawing();
    }, [roomId, user]);

    const updateTypingStatus = async (isTyping) => {
        if (!roomId || !user) return;
        try {
            const roomRef = doc(db, 'chatRooms', roomId);
            await addDoc(collection(db, 'chatRooms', roomId, 'presence'), {
                uid: user.uid,
                isTyping,
                timestamp: serverTimestamp()
            });
        } catch (err) {
            // silent fail on presence
        }
    };

    // Send message
    const sendMessage = useCallback(async () => {
        const trimmed = text.trim();
        if (!trimmed || sending || !roomId || !user) return;

        setSending(true);
        setText('');
        setBellState('thinking');

        try {
            const messagesRef = collection(db, 'chatRooms', roomId, 'messages');

            const recentContext = messages.slice(-8).map(m => ({
                text: m.text,
                senderName: m.senderName || 'User',
                isUni: m.isUni || false,
            }));

            const analysis = await analyzeMessage(trimmed, recentContext);

            await addDoc(messagesRef, {
                text: trimmed,
                sender: user.uid,
                senderName: user.displayName || 'You',
                sentiment: analysis.sentiment,
                intensity: analysis.intensity,
                bubbleEffect: analysis.bubbleEffect,
                sceneColors: analysis.sceneColors,
                isUni: false,
                createdAt: serverTimestamp(),
            });

            if (analysis.shouldRespond && analysis.quip) {
                setBellState('generating');

                setTimeout(async () => {
                    try {
                        await addDoc(messagesRef, {
                            text: analysis.quip,
                            sender: 'Bell',
                            senderName: 'Bell',
                            sentiment: analysis.sentiment,
                            isUni: true,
                            createdAt: serverTimestamp(),
                        });
                    } catch (err) {
                        console.error('[Bell] Failed to add quip:', err);
                    }
                    setBellState('idle');
                }, 800);
            } else {
                setBellState('idle');
            }
        } catch (err) {
            console.error('[Bell] Send error:', err);
            setText(trimmed);
            showToast('Failed to send. Try again.');
            setBellState('idle');
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    }, [text, sending, roomId, user, messages]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleMemoryToast = (msg) => {
        setBellState('glow');
        showToast(msg);
        setTimeout(() => setBellState('idle'), 2000);
    };

    const formatTime = (timestamp) => {
        if (!timestamp?.toDate) return '';
        const d = timestamp.toDate();
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-page">
            {/* Header — chrome layer, quiet */}
            <div className="chat-header">
                <div className="chat-header-left">
                    <button className="chat-back" onClick={onUnpair} title="Back">
                        ←
                    </button>
                    <span className="chat-partner-name">
                        {partnerName}
                    </span>
                </div>

                {/* Bell lives top center */}
                <div className="bell-dot-center">
                    <BellDot state={bellState} size={10} />
                </div>

                <div className="chat-header-actions">
                    <button
                        className="btn btn-glass btn-sm"
                        onClick={handleWeave}
                        title="Weave Soul Song"
                        disabled={sending}
                    >
                        ⟢
                    </button>
                    <button
                        className="btn btn-glass btn-sm"
                        onClick={() => setShowMemory(true)}
                        title="Save this moment"
                    >
                        ✦
                    </button>
                    <button
                        className="btn btn-glass btn-icon"
                        onClick={onLogout}
                        title="Sign out"
                        style={{ fontSize: 14 }}
                    >
                        ⚙
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
                {messages.length === 0 ? (
                    <div className="empty-chat">
                        <BellDot state="idle" size={16} />
                        <p style={{ marginTop: 16, color: 'var(--uni-chrome)' }}>
                            Your canvas is ready.
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender === user?.uid;
                        const isUni = msg.isUni;

                        return (
                            <div
                                key={msg.id}
                                className={`msg-row ${isUni ? 'uni-msg' : isMe ? 'sent' : 'received'}`}
                            >
                                <div>
                                    <div
                                        className={`bubble ${isUni ? 'uni' : isMe ? 'sent' : 'received'}`}
                                        data-sentiment={msg.sentiment || 'neutral'}
                                        data-effect={msg.bubbleEffect || 'breathe'}
                                    >
                                        {msg.text}
                                    </div>
                                    {!isUni && (
                                        <div className="msg-time">
                                            {formatTime(msg.createdAt)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="input-bar">
                <input
                    ref={inputRef}
                    className="input"
                    type="text"
                    placeholder="Say something…"
                    value={text}
                    onChange={handleTextChange}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                    autoFocus
                />
                <button
                    className="send-btn"
                    onClick={sendMessage}
                    disabled={!text.trim() || sending}
                    title="Send"
                >
                    {sending ? '·' : '↑'}
                </button>
            </div>

            {/* Psychic Presence Pulse */}
            <div className={`presence-pulse ${partnerPresent ? 'active' : ''}`} />

            <AtmosphereCanvas
                mood={mood}
                intensity={intensity}
                bubbleEmit={bubbleEmit}
                drawEmit={drawEmit}
                onDraw={handleDraw}
            />

            {/* Memory Card Modal */}
            {showMemory && (
                <MemoryCard
                    roomId={roomId}
                    messages={messages}
                    mood={mood}
                    partnerName={partnerName}
                    userName={user?.displayName || 'You'}
                    onClose={() => setShowMemory(false)}
                    onToast={handleMemoryToast}
                />
            )}

            {/* Artifact Frame Modal */}
            {showArtifact && soulSong && (
                <ArtifactFrame
                    title={soulSong.title}
                    lyrics={soulSong.lyrics}
                    date={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    participants={[user?.displayName || 'You', partnerName]}
                    onClose={() => setShowArtifact(false)}
                />
            )}

            {/* Toast */}
            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}
