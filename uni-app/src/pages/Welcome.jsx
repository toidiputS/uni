// •UNI• Global Landing — Sovereign Reflection Edition
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ReflectiveButton } from '../components/ReflectiveButton';
import ReviewTicker from '../components/ReviewTicker';
import SEQUENCE, { markOnboardingComplete } from '../lib/onboarding';

const PREVIEW_MOODS = [
    { mood: 'love', sceneColors: ['#1a0a12', '#200d16'], intensity: 0.8 },
    { mood: 'tender', sceneColors: ['#120a1a', '#160d20'], intensity: 0.4 },
    { mood: 'excited', sceneColors: ['#081518', '#0d1a1e'], intensity: 0.7 },
];

export default function Welcome({ onGetStarted, onMoodChange, isPlaying, onToggleAudio, setBellConfig, onShowPricing }) {
    const [visible, setVisible] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(-1); // -1 is Hero
    const scrollContainerRef = useRef(null);
    const sectionRefs = useRef([]);
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

    // Timer Logic
    useEffect(() => {
        const target = new Date('2026-03-17T00:00:00').getTime();
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

    // Intersection Observer to sync Bell and atmosphere with manual scroll
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = parseInt(entry.target.getAttribute('data-idx'));
                    if (!isNaN(idx)) {
                        handleSectionVisible(idx);
                    }
                }
            });
        }, { threshold: 0.5 }); // Use 0.5 for more responsive switching

        sectionRefs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const handleSectionVisible = (idx) => {
        setCurrentIdx(idx);

        // Hero
        if (idx === -1) {
            setBellConfig({ state: 'idle', size: 40, sentiment: 'neutral', top: '8vh', left: '50%' });
            onMoodChange(PREVIEW_MOODS[0]);
            return;
        }

        // Onboarding Steps
        if (idx >= 0 && idx < SEQUENCE.length) {
            const current = SEQUENCE[idx];
            setBellConfig(prev => ({ ...prev, state: current.bellState }));
            if (current.sceneColors) {
                onMoodChange({
                    mood: current.sentiment || 'neutral',
                    sceneColors: current.sceneColors,
                    intensity: current.sentiment === 'love' ? 0.8 : 0.4,
                    keywords: current.keywords
                });
            }
        }

        // Reviews & Join
        if (idx >= SEQUENCE.length) {
            setBellConfig({ state: 'idle', size: 30, sentiment: 'neutral', top: '5vh', left: '50%' });
        }
    };

    const scrollTo = (idx) => {
        const targetIndex = idx + 1; // map -1, 0, 1... to 0, 1, 2...
        const target = sectionRefs.current[targetIndex];
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const startOnboarding = () => {
        if (!isPlaying) onToggleAudio();
        scrollTo(0); // Scroll to first boarding step
    };

    useEffect(() => {
        setTimeout(() => setVisible(true), 100);
    }, []);

    const icon = useMemo(() => {
        const now = new Date();
        return (now.getMonth() + 1 === 3 && now.getDate() === 17) ? "🍀" : "❤️";
    }, []);

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

                <div className="wordmark-bg">•UNI•</div>

                <div className="landing-scroll-container" ref={scrollContainerRef}>
                    {/* SECTION -1: Hero */}
                    <section
                        className="landing-section hero-section"
                        data-idx="-1"
                        ref={el => sectionRefs.current[0] = el}
                    >
                        <div className="ethereal-text" style={{ fontSize: 10, letterSpacing: '0.5em', marginBottom: 24, opacity: 0.5 }}>
                            • CGEI PROTOCOL v4 •
                        </div>

                        <h1 className="wordmark" style={{
                            fontSize: 'clamp(60px, 12vw, 120px)',
                            marginBottom: '2vh',
                            lineHeight: 1,
                            background: 'linear-gradient(to bottom, #fff 0%, rgba(255,255,255,0.4) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            •UNI•
                        </h1>

                        <p className="lead-text" style={{
                            fontSize: 'clamp(20px, 5vw, 24px)',
                            fontWeight: 200,
                            letterSpacing: '-0.02em',
                            color: 'rgba(255,255,255,0.9)',
                            marginBottom: '8vh'
                        }}>
                            Your connection, immortalized in art.
                        </p>

                        <div className="hero-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ReflectiveButton variant="primary" onClick={startOnboarding} size="lg">
                                Experience Resonance
                            </ReflectiveButton>
                            <button
                                className="ethereal-text"
                                onClick={onGetStarted}
                                style={{ fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, letterSpacing: '0.1em', marginTop: 16 }}
                            >
                                ALREADY A FOUNDER? SIGN IN
                            </button>
                            <p style={{ fontSize: 10, marginTop: 24, opacity: 0.3, letterSpacing: '0.2em' }}>
                                A SYMPHONIC EMOTION INTERFACE
                            </p>
                        </div>
                    </section>

                    {/* SECTION 0-N: Bell's Narrative Sequence (The Real Landing) */}
                    {SEQUENCE.map((stepData, i) => (
                        <section
                            key={i}
                            className="landing-section onboarding-section"
                            data-idx={i}
                            ref={el => sectionRefs.current[i + 1] = el}
                        >
                            <div className="section-content" style={{ opacity: currentIdx === i ? 1 : 0.05, transition: 'all 1.5s ease' }}>
                                {stepData.text && (
                                    <p className="onboarding-text" style={{
                                        fontSize: 'clamp(18px, 4.5vw, 28px)',
                                        maxWidth: 700,
                                        lineHeight: 1.5,
                                        fontWeight: 200,
                                        margin: '0 auto',
                                        color: '#fff',
                                        opacity: currentIdx === i ? 1 : 0,
                                        transform: currentIdx === i ? 'translateY(0)' : 'translateY(30px)',
                                        filter: currentIdx === i ? 'blur(0)' : 'blur(15px)',
                                        transition: 'all 2.4s cubic-bezier(0.16, 1, 0.3, 1)', // Even more ethereal
                                        letterSpacing: currentIdx === i ? '0.02em' : '0.12em'
                                    }}>
                                        {stepData.text}
                                    </p>
                                )}

                                {stepData.futureFeatures && (
                                    <div className="flex flex-wrap justify-center gap-4 mt-12" style={{ maxWidth: 700, margin: '40px auto 0' }}>
                                        {stepData.futureFeatures.map((f, j) => (
                                            <div key={j} className="onboarding-future-card"
                                                style={{
                                                    background: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid rgba(255,255,255,0.08)',
                                                    padding: '14px 28px',
                                                    borderRadius: 'var(--radius-full)',
                                                    fontSize: 14,
                                                    color: 'var(--uni-text-dim)',
                                                    backdropFilter: 'blur(30px)',
                                                    animation: 'fadeSlideUp 1s ease both',
                                                    animationDelay: `${j * 0.1}s`
                                                }}>{f}</div>
                                        ))}
                                    </div>
                                )}

                                {stepData.demoLabel && (
                                    <div className="demo-label-pill">
                                        {stepData.demoLabel}
                                    </div>
                                )}
                            </div>
                        </section>
                    ))}

                    {/* SECTION: Social Proof */}
                    <section
                        className="landing-section reviews-section"
                        data-idx={SEQUENCE.length}
                        ref={el => sectionRefs.current[SEQUENCE.length + 1] = el}
                    >
                        <h2 className="section-title" style={{ marginBottom: 40, fontWeight: 200, fontSize: 40 }}>The Resonance Echo</h2>
                        <ReviewTicker />
                        <div style={{ marginTop: 60 }}>
                            <ReflectiveButton variant="primary" onClick={() => scrollTo(SEQUENCE.length + 1)}>
                                Join the Founder's Run
                            </ReflectiveButton>
                        </div>
                    </section>

                    {/* SECTION: Urgency / Joining */}
                    <section
                        className="landing-section offer-section"
                        data-idx={SEQUENCE.length + 1}
                        ref={el => sectionRefs.current[SEQUENCE.length + 2] = el}
                    >
                        <div className="vday-badge" style={{ margin: '0 auto 30px', cursor: 'pointer' }} onClick={() => onShowPricing()}>
                            {icon} Founder's Run — Ends 03.17
                        </div>

                        <div className="vday-timer flex justify-center items-center w-full mx-auto" style={{ gap: '24px', marginBottom: '40px' }}>
                            {Object.entries(timeLeft).map(([label, val]) => (
                                <div key={label} className="timer-unit flex flex-col items-center" style={{ minWidth: '70px' }}>
                                    <span className="timer-val" style={{ fontSize: 54, fontWeight: 100 }}>{String(val).padStart(2, '0')}</span>
                                    <span className="timer-label" style={{ fontSize: 10, textTransform: 'uppercase', opacity: 0.4, letterSpacing: '0.1em' }}>{label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="hero-actions" style={{ gap: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ReflectiveButton variant="primary" onClick={onGetStarted} size="lg">
                                Begin Your Resonance
                            </ReflectiveButton>
                            <button
                                className="ethereal-text"
                                style={{ fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, letterSpacing: '0.1em' }}
                                onClick={onGetStarted}
                            >
                                RETURNING PARTNER? SIGN IN
                            </button>
                            <button
                                className="ethereal-text"
                                style={{ fontSize: 10, background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4 }}
                                onClick={() => onShowPricing()}
                            >
                                [ Founder's Sanctum Access ]
                            </button>
                        </div>
                    </section>

                    {/* PERSISTENT ANCHOR: The psychological center */}
                    {currentIdx >= 0 && currentIdx < SEQUENCE.length && (
                        <div className="fixed-resonance-anchor" style={{
                            position: 'fixed',
                            bottom: '8vh',
                            left: 0,
                            right: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 100,
                            animation: 'fadeSlideUp 1s ease'
                        }}>
                            <ReflectiveButton
                                variant="primary"
                                size="lg"
                                onClick={() => scrollTo(currentIdx + 1)}
                            >
                                {currentIdx === SEQUENCE.length - 1 ? 'Unlock Sanctuary' : 'Next Resonance'}
                            </ReflectiveButton>
                            {currentIdx < SEQUENCE.length && (
                                <p style={{ fontSize: 9, marginTop: 16, opacity: 0.3, cursor: 'pointer', letterSpacing: '0.2em' }} onClick={() => scrollTo(SEQUENCE.length + 1)}>
                                    SKIP JOURNEY
                                </p>
                            )}
                        </div>
                    )}

                    <style>{`
                        .landing-scroll-container {
                            width: 100%;
                            height: 100vh;
                            overflow-y: auto;
                            scroll-behavior: smooth;
                            scrollbar-width: none;
                        }
                        .landing-scroll-container::-webkit-scrollbar { display: none; }
                        
                        .landing-section {
                            width: 100%;
                            min-height: 100vh;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            padding: 10vh 40px;
                            position: relative;
                        }
                        .section-content {
                            maxWidth: 900px;
                            text-align: center;
                            transition: all 1.5s ease;
                        }
                        .demo-label-pill {
                            display: inline-block;
                            margin-top: 32px;
                            padding: 8px 20px;
                            background: rgba(255,255,255,0.05);
                            border: 1px solid rgba(255,255,255,0.1);
                            border-radius: 99px;
                            font-size: 11px;
                            letter-spacing: 0.2em;
                            text-transform: uppercase;
                            color: var(--uni-text-dim);
                        }
                        .wordmark-bg {
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            font-size: clamp(80px, 30vw, 400px);
                            font-weight: 700;
                            opacity: 0.03;
                            pointer-events: none;
                            z-index: 0;
                            letter-spacing: -0.05em;
                        }
                        @media (max-width: 768px) {
                            .landing-section { padding: 40px 24px; scroll-snap-align: none; }
                            .landing-scroll-container { scroll-snap-type: none; }
                        }
                    `}</style>
                </div>
            </div>
        </div>
    );
}
