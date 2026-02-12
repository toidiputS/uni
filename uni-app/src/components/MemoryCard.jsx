import React, { useMemo, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Generate a poetic title from mood + context
function generateTitle(mood, messages) {
    const titles = {
        happy: [
            'Golden Moment', 'Sunshine Between Us', 'Laughter Lines', 'Joy, Captured',
            'A Bright Chapter', 'The Good Part', 'Smiles in the Signal',
        ],
        sad: [
            'Through the Rain', 'Quiet Understanding', 'Holding On', 'Soft Landing',
            'When Words Hold Weight', 'The Space Between',
        ],
        love: [
            'Written in Light', 'Pulse of Us', 'Where Hearts Align', 'The Warmth We Share',
            'Love in Transmission', 'A Canvas of You and Me', 'Electric Closeness',
        ],
        angry: [
            'Thunder and Growth', 'The Storm Passes', 'Honest Fire', 'Raw Edges',
            'Through the Tension',
        ],
        excited: [
            'Electric Moment', 'Sparks Flying', 'Pulse Rising', 'The Rush',
            'Alive Together',
        ],
        playful: [
            'Mischief Logged', 'Silly Beautiful', 'The Giggles', 'Nonsense, Preserved',
        ],
        tender: [
            'Gentle Landing', 'Softly Spoken', 'Velvet Words', 'The Quiet Between',
        ],
        neutral: [
            'A Moment, Saved', 'Between the Lines', 'Everyday Magic', 'Simply Us',
            'Conversation, Kept',
        ],
    };

    const pool = titles[mood] || titles.neutral;
    return pool[Math.floor(Math.random() * pool.length)];
}

export default function MemoryCard({ roomId, messages, mood, partnerName, userName, onClose, onToast }) {
    const [isSaving, setIsSaving] = useState(false);

    // Pick the most meaningful recent messages for the card
    const cardMessages = useMemo(() => {
        const userMessages = messages.filter(m => !m.isUni).slice(-10);
        const sorted = [...userMessages].sort((a, b) => (b.intensity || 0) - (a.intensity || 0));
        return sorted.slice(0, 3);
    }, [messages]);

    const title = useMemo(() => generateTitle(mood, messages), [mood, messages]);

    const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleSave = async () => {
        if (isSaving || !roomId) return;

        if (cardMessages.length === 0) {
            onToast('Conversation is too quiet to archive ✦');
            return;
        }

        setIsSaving(true);
        try {
            // Save to Firestore Permanent Archive
            await addDoc(collection(db, 'chatRooms', roomId, 'memories'), {
                title,
                messages: cardMessages.map(m => ({ text: m.text, senderName: m.senderName || 'Anonymous' })),
                mood,
                date: dateStr,
                participants: [userName || 'You', partnerName || 'Partner'],
                createdAt: serverTimestamp()
            });

            onToast('Memory archived forever ✨');
            onClose();
        } catch (err) {
            console.error('[UNI] Memory save failed:', err);
            onToast(`Archiving failed: ${err.message || 'Server error'}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="memory-card" onClick={(e) => e.stopPropagation()}>
                <div className="memory-card-inner">
                    <div className="memory-card-header">•UNI• Memory</div>

                    <div className="memory-card-title">{title}</div>

                    {cardMessages.map((msg, i) => (
                        <p key={i} className="memory-card-quote">
                            "{msg.text}"
                            <span style={{
                                display: 'block',
                                fontSize: 11,
                                color: 'var(--uni-text-dim)',
                                marginTop: 4,
                                fontStyle: 'normal',
                            }}>
                                — {msg.senderName || 'Anonymous'}
                            </span>
                        </p>
                    ))}

                    {cardMessages.length === 0 && (
                        <p className="memory-card-quote" style={{ color: 'var(--uni-text-dim)' }}>
                            Start a conversation to capture moments.
                        </p>
                    )}

                    <div className="memory-card-date" style={{ color: 'var(--uni-text-dim)' }}>
                        {dateStr} · {userName} & {partnerName}
                    </div>

                    <div className="memory-card-actions">
                        <button className="btn btn-primary btn-sm" onClick={handleSave}>
                            Save Memory ✨
                        </button>
                        <button className="btn btn-glass btn-sm" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
