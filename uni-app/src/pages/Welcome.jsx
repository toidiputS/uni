// •UNI• Global Landing — Sovereign Reflection Edition
import React, { useState, useEffect, useRef } from 'react';
import { ReflectiveButton } from '../components/ReflectiveButton';
import SEQUENCE, { markOnboardingComplete } from '../lib/onboarding';

const PREVIEW_MOODS = [
    { mood: 'love', sceneColors: ['#1a0a12', '#200d16'], intensity: 0.8 },
    { mood: 'tender', sceneColors: ['#120a1a', '#160d20'], intensity: 0.4 },
    { mood: 'excited', sceneColors: ['#081518', '#0d1a1e'], intensity: 0.7 },
];

export default function Welcome({ onGetStarted, onMoodChange, isPlaying, onToggleAudio, setBellConfig }) {
    const [visible, setVisible] = useState(false);
    const [step, setStep] = useState('resonance'); // 'resonance', 'onboarding', 'urgency'
    const [messages, setMessages] = useState([]);
    const moodRef = useRef(0);
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

    // Timer Logic
    useEffect(() => {
        const target = new Date('2026-02-15T00:00:00').getTime();
        const tick = () => {
            const diff = target - new Date().getTime();
            if (diff <= 0) return;
            setTimeLeft({
                d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                s: Math.floor((diff % (1000 * 60)) / 1000)
            });
        };
        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, []);

    // Scene Rotation during Ambient/Init
    useEffect(() => {
        if (step !== 'resonance') return;
        const moodTimer = setInterval(() => {
            moodRef.current = (moodRef.current + 1) % PREVIEW_MOODS.length;
            onMoodChange(PREVIEW_MOODS[moodRef.current]);
        }, 8000);
        onMoodChange(PREVIEW_MOODS[0]);
        return () => clearInterval(moodTimer);
    }, [step, onMoodChange]);

    // Sync Global Bell
    useEffect(() => {
        setBellConfig({
            state: 'idle',
            size: 40,
            sentiment: 'neutral',
            top: '12vh',
            left: '50%'
        });
    }, [step, setBellConfig]);

    useEffect(() => {
        setTimeout(() => setVisible(true), 100);
    }, []);

    const [currentIdx, setCurrentIdx] = useState(0);

    const startOnboarding = () => {
        if (!isPlaying) onToggleAudio();
        // Set initial track-specific keywords if starting from scratch
        onMoodChange({ keywords: 'fountain,coins,ripples,wish,water' });
        setStep('onboarding');
        setMessages([]);
        setCurrentIdx(0);
        runSequenceStep(0);
    };

    const runSequenceStep = (idx) => {
        const current = SEQUENCE[idx];
        if (!current) return;

        setBellConfig(prev => ({ ...prev, state: current.bellState }));

        // Atmosphere Shift
        if (current.sceneColors) {
            onMoodChange({
                mood: current.sentiment || 'neutral',
                sceneColors: current.sceneColors,
                intensity: current.sentiment === 'love' ? 0.8 : 0.4,
                keywords: current.keywords
            });
        }

        // Narrative Logic: Stack messages, but isolate Features
        if (current.futureFeatures) {
            // "Take all these that are scrunched up and put them on the next page"
            setMessages([{
                id: Date.now(),
                text: "Coming soon...",
                features: current.futureFeatures
            }]);
        } else if (current.text) {
            setMessages(prev => {
                // If the previous message was the "Features Page", we start a new stack
                // (though in this specific sequence, final text comes after features)
                const lastMsg = prev[prev.length - 1];
                if (lastMsg && lastMsg.features) {
                    return [{ id: Date.now(), text: current.text }];
                }
                return [...prev, {
                    id: Date.now(),
                    text: current.text,
                    label: current.demoLabel
                }];
            });
        }
    };

    const handleNext = () => {
        const nextIdx = currentIdx + 1;
        if (nextIdx >= SEQUENCE.length) {
            setStep('urgency');
            markOnboardingComplete();
            return;
        }
        setCurrentIdx(nextIdx);
        runSequenceStep(nextIdx);
    };

    const skipToIntro = () => {
        setStep('urgency');
        markOnboardingComplete();
        if (!isPlaying) onToggleAudio();
    };


    return (
        <div className="welcome">
            {/* UI Chrome — System Layer */}
            <div style={{
                position: 'fixed',
                top: 24,
                right: 24,
                zIndex: 100,
                opacity: 0.8,
                transition: 'opacity 0.3s'
            }}>
                <ReflectiveButton
                    size="sm"
                    onClick={onToggleAudio}
                >
                    {isPlaying ? 'Resonance On' : 'Silent Mode'}
                </ReflectiveButton>
            </div>

            <div className={`welcome-content ${visible ? 'visible' : ''}`} style={{ textAlign: 'center' }}>

                <div style={{ height: step === 'onboarding' ? '15vh' : '18vh' }} />

                {/* ACT 1: RESONANCE (Initial State) */}
                {step === 'resonance' && (
                    <div className="flex flex-col items-center justify-center fade-in w-full text-center" style={{ flex: 1, padding: '0 24px', position: 'relative', zIndex: 1, minHeight: '60vh' }}>

                        <div className="ethereal-text" style={{ fontSize: 10, letterSpacing: '0.5em', marginBottom: 24, opacity: 0.5 }}>
                            CGEI — SYNAPTIC LINK 01
                        </div>

                        <h1 className="wordmark" style={{
                            fontSize: 'clamp(44px, 12vw, 92px)',
                            marginBottom: 40,
                            lineHeight: 1,
                            background: 'linear-gradient(to bottom, #fff 0%, rgba(255,255,255,0.6) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            •UNI•
                        </h1>

                        <div style={{ maxWidth: 540, display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
                            <p style={{
                                fontSize: 'clamp(18px, 4vw, 22px)',
                                color: 'var(--uni-text)',
                                lineHeight: 1.4,
                                fontWeight: 300,
                                letterSpacing: '-0.01em'
                            }}>
                                The World’s First <em>Conversational Generative Emotion Interface</em>.
                            </p>

                            <p style={{
                                fontSize: 14,
                                color: 'var(--uni-text-dim)',
                                lineHeight: 1.7,
                                fontWeight: 400,
                                maxWidth: 460,
                                margin: '0 auto',
                                opacity: 0.8
                            }}>
                                •UNI• turns your chat into living, breathing emotional art.
                                It listens to the tone beneath your words and transforms the space through emotional <strong>Resonance</strong>.
                            </p>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-10 w-full">
                            <ReflectiveButton variant="primary" onClick={startOnboarding}>
                                Start Resonance
                            </ReflectiveButton>

                            <ReflectiveButton size="sm" onClick={skipToIntro}>
                                Skip
                            </ReflectiveButton>
                        </div>

                        <p className="ethereal-text" style={{ fontSize: 9, marginTop: 12, opacity: 0.3 }}>
                            Best experienced with sound.
                        </p>
                    </div>
                )}

                {/* ACT 2: SPEAKING (Sovereign Stack) */}
                {step === 'onboarding' && (
                    <div className="flex flex-col items-center w-full fade-in" style={{ flex: 1, paddingTop: '5vh' }}>
                        <div className="flex flex-col items-center w-full" style={{ gap: 48 }}>
                            {messages.map((msg, i) => (
                                <div key={msg.id || i} className="onboarding-msg flex flex-col items-center w-full" style={{
                                    opacity: i === messages.length - 1 ? 1 : 0.25,
                                    transition: 'all 0.8s',
                                    marginBottom: 0
                                }}>
                                    {msg.text && (
                                        <p className="onboarding-text" style={{ fontSize: 16, maxWidth: 500 }}>
                                            {msg.text}
                                        </p>
                                    )}

                                    {msg.features && (
                                        <div className="flex flex-wrap justify-center gap-6 mt-12" style={{ maxWidth: 540 }}>
                                            {msg.features.map((f, j) => (
                                                <div key={j} className="onboarding-future-card"
                                                    style={{
                                                        background: 'var(--uni-glass)',
                                                        border: '1px solid var(--uni-glass-border)',
                                                        padding: '10px 24px',
                                                        borderRadius: 'var(--radius-full)',
                                                        fontSize: 13,
                                                        color: 'var(--uni-text-dim)',
                                                        backdropFilter: 'blur(12px)',
                                                        animation: 'fadeSlideUp 0.8s ease both',
                                                        animationDelay: `${j * 0.1}s`
                                                    }}>{f}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Interaction Zone — Viewport-Locked */}
                        <div style={{ position: 'fixed', bottom: '18vh', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
                            <ReflectiveButton variant="primary" onClick={handleNext}>
                                {currentIdx < SEQUENCE.length - 1 ? 'Next' : 'Continue'}
                            </ReflectiveButton>
                        </div>
                    </div>
                )}

                {/* ACT 3: URGENCY (The Join Page) */}
                {step === 'urgency' && (
                    <div className="flex flex-col items-center justify-center gap-6 fade-in w-full text-center" style={{ flex: 1, paddingBottom: '25vh' }}>
                        <div className="vday-badge" style={{ margin: '0 auto' }}>🌹 Limited Founder's Sanctum — Ends 2.15</div>

                        <div className="vday-timer flex justify-center items-center w-full mx-auto" style={{ gap: '24px', margin: '40px auto' }}>
                            {Object.entries(timeLeft).map(([label, val]) => (
                                <div key={label} className="timer-unit flex flex-col items-center" style={{ minWidth: '60px' }}>
                                    <span className="timer-val" style={{ fontSize: 32 }}>{String(val).padStart(2, '0')}</span>
                                    <span className="timer-label" style={{ fontSize: 10 }}>{label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 w-full" style={{ maxWidth: 500, margin: '20px auto' }}>
                            <div className="feature-pill">◈ Generative Vibe-Architecture</div>
                            <div className="feature-pill">◈ Neural Soul-Song Weaving</div>
                            <div className="feature-pill">◈ Permanent Soul-Archive</div>
                        </div>

                        <div style={{ position: 'fixed', bottom: '18vh', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
                            <ReflectiveButton variant="primary" onClick={onGetStarted}>
                                Begin
                            </ReflectiveButton>
                        </div>
                    </div>
                )}

                {/* 4. •UNI• (Base Identity) */}
                <div className="wordmark-reflect" style={{
                    position: 'fixed',
                    bottom: '22vh',
                    left: 0,
                    right: 0,
                    margin: 0,
                    zIndex: 0,
                    opacity: step === 'resonance' ? 0 : 1, // Hide when hero wordmark is present
                    transition: 'opacity 1s ease'
                }}>
                    •UNI•
                </div>

            </div>
        </div>
    );
}

