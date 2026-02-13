import React, { useMemo } from 'react';
import { SENTIMENT_COLORS } from '../lib/constants';

/**
 * •UNI• BellDot — The Seat of Consciousness
 * Procedural SVG engine simulating synaptic firing and emotional resonance.
 * This is the unified visual soul of Bell, used across all views.
 */
export default function BellDot({
    state = 'idle',
    size = 22,
    sentiment = 'neutral',
    activeOverride = null
}) {
    const isActive = activeOverride !== null ? activeOverride : (state !== 'idle' && state !== 'archived');
    const color = SENTIMENT_COLORS[sentiment] || SENTIMENT_COLORS.neutral;

    // Generates deterministic paths/animations to ensure smooth, gapless loops
    const particles = useMemo(() => {
        return [...Array(8)].map((_, i) => {
            const startX = 30 + ((i * 17) % 40);
            const midX = 30 + ((i * 23) % 40);
            const startY = 30 + ((i * 13) % 40);
            const midY = 30 + ((i * 29) % 40);
            const duration = 4 + (i % 3);
            const delay = i * 0.7;

            return {
                id: i,
                valuesX: `${startX};${midX};${startX}`,
                valuesY: `${startY};${midY};${startY}`,
                valuesOpacity: "0;1;0",
                dur: `${duration}s`,
                begin: `${delay}s`
            };
        });
    }, []);

    return (
        <div
            className={`bell-dot-wrap ${state !== 'idle' ? `bell-${state}` : ''}`}
            style={{
                width: `${size * 3.5}px`,
                height: `${size * 3.5}px`,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            {/* Ambient Background Glow — The emotional field */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: color,
                    opacity: isActive ? 0.15 : 0.05,
                    filter: 'blur(calc(var(--core-size, 20px) * 1.5))',
                    transform: isActive ? 'scale(1.2)' : 'scale(1.0)',
                    transition: 'all 1.5s ease'
                }}
            />

            <svg
                viewBox="0 0 100 100"
                className="bell-dot-svg"
                style={{
                    width: '100%',
                    height: '100%',
                    transform: isActive ? 'scale(1.1)' : 'scale(1.0)',
                    opacity: isActive ? 1 : 0.4,
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                {/* Synaptic Paths — Simulating thought flow */}
                {[...Array(6)].map((_, i) => (
                    <path
                        key={`l-${i}`}
                        d={`M 50 50 Q ${20 + i * 12} ${10 + i * 5}, ${10 + i * 15} 50`}
                        fill="none"
                        stroke={color}
                        strokeWidth="0.5"
                        strokeOpacity="0.25"
                        strokeDasharray="10 90"
                    >
                        {isActive && (
                            <animate
                                attributeName="stroke-dashoffset"
                                from="100"
                                to="0"
                                dur={`${6 + i}s`}
                                repeatCount="indefinite"
                            />
                        )}
                    </path>
                ))}

                {[...Array(6)].map((_, i) => (
                    <path
                        key={`r-${i}`}
                        d={`M 50 50 Q ${80 - i * 12} ${90 - i * 5}, ${90 - i * 15} 50`}
                        fill="none"
                        stroke={color}
                        strokeWidth="0.5"
                        strokeOpacity="0.25"
                        strokeDasharray="10 90"
                    >
                        {isActive && (
                            <animate
                                attributeName="stroke-dashoffset"
                                from="100"
                                to="0"
                                dur={`${7 + i}s`}
                                repeatCount="indefinite"
                            />
                        )}
                    </path>
                ))}

                {/* The "Orbit" — Intelligence manifestation */}
                <circle
                    cx="50" cy="50" r="42"
                    fill="none" stroke={color}
                    strokeWidth="0.25" strokeDasharray="1 10"
                    className="bell-orbit"
                />

                {/* Inner Breathing Rings */}
                <circle cx="50" cy="50" r="12" fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.3">
                    <animate attributeName="r" values="10;14;10" dur="6s" repeatCount="indefinite" />
                </circle>

                <circle cx="50" cy="50" r="18" fill="none" stroke={color} strokeWidth="0.2" strokeOpacity="0.1">
                    <animate attributeName="r" values="15;20;15" dur="8s" repeatCount="indefinite" />
                </circle>

                {/* The Central Nucleus — Pure Intellect */}
                <circle
                    cx="50" cy="50" r="4"
                    fill="#FFFFFF"
                    className="bell-core"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.9))' }}
                >
                    <animate attributeName="r" values="3.5;5.5;3.5" dur="3.333s" repeatCount="indefinite" />
                </circle>

                {/* Firing Neurons (Animated Particles) */}
                {isActive && particles.map((p) => (
                    <circle key={`dot-${p.id}`} r="0.8" fill="#FFFFFF" opacity="0">
                        <animate
                            attributeName="opacity"
                            values={p.valuesOpacity}
                            dur={p.dur}
                            begin={p.begin}
                            repeatCount="indefinite"
                        />
                        <animate attributeName="cx" values={p.valuesX} dur={p.dur} begin={p.begin} repeatCount="indefinite" />
                        <animate attributeName="cy" values={p.valuesY} dur={p.dur} begin={p.begin} repeatCount="indefinite" />
                    </circle>
                ))}

                {/* Glow Ring (Pulse event) */}
                <circle
                    cx="50" cy="50" r="10"
                    fill="none" stroke={color}
                    className="bell-glow-ring"
                />
            </svg>
        </div>
    );
}

