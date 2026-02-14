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
                width: `${size * 2.5}px`,
                height: `${size * 2.5}px`,
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
                    opacity: isActive ? 0.2 : 0.05,
                    filter: 'blur(calc(var(--core-size, 20px) * 1.8))',
                    transform: isActive ? 'scale(1.3)' : 'scale(1.0)',
                    transition: 'all 1.5s ease'
                }}
            />
            {/* Synaptic Fringe — Subtle chromatic spread */}
            {isActive && (
                <div
                    style={{
                        position: 'absolute',
                        inset: -10,
                        borderRadius: '50%',
                        border: `1px solid ${color}`,
                        opacity: 0.1,
                        filter: 'blur(4px)',
                        animation: 'bell-breathe 3.333s ease-in-out infinite'
                    }}
                />
            )}

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

                {/* Atmospheric Orbital Rings */}
                <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="0.15" strokeOpacity="0.1" />
                <circle cx="50" cy="50" r="34" fill="none" stroke={color} strokeWidth="0.2" strokeOpacity="0.15" />

                {/* Inner Beating Ring */}
                <circle cx="50" cy="50" r="24" fill="none" stroke={color} strokeWidth="0.3" strokeOpacity="0.2">
                    <animate attributeName="r" values="22;26;22" dur="6s" repeatCount="indefinite" />
                </circle>

                {/* Inner Rotating Ring */}
                <circle cx="50" cy="50" r="18" fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.25" strokeDasharray="2 6" className="bell-orbit">
                    <animate attributeName="r" values="16;20;16" dur="8s" repeatCount="indefinite" />
                    {isActive && (
                        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="15s" repeatCount="indefinite" />
                    )}
                </circle>

                {/* The Central Core — Pure White Intellect */}
                <circle
                    cx="50" cy="50" r="8"
                    fill="#FFFFFF"
                    className="bell-core"
                    style={{ filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.9))' }}
                >
                    <animate attributeName="r" values="7;9;7" dur="3.333s" repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" values="0.9;1;0.9" dur="3.333s" repeatCount="indefinite" />
                </circle>

                {/* Firing Neurons (Animated Particles) */}
                {isActive && particles.map((p) => (
                    <circle key={`dot-${p.id}`} r="0.6" fill="#FFFFFF" opacity="0">
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
            </svg>
        </div>
    );
}

