import React, { useMemo } from 'react';

/**
 * BellDot / NeuralCore — The Upgraded Consciousness of Bell
 * Procedural SVG engine simulating synaptic firing.
 */
export default function BellDot({ state = 'idle', size = 22, sentiment = 'neutral' }) {
    const active = state !== 'idle' && state !== 'archived';

    // Map sentiment to core colors for emotional resonance
    const sentimentColors = {
        angry: '#ff4444',
        sad: '#5b86e5',
        love: '#ff6b9d',
        happy: '#ffd700',
        excited: '#36d1dc',
        playful: '#a8e063',
        tender: '#c084fc',
        neutral: '#888888'
    };

    const coreColor = sentimentColors[sentiment] || sentimentColors.neutral;

    // Generates deterministic paths/animations for the SVG "synapses"
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
        <div className="relative flex items-center justify-center pointer-events-none" style={{ width: `${size * 4}px`, height: `${size * 4}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Ambient Background Glow - Raw CSS for reliability */}
            <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: coreColor,
                opacity: active ? 0.15 : 0.05,
                filter: 'blur(24px)',
                transform: active ? 'scale(1.2)' : 'scale(1.0)',
                transition: 'all 1s ease'
            }}></div>

            <svg
                viewBox="0 0 100 100"
                style={{
                    width: '100%',
                    height: '100%',
                    transform: active ? 'scale(1.1)' : 'scale(1.0)',
                    opacity: active ? 1 : 0.4,
                    transition: 'all 0.7s ease'
                }}
            >
                {/* Synaptic Paths */}
                {[...Array(6)].map((_, i) => (
                    <path
                        key={i}
                        d={`M 50 50 Q ${20 + i * 12} ${10 + i * 5}, ${10 + i * 15} 50`}
                        fill="none"
                        stroke={coreColor}
                        strokeWidth="0.5"
                        strokeOpacity="0.2"
                        strokeDasharray="10 90"
                    >
                        {active && (
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
                        stroke={coreColor}
                        strokeWidth="0.5"
                        strokeOpacity="0.2"
                        strokeDasharray="10 90"
                    >
                        {active && (
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

                {/* Inner Breathing Rings */}
                <circle cx="50" cy="50" r="12" fill="none" stroke={coreColor} strokeWidth="0.5" strokeOpacity="0.3">
                    <animate attributeName="r" values="10;14;10" dur="6s" repeatCount="indefinite" />
                </circle>

                {/* The Central Nucleus */}
                <circle cx="50" cy="50" r="4" fill="#FFFFFF" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' }}>
                    <animate attributeName="r" values="3.5;5;3.5" dur="3s" repeatCount="indefinite" />
                </circle>

                {/* Firing Neurons (Animated Particles) */}
                {active && particles.map((p) => (
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
            </svg>
        </div>
    );
}
