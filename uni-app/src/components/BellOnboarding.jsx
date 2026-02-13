// BellOnboarding — Bell introduces herself
// Runs the scripted onboarding sequence with staged animations.
// Shows Bell's dot state changes, scene color shifts, and feature demos.

import React, { useState, useEffect, useRef } from 'react';
import SEQUENCE, { markOnboardingComplete } from '../lib/onboarding';

export default function BellOnboarding({ onComplete, onSceneChange, setBellConfig }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [messages, setMessages] = useState([]);
    const [bellState, setBellState] = useState('idle');
    const [futureFeatures, setFutureFeatures] = useState(null);
    const [showFinal, setShowFinal] = useState(false);
    const containerRef = useRef(null);

    // Advancing logic — now manual
    const handleNext = () => {
        if (stepIndex >= SEQUENCE.length) {
            markOnboardingComplete();
            onComplete();
            return;
        }

        const step = SEQUENCE[stepIndex];
        setBellState(step.bellState);
        setBellConfig(prev => ({ ...prev, state: step.bellState }));

        if (step.sceneColors && onSceneChange) {
            onSceneChange(step.sceneColors);
        }

        if (step.text) {
            setMessages(prev => [...prev, {
                text: step.text,
                sentiment: step.sentiment,
                demoLabel: step.demoLabel,
                isUni: true,
            }]);
        }

        if (step.futureFeatures) {
            setFutureFeatures(step.futureFeatures);
        }

        if (step.isFinal) {
            setShowFinal(true);
        }

        setStepIndex(prev => prev + 1);
    };

    // Initial step
    useEffect(() => {
        if (stepIndex === 0) {
            handleNext();
        }
    }, []);

    useEffect(() => {
        setBellConfig({
            state: bellState,
            size: 64,
            sentiment: 'neutral',
            top: '15%',
            left: '50%'
        });
    }, [bellState, setBellConfig]);

    // Effect for handling auto-progression if needed, but we'll stick to manual
    /*
    useEffect(() => {
        if (stepIndex >= SEQUENCE.length) return;
        // ...
    }, [stepIndex]);
    */

    // Auto-scroll
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages, futureFeatures]);

    return (
        <div className="onboarding-page">

            {/* Message stream */}
            <div className="onboarding-messages" ref={containerRef}>
                {messages.map((msg, i) => (
                    <div key={i} className="onboarding-msg" style={{ animationDelay: `${i * 0.1}s` }}>
                        {msg.demoLabel && (
                            <div className="onboarding-label">{msg.demoLabel}</div>
                        )}
                        <p className="onboarding-text">{msg.text}</p>
                    </div>
                ))}

                {/* Future Features cards */}
                {futureFeatures && (
                    <div className="onboarding-future">
                        <div className="onboarding-future-title">Future Features</div>
                        <div className="onboarding-future-grid">
                            {futureFeatures.map((f, i) => (
                                <div key={i} className="onboarding-future-card" style={{ animationDelay: `${i * 0.15}s` }}>
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Skip / Continue */}
            <div className="onboarding-actions">
                {showFinal ? (
                    <button className="btn btn-primary btn-glow" onClick={() => {
                        markOnboardingComplete();
                        onComplete();
                    }}>
                        Begin
                    </button>
                ) : (
                    <div className="onboarding-nav">
                        <button className="onboarding-skip" onClick={() => {
                            markOnboardingComplete();
                            onComplete();
                        }}>
                            Skip
                        </button>
                        <button className="onboarding-btn-next" onClick={handleNext}>
                            Tap to continue
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
