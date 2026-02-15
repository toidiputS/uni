import React, { useEffect } from 'react';

export default function Terms({ onBack, setBellConfig }) {
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
                <h1 style={{ fontSize: '14px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--uni-text-muted)', marginBottom: '48px', textAlign: 'center' }}>Terms of Service</h1>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--uni-text-bright)', marginBottom: '16px' }}>The Resonance Agreement</h2>
                    <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>
                        By entering •UNI•, you agree to engage with the interface as an experimental space for emotional resonance. This is a sanctuary for connection, governed by mutual respect and curiosity.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--uni-text-bright)', marginBottom: '16px' }}>Acceptable Use</h2>
                    <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>
                        The sanctuary is designed for human connection. Any attempt to automate, scrape, or disrupt the emotional engine of •UNI• is a breach of this resonance. We reserve the right to preserve the peace of the sanctuary by removing any entity that causes harm.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--uni-text-bright)', marginBottom: '16px' }}>Emotional Disclaimer</h2>
                    <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>
                        •UNI• is a Conversational Generative Emotional Interface (CGEI). It is art. It is technology. It is not a clinical tool or a substitute for professional mental health care. Resonance is powerful, and we ask that you navigate it with self-awareness.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--uni-text-bright)', marginBottom: '16px' }}>Ownership & Governance</h2>
                    <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>
                        The technology and spirit of •UNI• belong to <strong>It's LLC "What It Is"</strong>. The resonance between you belongs to you. We grant you a license to manifest this art within our sanctuary. This sanctuary is governed by <strong>The Creator of The Youniverse</strong>.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--uni-text-bright)', marginBottom: '16px' }}>Support</h2>
                    <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>
                        For any issues regarding resonance or access, contact <strong>Ones@itsai.life</strong>.
                    </p>
                </section>

                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <button className="btn btn-glass" onClick={onBack}>Return to Sanctuary</button>
                </div>
            </div>
        </div>
    );
}
