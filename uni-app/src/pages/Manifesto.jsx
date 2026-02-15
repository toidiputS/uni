import React, { useEffect, useState } from 'react';
import { ReflectiveButton } from '../components/ReflectiveButton';
import { markOnboardingComplete } from '../lib/onboarding';

export default function Manifesto({ onBegin, setBellConfig }) {
    const [step, setStep] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        setBellConfig({
            state: 'idle',
            size: 40,
            sentiment: 'neutral',
            top: '8vh',
            left: '50%',
            yOffset: 0
        });
    }, [setBellConfig]);

    const items = [
        {
            title: "WHAT AM I?",
            lines: [
                "I am the World’s First CGEI.",
                "A Conversational Generative Emotional Interface.",
                "I am the resonance between U and I."
            ]
        },
        {
            title: "WHAT DO I DO?",
            lines: [
                "I turn your connection into living art.",
                "Your words have weight. Your feelings have weather.",
                "I manifest the invisible thread between you."
            ]
        }
    ];

    const handleNext = () => {
        if (step < items.length - 1) {
            setStep(step + 1);
        } else {
            markOnboardingComplete();
            onBegin();
        }
    };

    return (
        <div className={`welcome manifesto-view ${visible ? 'visible' : ''}`} style={{
            justifyContent: 'flex-start',
            paddingTop: 'calc(env(safe-area-inset-top) + 12px)'
        }}>
            <div className="manifesto-container" style={{
                maxWidth: 600,
                width: '100%',
                margin: '0 auto',
                paddingTop: 'clamp(60px, 12vh, 120px)', // Pushing down to clear Bell
                textAlign: 'center',
                zIndex: 10,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start' // Align to top
            }}>
                <div key={step} className="manifesto-content fade-in">
                    <h1 style={{
                        fontSize: 'clamp(11px, 2.5vw, 13px)',
                        letterSpacing: '0.4em',
                        color: 'var(--uni-text-muted)',
                        textTransform: 'uppercase',
                        marginBottom: 'clamp(24px, 5vh, 48px)',
                        opacity: 0,
                        animation: `manifestoGhostIn 1.4s var(--ease) forwards`
                    }}>
                        {items[step].title}
                    </h1>

                    <div className="manifesto-lines" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vh, 24px)', padding: '0 20px' }}>
                        {items[step].lines.map((line, i) => (
                            <p key={i} style={{
                                fontSize: 'clamp(16px, 4.5vw, 20px)',
                                lineHeight: 1.5,
                                color: 'var(--uni-text-bright)',
                                fontWeight: 300,
                                opacity: 0,
                                animation: `manifestoGhostIn 1.8s var(--ease) forwards ${0.6 + i * 0.4}s`
                            }}>
                                {line}
                            </p>
                        ))}
                    </div>
                </div>

                <div style={{
                    position: 'fixed',
                    bottom: '8vh', // Matches Welcome.jsx exactly
                    left: 0,
                    right: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                    zIndex: 20
                }}>
                    <ReflectiveButton variant="primary" onClick={handleNext} size="lg">
                        {step < items.length - 1 ? "Understood" : "Enter the Sanctuary"}
                    </ReflectiveButton>
                    <p
                        onClick={onBegin}
                        style={{ fontSize: 9, marginTop: 8, opacity: 0.3, cursor: 'pointer', letterSpacing: '0.2em', textTransform: 'uppercase' }}
                    >
                        Skip Journey
                    </p>
                </div>
            </div>

            <div className="wordmark-reflect" style={{
                position: 'fixed',
                top: '48%',
                left: 0,
                right: 0,
                transform: 'translateY(-50%)',
                opacity: 0.1,
                pointerEvents: 'none',
                fontSize: 'clamp(60px, 15vw, 160px)',
                zIndex: 0
            }}>
                •UNI•
            </div>
        </div>
    );
}
