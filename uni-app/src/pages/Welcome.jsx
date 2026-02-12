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

    // Onboarding Sequence Logic
    const startOnboarding = () => {
        if (!isPlaying) onToggleAudio();
        setStep('onboarding');
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
        if (current.sceneColors) onMoodChange({ mood: current.sentiment, sceneColors: current.sceneColors });

        if (current.text) {
            setMessages(prev => [...prev, { text: current.text, label: current.demoLabel }]);
        }

        setTimeout(() => runSequenceStep(idx + 1), current.delay || 3000);
    };

    const skipToIntro = () => {
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

            <div className={`welcome-content ${visible ? 'visible' : ''}`}>

                {/* 1. Bell (Always central focus) */}
                <div className="welcome-bell" style={{ transition: 'all 1s ease', transform: step === 'onboarding' ? 'translateY(2vh)' : 'translateY(0)' }}>
                    <BellDot state={bellStatus} size={step === 'onboarding' ? 40 : 32} />
                    <span className="bell-label">Bell • Neural Core</span>
                </div>

                {/* ACT 1: RESONANCE (Initial State) */}
                {step === 'resonance' && (
                    <div className="flex flex-col items-center gap-12 fade-in">
                        <div style={{ textAlign: 'center', maxWidth: 460 }}>
                            <p style={{ fontSize: 13, letterSpacing: '0.15em', color: 'var(--uni-text-muted)', textTransform: 'uppercase', marginBottom: 20 }}>
                                Intimate Vibe-Architecture for U & I
                            </p>
                        </div>

                        <div className="flex items-center gap-8">
                            {/* 5. Play (Trigger) */}
                            <ReflectiveButton variant="primary" onClick={startOnboarding}>
                                Start Resonance
                            </ReflectiveButton>

                            {/* 2. Skip */}
                            <ReflectiveButton size="sm" onClick={skipToIntro}>
                                Skip
                            </ReflectiveButton>

                            {/* 3. Read */}
                            <ReflectiveButton size="sm" onClick={() => window.open('https://uni.putit.on', '_blank')}>
                                Read
                            </ReflectiveButton>
                        </div>

                        <p style={{ fontSize: 11, opacity: 0.4, marginTop: 24, letterSpacing: '0.05em' }}>
                            Best experienced with sound.
                        </p>
                    </div>
                )}

                {/* ACT 2: SPEAKING (Onboarding Stream) */}
                {step === 'onboarding' && (
                    <div className="onboarding-stream flex flex-col items-center gap-6" style={{ height: '25vh', overflow: 'hidden', width: '100%', maxWidth: 500 }}>
                        {messages.slice(-2).map((msg, i) => (
                            <div key={i} className="onboarding-msg text-center fade-slide-up" style={{ opacity: i === 0 ? 0.3 : 1 }}>
                                {msg.label && <div className="onboarding-label" style={{ color: 'var(--uni-accent-1)' }}>{msg.label}</div>}
                                <p className="onboarding-text" style={{ fontSize: 18, fontWeight: 300 }}>{msg.text}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ACT 3: URGENCY (The Join Page) */}
                {step === 'urgency' && (
                    <div className="flex flex-col items-center gap-4 fade-in">
                        <div className="vday-badge">🌹 Limited Founder's Sanctum — Ends 2.15</div>

                        <div className="vday-timer">
                            {Object.entries(timeLeft).map(([label, val]) => (
                                <div key={label} className="timer-unit">
                                    <span className="timer-val">{String(val).padStart(2, '0')}</span>
                                    <span className="timer-label">{label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 my-8" style={{ maxWidth: 450 }}>
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

