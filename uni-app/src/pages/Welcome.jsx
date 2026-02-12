// •UNI• Global Landing — Sovereign Reflection Edition
import React, { useState, useEffect, useRef } from 'react';
import BellDot from '../components/BellDot';
import { ReflectiveButton } from '../components/ReflectiveButton';
import SEQUENCE, { markOnboardingComplete } from '../lib/onboarding';

const PREVIEW_MOODS = [
    { mood: 'love', sceneColors: ['#1a0a12', '#200d16'], intensity: 0.8 },
    { mood: 'tender', sceneColors: ['#120a1a', '#160d20'], intensity: 0.4 },
    { mood: 'excited', sceneColors: ['#081518', '#0d1a1e'], intensity: 0.7 },
];

export default function Welcome({ onGetStarted, onMoodChange, isPlaying, onToggleAudio }) {
    const [visible, setVisible] = useState(false);
    const [step, setStep] = useState('resonance'); // 'resonance', 'onboarding', 'urgency'
    const [messages, setMessages] = useState([]);
    const [bellStatus, setBellStatus] = useState('idle');
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

    useEffect(() => {
        setTimeout(() => setVisible(true), 100);
    }, []);

    const sequenceRef = useRef(null);
    const scrollRef = useRef(null);

    // Auto-scroll for onboarding messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Onboarding Sequence Logic
    const startOnboarding = () => {
        if (!isPlaying) onToggleAudio();
        setStep('onboarding');
        setMessages([]);
        runSequenceStep(0);
    };

    const runSequenceStep = (idx) => {
        if (idx >= SEQUENCE.length) {
            setStep('urgency');
            markOnboardingComplete();
            return;
        }

        const current = SEQUENCE[idx];
        setBellStatus(current.bellState);

        // Apply Atmosphere Shift
        if (current.sceneColors) {
            onMoodChange({
                mood: current.sentiment || 'neutral',
                sceneColors: current.sceneColors,
                intensity: current.sentiment === 'love' ? 0.8 : 0.4
            });
        }

        // Add Message with Cadence
        if (current.text) {
            setMessages(prev => [...prev, {
                text: current.text,
                label: current.demoLabel,
                features: current.futureFeatures
            }]);
        }

        // Wait for the scripted delay before next beat
        const nextDelay = current.delay || 3000;
        sequenceRef.current = setTimeout(() => runSequenceStep(idx + 1), nextDelay);
    };

    const skipToIntro = () => {
        if (sequenceRef.current) clearTimeout(sequenceRef.current);
        setStep('urgency');
        markOnboardingComplete();
        if (!isPlaying) onToggleAudio();
    };

    return (
        <div className="welcome">
            {/* 5. Play (The Resonance) */}
            <div className="absolute top-8 right-8 z-50">
                <ReflectiveButton
                    size="sm"
                    onClick={onToggleAudio}
                >
                    {isPlaying ? 'Resonance On' : 'Silent Mode'}
                </ReflectiveButton>
            </div>

            <div className={`welcome-content ${visible ? 'visible' : ''}`} style={{ textAlign: 'center' }}>

                {/* 1. Bell (Pure Center) */}
                <div className="welcome-bell" style={{ transition: 'all 1s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <BellDot state={bellStatus} size={32} />
                    <span className="bell-label" style={{ opacity: 0.6, marginTop: 12 }}>Bell</span>
                </div>

                {/* ACT 1: RESONANCE (Initial State) */}
                {step === 'resonance' && (
                    <div className="flex flex-col items-center justify-center gap-12 fade-in w-full text-center" style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, letterSpacing: '0.2em', color: 'var(--uni-text-muted)', textTransform: 'uppercase', marginBottom: 20, width: '100%' }}>
                            Intimate Vibe-Architecture for U & I
                        </p>

                        <div className="flex items-center justify-center gap-6 w-full">
                            <ReflectiveButton variant="primary" onClick={startOnboarding}>
                                Start Resonance
                            </ReflectiveButton>

                            <ReflectiveButton size="sm" onClick={skipToIntro}>
                                Skip
                            </ReflectiveButton>

                            <ReflectiveButton size="sm" onClick={() => window.open('https://uni.putit.on', '_blank')}>
                                Read
                            </ReflectiveButton>
                        </div>

                        <p style={{ fontSize: 11, opacity: 0.4, marginTop: 24, letterSpacing: '0.05em' }}>
                            Best experienced with sound.
                        </p>
                    </div>
                )}

                {/* ACT 2: SPEAKING (Scripted Stream) */}
                {step === 'onboarding' && (
                    <div className="onboarding-float flex flex-col items-center justify-center gap-12" style={{ height: '35vh', width: '100%', position: 'relative', textAlign: 'center' }}>
                        {messages.slice(-1).map((msg, i) => (
                            <div key={messages.length} className="text-center fade-float-up flex flex-col items-center">
                                {msg.label && <div className="onboarding-label" style={{ color: 'var(--uni-accent-1)', fontSize: 10, letterSpacing: '0.15em', marginBottom: 12 }}>{msg.label}</div>}
                                <p className="onboarding-text" style={{ fontSize: 24, fontWeight: 300, lineHeight: 1.5, maxWidth: 600, width: '100%', margin: '0 auto' }}>{msg.text}</p>

                                {msg.features && (
                                    <div className="flex flex-wrap justify-center gap-3 mt-10">
                                        {msg.features.map((f, j) => (
                                            <div key={j} className="onboarding-future-card" style={{ fontSize: 12, padding: '8px 18px' }}>{f}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ACT 3: URGENCY (The Join Page) */}
                {step === 'urgency' && (
                    <div className="flex flex-col items-center justify-center gap-6 fade-in w-full text-center" style={{ flex: 1 }}>
                        <div className="vday-badge" style={{ margin: '0 auto' }}>🌹 Limited Founder's Sanctum — Ends 2.15</div>

                        <div className="vday-timer flex justify-center items-center w-full" style={{ gap: '32px', margin: '40px auto' }}>
                            {Object.entries(timeLeft).map(([label, val]) => (
                                <div key={label} className="timer-unit">
                                    <span className="timer-val">{String(val).padStart(2, '0')}</span>
                                    <span className="timer-label">{label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 w-full" style={{ maxWidth: 500, margin: '20px auto' }}>
                            <div className="feature-pill">◈ Generative Vibe-Architecture</div>
                            <div className="feature-pill">◈ Neural Soul-Song Weaving</div>
                            <div className="feature-pill">◈ Permanent Soul-Archive</div>
                        </div>

                        <ReflectiveButton variant="primary" onClick={onGetStarted}>
                            Begin
                        </ReflectiveButton>
                    </div>
                )}

                {/* 4. •UNI• (Reflection - Always present) */}
                <div className="wordmark-reflect">
                    •UNI•
                </div>

            </div>
        </div>
    );
}

