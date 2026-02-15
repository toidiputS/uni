import React, { useState } from 'react';

export default function FeedbackModal({ onClose, onSubmit }) {
    const [rating, setRating] = useState(0);
    const [fidelity, setFidelity] = useState(0);
    const [intuition, setIntuition] = useState(0);
    const [bestVibe, setBestVibe] = useState('');
    const [futureNeed, setFutureNeed] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const isComplete = rating > 0 && fidelity > 0 && intuition > 0 && bestVibe && futureNeed && comment.trim().length > 10;

    const handleSubmit = async () => {
        if (!isComplete || submitting) return;
        setSubmitting(true);
        try {
            await onSubmit({
                rating,
                fidelity,
                intuition,
                bestVibe,
                futureNeed,
                comment,
                version: 'v4-study'
            });
        } catch (err) {
            console.error('Study submission failed:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const icon = React.useMemo(() => {
        const now = new Date();
        return (now.getMonth() + 1 === 3 && now.getDate() === 17) ? "🍀" : "❤️";
    }, []);

    return (
        <div className="modal-overlay artifact-overlay" onClick={onClose} style={{ overflowY: 'auto', padding: '40px 20px' }}>
            <div className="artifact-frame" style={{ maxWidth: 500, margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <div className="artifact-paper" style={{ minHeight: 'auto', padding: '50px 40px' }}>
                    <div className="artifact-header">
                        <div className="artifact-uni-dot" />
                        <span>•UNI• EVOLUTION STUDY — v4.0</span>
                    </div>

                    <h1 className="artifact-title" style={{ fontSize: 24 }}>Deepening the Resonance</h1>
                    <div className="artifact-divider" />

                    <p style={{ fontSize: 13, textAlign: 'center', color: '#666', marginBottom: 32, lineHeight: 1.6 }}>
                        To unlock your <strong>Founder's Discount</strong>, please complete this brief study.
                        Your insights directly influence the soul of the interface.
                    </p>

                    <div className="survey-scroll" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 10 }}>

                        {/* 1. Overall Experience */}
                        <div className="survey-q" style={{ marginBottom: 30 }}>
                            <label style={qLabelStyle}>1. Overall Experience Resonance</label>
                            <div style={starWrapStyle}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button key={s} onClick={() => setRating(s)} style={starStyle(rating >= s)}>{icon}</button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Sanctuary Fidelity */}
                        <div className="survey-q" style={{ marginBottom: 30 }}>
                            <label style={qLabelStyle}>2. Sanctuary Fidelity (Does it feel private & safe?)</label>
                            <div style={starWrapStyle}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button key={s} onClick={() => setFidelity(s)} style={starStyle(fidelity >= s)}>{icon}</button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Bell's Intuition */}
                        <div className="survey-q" style={{ marginBottom: 30 }}>
                            <label style={qLabelStyle}>3. Bell's Intuition (How accurate is the detection?)</label>
                            <div style={starWrapStyle}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button key={s} onClick={() => setIntuition(s)} style={starStyle(intuition >= s)}>{icon}</button>
                                ))}
                            </div>
                        </div>

                        {/* 4. Best Vibe */}
                        <div className="survey-q" style={{ marginBottom: 30 }}>
                            <label htmlFor="bestVibe" style={qLabelStyle}>4. Which atmosphere felt most meaningful?</label>
                            <select
                                id="bestVibe"
                                name="bestVibe"
                                value={bestVibe}
                                onChange={(e) => setBestVibe(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="">Select an Atmosphere...</option>
                                <option value="valentine">Valentine (Deep Passion)</option>
                                <option value="tender">Tender (Soft Care)</option>
                                <option value="love">Heart (Shared Pulse)</option>
                                <option value="excited">Electric (High Energy)</option>
                                <option value="stormy">Stormy (Raw Growth)</option>
                            </select>
                        </div>

                        {/* 5. Future Discovery */}
                        <div className="survey-q" style={{ marginBottom: 30 }}>
                            <label htmlFor="futureNeed" style={qLabelStyle}>5. What should we build next to deepen your connection?</label>
                            <input
                                id="futureNeed"
                                name="futureNeed"
                                type="text"
                                placeholder="Voice, Video, Gifts, Art..."
                                value={futureNeed}
                                onChange={(e) => setFutureNeed(e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        {/* 6. Open Feedback */}
                        <div className="survey-q" style={{ marginBottom: 30 }}>
                            <label htmlFor="comment" style={qLabelStyle}>6. Final Resonance (Closing Thoughts)</label>
                            <textarea
                                id="comment"
                                name="comment"
                                placeholder="Tell us something real... (min 10 characters)"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                style={{ ...inputStyle, height: 100, resize: 'none' }}
                            />
                        </div>
                    </div>

                    <div className="artifact-actions" style={{ flexDirection: 'column', gap: 12, marginTop: 20 }}>
                        <button
                            className="btn btn-primary btn-glow"
                            style={{ width: '100%', opacity: isComplete ? 1 : 0.5 }}
                            onClick={handleSubmit}
                            disabled={!isComplete || submitting}
                        >
                            {submitting ? 'Transcribing...' : isComplete ? 'Complete Study & Unlock Discount ✨' : 'Complete All Fields to Unlock'}
                        </button>
                        <button className="btn btn-glass btn-sm" onClick={onClose} style={{ width: '100%', color: '#999' }}>
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const qLabelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center'
};

const starWrapStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: 12
};

const starStyle = (active) => ({
    background: 'none',
    border: 'none',
    fontSize: 24,
    cursor: 'pointer',
    color: active ? 'var(--emo-happy)' : '#eee',
    transition: 'all 0.2s ease',
    transform: active ? 'scale(1.2)' : 'scale(1)',
    padding: 5
});

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #eee',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    background: '#fafafa'
};
