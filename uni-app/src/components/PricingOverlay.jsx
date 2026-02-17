import React, { useState } from 'react';

export default function PricingOverlay({ onClose, onSponsor, hasDiscount, onOpenSurvey }) {
    const [selected, setSelected] = useState('sage'); // 'base' | 'sage'

    return (
        <div className="modal-overlay artifact-overlay" onClick={onClose}>
            <div className="artifact-frame" style={{ maxWidth: 450 }} onClick={(e) => e.stopPropagation()}>
                <div className="artifact-paper" style={{ minHeight: 'auto', padding: '40px 30px' }}>
                    <div className="artifact-header">
                        <div className="artifact-uni-dot" style={{ background: 'var(--emo-happy)' }} />
                        <span>•UNI• 14-DAY TRIAL INCLUDED FOR NEW FOUNDERS</span>
                    </div>

                    <h1 className="artifact-title" style={{ fontSize: 24, marginBottom: 16 }}>Choose Your Resonance</h1>
                    <div className="artifact-divider" />

                    <p style={{ fontSize: 12, lineHeight: 1.6, color: '#666', marginBottom: 24, textAlign: 'center' }}>
                        All new accounts begin with 14 days of full sage wisdom.
                        Guest sessions are ephemeral and will be erased upon dissolution.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 20 }}>
                        <div
                            className={`pricing-card ${selected === 'base' ? 'active' : ''}`}
                            onClick={() => setSelected('base')}
                            style={cardStyle(selected === 'base')}
                        >
                            <div style={labelStyle}>Base Observer</div>
                            <div style={priceStyle}>$3.99<span>/mo</span></div>
                            <div style={descStyle}>Bell is a quiet observer.<br />Visual atmosphere only.</div>
                        </div>

                        <div
                            className={`pricing-card ${selected === 'sage' ? 'active' : ''}`}
                            onClick={() => setSelected('sage')}
                            style={cardStyle(selected === 'sage')}
                        >
                            <div style={labelStyle}>Sovereign Sage</div>
                            <div style={priceStyle}>$8.99<span>/mo</span></div>
                            <div style={descStyle}>Full poetic wisdom.<br />Permanent Archiving.</div>
                        </div>

                        <div
                            className={`pricing-card ${selected === 'lifetime' ? 'active' : ''}`}
                            onClick={() => setSelected('lifetime')}
                            style={cardStyle(selected === 'lifetime')}
                        >
                            <div style={labelStyle}>FOUNDER LIFETIME</div>
                            <div style={priceStyle}>$24.99<span>/flat</span></div>
                            <div style={descStyle}>One-time payment.<br />Infinite Resonance.</div>
                        </div>
                    </div>

                    {hasDiscount && (
                        <div style={{
                            background: 'rgba(50, 255, 150, 0.1)',
                            border: '1px solid rgba(50, 255, 150, 0.2)',
                            borderRadius: 8,
                            padding: '10px',
                            marginBottom: 20,
                            fontSize: 12,
                            textAlign: 'center',
                            color: '#2b8a5d'
                        }}>
                            ✨ Founder Discount Active: $5.00 OFF applied at checkout.
                        </div>
                    )}

                    <div className="pricing-perks" style={{ marginBottom: 30 }}>
                        <div style={perkStyle}>
                            <span style={{ opacity: selected === 'base' ? 0.3 : 1 }}>⟢ Permanent Soul-Song Weaving</span>
                        </div>
                        <div style={perkStyle}>
                            <span style={{ opacity: selected === 'base' ? 0.3 : 1 }}>✦ Sage-Level Guidance & Questions</span>
                        </div>
                        <div style={perkStyle}>
                            <span>◈ Real-time Atmospheric Resonance</span>
                        </div>
                    </div>

                    <div className="artifact-actions" style={{ flexDirection: 'column', gap: 12 }}>
                        <button className="btn btn-primary btn-glow" style={{ width: '100%' }} onClick={() => onSponsor(selected)}>
                            {selected === 'sage' ? 'Enter the Sage Path ✨' : 'Start Observation Path ✨'}
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
