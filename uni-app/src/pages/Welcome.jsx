// •UNI• Welcome Page
// Valentine's Day 2026 launch — emotion-first landing

import React, { useState, useEffect, useRef } from 'react';

const PREVIEW_MOODS = [
    { mood: 'valentine', sceneColors: ['#1a050d', '#200810'], intensity: 0.9 },
    { mood: 'tender', sceneColors: ['#120a1a', '#160d20'], intensity: 0.4 },
    { mood: 'happy', sceneColors: ['#1a1508', '#201a0a'], intensity: 0.6 },
    { mood: 'love', sceneColors: ['#1a0a12', '#200d16'], intensity: 0.8 },
    { mood: 'excited', sceneColors: ['#081518', '#0d1a1e'], intensity: 0.7 },
];

export default function Welcome({ onGetStarted, onMoodChange }) {
    const [visible, setVisible] = useState(false);
    const index = useRef(0);
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

    useEffect(() => {
        const target = new Date('2026-02-15T00:00:00').getTime();

        const tick = () => {
            const now = new Date().getTime();
            const diff = target - now;

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

    useEffect(() => {
        setTimeout(() => setVisible(true), 100);

        const moodTimer = setInterval(() => {
            index.current = (index.current + 1) % PREVIEW_MOODS.length;
            onMoodChange(PREVIEW_MOODS[index.current]);
        }, 6000);

        onMoodChange(PREVIEW_MOODS[0]);

        return () => clearInterval(moodTimer);
    }, [onMoodChange]);

    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(() => { });
            setIsPlaying(true);
        }
    };

    return (
        <div className="welcome">
            <audio ref={audioRef} src="/wishes_in_the_wind.mp3" loop />

            {/* Resonance Player Toggle */}
            <div className={`audio-toggle ${isPlaying ? 'playing' : ''}`} onClick={toggleAudio}>
                <div className="resonance-dot" />
                <span>{isPlaying ? 'Resonance On' : 'Silent Mode'}</span>
            </div>

            <div className="hearts-float" aria-hidden="true">
                <span className="heart h1">♥</span>
                <span className="heart h2">♥</span>
                <span className="heart h3">♥</span>
                <span className="heart h4">♥</span>
                <span className="heart h5">♥</span>
            </div>

            <div className={`welcome-content ${visible ? 'visible' : ''}`}>
                <div className="wordmark">
                    •UNI•
                    <div style={{
                        fontSize: 9,
                        letterSpacing: '0.4em',
                        marginTop: 4,
                        opacity: 0.5,
                        fontWeight: 400
                    }}>CGEI PROTOCOL v4</div>
                </div>

                <p className="tagline">
                    Your conversations deserve to <em>feel</em> something.
                    <br />
                    <span style={{ fontSize: '0.9em', opacity: 0.8 }}>
                        The world's first <strong>CGEI</strong> (Conversational Generative Emotion Interface).
                    </span>
                </p>

                <div className="vday-badge">
                    🌹 Founder's Launch Edition — Ends 2.15
                </div>

                <div className="vday-timer">
                    <div className="timer-unit">
                        <span className="timer-val">{String(timeLeft.d).padStart(2, '0')}</span>
                        <span className="timer-label">Days</span>
                    </div>
                    <div className="timer-unit">
                        <span className="timer-val">{String(timeLeft.h).padStart(2, '0')}</span>
                        <span className="timer-label">Hrs</span>
                    </div>
                    <div className="timer-unit">
                        <span className="timer-val">{String(timeLeft.m).padStart(2, '0')}</span>
                        <span className="timer-label">Min</span>
                    </div>
                    <div className="timer-unit">
                        <span className="timer-val">{String(timeLeft.s).padStart(2, '0')}</span>
                        <span className="timer-label">Sec</span>
                    </div>
                </div>

                <div className="welcome-actions">
                    <button className="btn btn-primary btn-glow" onClick={onGetStarted}>
                        Start Your Story
                    </button>
                    <button
                        className="btn btn-glass btn-sm"
                        onClick={onGetStarted}
                        style={{ marginTop: 4 }}
                    >
                        Already have an account? Log in
                    </button>
                </div>

                <div className="welcome-features">
                    <div className="feature-pill">◈ CGEI Reactive Atmosphere Engine</div>
                    <div className="feature-pill">◈ Neural Sentiment Transcription</div>
                    <div className="feature-pill">◈ Memory Archiving & Keepsakes</div>
                    <div className="feature-pill">◈ Shared Soul-Song Weaving</div>
                </div>
            </div>
        </div>
    );
}
