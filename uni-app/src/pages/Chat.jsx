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
import { supabase } from '../lib/supabase';

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
    setBubblePositions,
    onShowPricing
}) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [roomData, setRoomData] = useState(null);
    const [mood, setMood] = useState('neutral');
    const [intensity, setIntensity] = useState(0.5);
    const [showMemory, setShowMemory] = useState(false);
    const [showArtifact, setShowArtifact] = useState(false);
    const [showMusic, setShowMusic] = useState(false);
    const [showSurvey, setShowSurvey] = useState(false);
    const [hasDiscount, setHasDiscount] = useState(false);
    const [soulSong, setSoulSong] = useState(null);
    const [toast, setToast] = useState('');
    const [bellState, setBellState] = useState('idle');

    // Photo state
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

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

    // Sync Global Bell config (Chat status only)
    useEffect(() => {
        setBellConfig(prev => ({
            ...prev,
            state: bellState,
            sentiment: mood,
            size: 32 // Keep consistent with global size
        }));
    }, [bellState, mood, setBellConfig]);

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

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            showToast("Only images and videos are supported ✨");
            return;
        }
        setSelectedFile(file);

        if (file.type.startsWith('video/')) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const sendMessage = useCallback(async () => {
        const trimmed = text.trim();
        if ((!trimmed && !selectedFile) || sending || !roomId || !user) return;
        setSending(true);
        setText('');
        setBellState('thinking');

        let imageUrl = null;
        if (selectedFile) {
            if (!supabase) {
                showToast("Storage not configured.");
                setSending(false);
                return;
            }
            setIsUploading(true);
            try {
                const filePath = `chat/${roomId}/${Date.now()}_${selectedFile.name}`;
                const { data, error } = await supabase.storage
                    .from('media') // Create this bucket or mapping to one
                    .upload(filePath, selectedFile);
                if (error) throw error;
                const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);
                imageUrl = publicUrl;
            } catch (err) {
                console.error('[UNI] Image Upload Failed:', err);
                showToast("Failed to upload image.");
            } finally {
                setIsUploading(false);
                setSelectedFile(null);
                setImagePreview(null);
            }
        }

        try {
            const msgContent = trimmed || (imageUrl ? 'shared an image' : '');
            const context = messages.slice(-8).map(m => ({ text: m.text, senderName: m.senderName, isUni: m.isUni }));
            const analysis = await analyzeMessage(msgContent, context);

            await addDoc(collection(db, 'chatRooms', roomId, 'messages'), {
                text: trimmed,
                imageUrl: imageUrl,
                sender: user.uid,
                senderName: user.displayName || 'You',
                sentiment: analysis.sentiment,
                intensity: analysis.intensity,
                bubbleEffect: analysis.bubbleEffect,
                sceneColors: analysis.sceneColors,
                isUni: false,
                createdAt: serverTimestamp()
            });
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
                }, 800);
            } else setBellState('idle');
        } catch (err) {
            setText(trimmed); showToast('The resonance failed.'); setBellState('idle');
        } finally { setSending(false); }
    }, [text, sending, roomId, user, messages]);

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
                        <button className="btn btn-glass btn-sm" onClick={() => onShowPricing()} title="Founder's Sanctum">🌹</button>
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
                                <div className={`bubble ${isUni ? 'uni' : isMe ? 'sent' : 'received'} ${msg.imageUrl ? 'image-bubble' : ''}`} data-sentiment={msg.sentiment || 'neutral'} data-effect={isArchived ? 'none' : (msg.bubbleEffect || 'breathe')}>
                                    {msg.imageUrl && (
                                        msg.imageUrl.toLowerCase().includes('.mp4') ? (
                                            <video src={msg.imageUrl} className="bubble-video" autoPlay muted loop playsInline onClick={() => window.open(msg.imageUrl, '_blank')} />
                                        ) : (
                                            <img src={msg.imageUrl} alt="Shared" onClick={() => window.open(msg.imageUrl, '_blank')} />
                                        )
                                    )}
                                    {msg.text && <div>{msg.text}</div>}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="bell-gravitation-well" ref={bellRef} />

            <div className="input-bar">
                {imagePreview && (
                    <div className="image-preview-wrap">
                        {selectedFile?.type?.startsWith('video/') ? (
                            <video src={imagePreview} className="image-preview" muted loop autoPlay />
                        ) : (
                            <img src={imagePreview} className="image-preview" alt="Preview" />
                        )}
                        <button className="clear-preview" onClick={() => { setSelectedFile(null); setImagePreview(null); }}>×</button>
                    </div>
                )}

                <button className="photo-btn" onClick={() => fileInputRef.current?.click()} disabled={sending || isUploading}>
                    {isUploading ? '...' : '📸'}
                </button>

                <label htmlFor="mediaUpload" className="sr-only">Upload Media</label>
                <input
                    id="mediaUpload"
                    name="mediaUpload"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*,video/*"
                    hidden
                    capture="environment" // Allows camera option on mobile
                />

                <label htmlFor="messageInput" className="sr-only">Message</label>
                <input
                    id="messageInput"
                    name="messageInput"
                    ref={inputRef}
                    className="input"
                    type="text"
                    placeholder={imagePreview ? "Add a caption..." : "Say something…"}
                    value={text}
                    onChange={handleTextChange}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                    autoFocus
                />
                <button className="send-btn" onClick={sendMessage} disabled={((!text.trim() && !selectedFile) || sending || isUploading)}>
                    {sending ? '...' : '↑'}
                </button>
            </div>

            {showMemory && <MemoryCard roomId={roomId} messages={messages} mood={mood} partnerName={partnerName} userName={user?.displayName || 'You'} onClose={() => setShowMemory(false)} onToast={(m) => { setBellState('glow'); showToast(m); setTimeout(() => setBellState('idle'), 2000); }} />}
            {showArtifact && soulSong && <ArtifactFrame title={soulSong.title} lyrics={soulSong.lyrics} onClose={() => setShowArtifact(false)} />}
            {showSurvey && <FeedbackModal onClose={() => setShowSurvey(false)} onSubmit={handleFeedbackSubmit} />}
            {showMusic && <ResonancePlayer roomId={roomId} user={user} onPlay={playSong} onClose={() => setShowMusic(false)} currentTitle={currentSongTitle} isPlaying={isPlaying} onToggle={onToggleAudio} />}

            {toast && <div className="toast">{toast}</div>}
            <div className="cgei-watermark">{roomData?.isSanctified ? 'FOUNDER PROTOCOL v4 • ETERNAL RESONANCE' : 'CGEI PROTOCOL v4 • AUTHENTIC RESONANCE'}</div>
        </div>
    );
}
