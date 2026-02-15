import React, { useEffect } from 'react';

export default function Privacy({ onBack, setBellConfig }) {
    useEffect(() => {
        setBellConfig({
            state: 'idle',
            size: 24,
            sentiment: 'neutral',
            top: '8vh',
            left: '50%'
        });
    }, [setBellConfig]);

    return (
        <div className="welcome fade-in" style={{ justifyContent: 'flex-start', overflowY: 'auto', padding: '120px 24px 60px' }}>
            <div className="artifact-paper" style={{ maxWidth: 800, margin: '0 auto', textAlign: 'left', background: 'rgba(255,255,255,0.02)', padding: '60px', borderRadius: '24px', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h1 style={{ fontSize: '14px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--uni-text-muted)', marginBottom: '48px', textAlign: 'center' }}>Privacy Policy</h1>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--uni-text-bright)', marginBottom: '16px' }}>The Sovereign Witness</h2>
                    <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>
                        At •UNI•, we believe privacy is the ground upon which intimacy grows. We act as a "Sovereign Witness" to your resonance, meaning we do not exploit, sell, or trade the emotional data generated within the sanctuary.
                    </p>
                </section>Section State: 1 (Privacy.jsx draft)

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--uni-text-bright)', marginBottom: '16px' }}>Data Collection</h2>
                    <ul style={{ listStyle: 'none', padding: 0, fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>
                        <li>• <strong>Authentication:</strong> We store your email and basic profile data via Firebase to facilitate your connection.</li>
                        <li>• <strong>Resonance Patterns:</strong> Your words and interactions generate transient emotional weather. This data is processed to create living art and is not used for profiling.</li>
                        <li>• <strong>Communication:</strong> Chat logs are encrypted and stored solely for the purpose of maintaining your shared sanctuary.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--uni-text-bright)', marginBottom: '16px' }}>Your Rights</h2>
                    <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>
                        The connection belongs to you. You may request the deletion of your account and all associated resonance data at any time. We keep only what is necessary to keep the light on in your sanctuary.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--uni-text-bright)', marginBottom: '16px' }}>Contact & Governance</h2>
                    <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>
                        •UNI• is a manifestation of <strong>It's LLC "What It Is"</strong>. For inquiries regarding your privacy or sanctuary data, reach out to <strong>Ones@itsai.life</strong>. This policy is overseen by <strong>The Creator of The Youniverse</strong>.
                    </p>
                </section>

                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <button className="btn btn-glass" onClick={onBack}>Return to Sanctuary</button>
                </div>
            </div>
        </div>
    );
}
