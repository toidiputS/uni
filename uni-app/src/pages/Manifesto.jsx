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
            size: 80,
            sentiment: 'neutral',
            top: '25%',
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
        <div className={`welcome manifesto-view ${visible ? 'visible' : ''}`}>
            <div className="manifesto-container" style={{
                maxWidth: 600,
                margin: '0 auto',
                paddingTop: '35vh',
                textAlign: 'center',
                zIndex: 10
            }}>
                <div key={step} className="manifesto-content fade-in">
                    <h1 style={{
                        fontSize: 14,
                        letterSpacing: '0.4em',
                        color: 'var(--uni-text-muted)',
                        textTransform: 'uppercase',
                        marginBottom: 32
                    }}>
                        {items[step].title}
                    </h1>

                    <div className="manifesto-lines" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {items[step].lines.map((line, i) => (
                            <p key={i} style={{
                                fontSize: 18,
                                lineHeight: 1.6,
                                color: 'var(--uni-text-bright)',
                                fontWeight: 300,
                                opacity: 0,
                                animation: `fadeSlideUp 0.8s ease forwards ${i * 0.2}s`
                            }}>
                                {line}
                            </p>
                        ))}
                    </div>
                </div>

                <div style={{
                    position: 'fixed',
                    bottom: '15vh',
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 12
                }}>
                    <ReflectiveButton variant="primary" onClick={handleNext}>
                        {step < items.length - 1 ? "Understood" : "Enter the Sanctuary"}
                    </ReflectiveButton>
                </div>
            </div>

            <div className="wordmark-reflect" style={{
                position: 'fixed',
                bottom: '22vh',
                left: 0,
                right: 0,
                opacity: 0.1
            }}>
                •UNI•
            </div>
        </div>
    );
}
