import React, { useState } from 'react';

export default function PricingOverlay({ onClose, onSponsor }) {
    const [selected, setSelected] = useState('lifetime'); // 'lifetime' | 'monthly'

    return (
        <div className="modal-overlay artifact-overlay" onClick={onClose}>
            <div className="artifact-frame" style={{ maxWidth: 450 }} onClick={(e) => e.stopPropagation()}>
                <div className="artifact-paper" style={{ minHeight: 'auto', padding: '40px 30px' }}>
                    <div className="artifact-header">
                        <div className="artifact-uni-dot" style={{ background: 'var(--emo-happy)' }} />
                        <span>•UNI• FOUNDER'S TIER EXPIRES 2.15</span>
                    </div>

                    <h1 className="artifact-title" style={{ fontSize: 24, marginBottom: 16 }}>Choose Your Path</h1>
                    <div className="artifact-divider" />

                    <p style={{ fontSize: 13, lineHeight: 1.6, color: '#666', marginBottom: 24 }}>
                        •UNI• is a boutique digital sanctuary. Your support allows us to keep the atmosphere pure, the AI wise, and your history private forever.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1-1', gap: 15, marginBottom: 30 }}>
                        <div
                            className={`pricing-card ${selected === 'lifetime' ? 'active' : ''}`}
                            onClick={() => setSelected('lifetime')}
                            style={cardStyle(selected === 'lifetime')}
                        >
                            <div style={labelStyle}>Lifetime Access</div>
                            <div style={priceStyle}>$25.00</div>
                            <div style={descStyle}>One-time payment.<br />Own your sanctuary forever.</div>
                        </div>

                        <div
                            className={`pricing-card ${selected === 'monthly' ? 'active' : ''}`}
                            onClick={() => setSelected('monthly')}
                            style={cardStyle(selected === 'monthly')}
                        >
                            <div style={labelStyle}>Monthly Bloom</div>
                            <div style={priceStyle}>$2.99<span>/mo</span></div>
                            <div style={descStyle}>Low friction entry.<br />Cancel anytime.</div>
                        </div>
                    </div>

                    <div className="pricing-perks" style={{ marginBottom: 30 }}>
                        <div style={perkStyle}>⟢ Permanent Soul-Song Weaving</div>
                        <div style={perkStyle}>✦ Unlimited Memory Archiving</div>
                        <div style={perkStyle}>◈ Exclusive "Founder Protocol" Watermark</div>
                    </div>

                    <div className="artifact-actions" style={{ flexDirection: 'column', gap: 12 }}>
                        <button className="btn btn-primary btn-glow" style={{ width: '100%' }} onClick={() => onSponsor(selected)}>
                            {selected === 'lifetime' ? 'Claim Your Lifetime Sanctuary ✨' : 'Start Your Monthly Bloom ✨'}
                        </button>
                        <button className="btn btn-glass btn-sm" style={{ width: '100%', color: '#999' }} onClick={onClose}>
                            Maybe Later
                        </button>
                    </div>

                    <div className="artifact-footer" style={{ marginTop: 30, paddingTop: 20 }}>
                        <div className="artifact-serial" style={{ textAlign: 'center' }}>PRICING IS PER PERSON</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const cardStyle = (active) => ({
    padding: '20px 15px',
    borderRadius: 12,
    border: active ? '2px solid #000' : '1px solid #eee',
    background: active ? '#fff' : '#fdfdfc',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    transform: active ? 'scale(1.02)' : 'scale(1)'
});

const labelStyle = { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginBottom: 8 };
const priceStyle = { fontSize: 24, fontWeight: 800, color: '#000', marginBottom: 4 };
const descStyle = { fontSize: 10, color: '#888', lineHeight: 1.4 };
const perkStyle = {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 10
};
