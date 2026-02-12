import React, { useState } from 'react';

export default function FeedbackModal({ onClose, onSubmit }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSubmitting(true);
        // Simulate network delay
        setTimeout(() => {
            onSubmit({ rating, comment });
            setSubmitting(false);
        }, 1000);
    };

    return (
        <div className="modal-overlay artifact-overlay" onClick={onClose}>
            <div className="artifact-frame" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
                <div className="artifact-paper" style={{ minHeight: 'auto', padding: '40px 30px' }}>
                    <div className="artifact-header">
                        <div className="artifact-uni-dot" />
                        <span>•UNI• EVOLUTION STUDY</span>
                    </div>

                    <h1 className="artifact-title" style={{ fontSize: 20 }}>How does it feel?</h1>
                    <div className="artifact-divider" />

                    <p style={{ fontSize: 13, textAlign: 'center', color: '#666', marginBottom: 20 }}>
                        We are building this sanctuary for you. Your feedback helps us evolve.
                        <strong> Complete this to unlock a $5 discount on Founder benefits.</strong>
                    </p>

                    <div className="star-rating" style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 25 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: 32,
                                    cursor: 'pointer',
                                    color: (rating >= star) ? 'var(--emo-happy)' : '#eee',
                                    transition: 'color 0.2s',
                                    padding: 0
                                }}
                            >
                                ✦
                            </button>
                        ))}
                    </div>

                    <textarea
                        placeholder="Additional thoughts or suggestions..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{
                            width: '100%',
                            height: 100,
                            padding: 12,
                            borderRadius: 12,
                            border: '1px solid #eee',
                            fontSize: 13,
                            fontFamily: 'inherit',
                            resize: 'none',
                            marginBottom: 20,
                            outline: 'none'
                        }}
                    />

                    <div className="artifact-actions" style={{ flexDirection: 'column', gap: 10 }}>
                        <button
                            className="btn btn-primary btn-glow"
                            style={{ width: '100%' }}
                            onClick={handleSubmit}
                            disabled={rating === 0 || submitting}
                        >
                            {submitting ? 'Transcribing...' : 'Submit & Unlock Discount ✨'}
                        </button>
                        <button className="btn btn-glass btn-sm" onClick={onClose} style={{ color: '#999' }}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
