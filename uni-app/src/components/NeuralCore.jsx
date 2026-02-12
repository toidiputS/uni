import React, { useMemo } from 'react';

/**
 * •UNI• NEURAL CORE
 * The upgraded consciousness of Bell.
 * A procedural SVG engine that simulates synaptic firing and emotional resonance.
 */
export const NeuralCore = ({
    size = 120,
    smSize,
    active = true,
    color = "stroke-cyan-500",
    sentiment = 'neutral'
}) => {
    const effectiveSize = smSize || size;

    // Map sentiment to core colors
    const sentimentColors = {
        angry: 'stroke-red-500',
        sad: 'stroke-blue-500',
        love: 'stroke-pink-500',
        happy: 'stroke-yellow-500',
        excited: 'stroke-cyan-400',
        playful: 'stroke-green-400',
        tender: 'stroke-purple-400',
        neutral: 'stroke-slate-400'
    };

    const coreColor = color || sentimentColors[sentiment] || sentimentColors.neutral;
    const glowColor = coreColor.replace('stroke-', 'bg-').replace('500', '500/20').replace('400', '400/20');

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
        <div className="relative flex items-center justify-center" style={{ width: 'var(--core-size, 120px)', height: 'var(--core-size, 120px)' }}>
            <style>{`
                :root { --core-size: ${size}px; }
                @media (min-width: 640px) { :root { --core-size: ${effectiveSize}px; } }
            `}</style>

            {/* Ambient Background Glow */}
            <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-1000 ${active ? `${glowColor} scale-125 opacity-100` : 'bg-slate-500/5 scale-100 opacity-50'
                }`}></div>

            <svg
                viewBox="0 0 100 100"
                className={`w-full h-full transition-transform duration-700 ${active ? 'scale-110' : 'scale-100 opacity-40'}`}
            >
                {/* Synaptic Paths (Left Side) - Procedural geometry */}
                {[...Array(6)].map((_, i) => (
                    <path
                        key={i}
                        d={`M 50 50 Q ${20 + i * 12} ${10 + i * 5}, ${10 + i * 15} 50`}
                        fill="none"
                        className={`${coreColor} opacity-20`}
                        strokeWidth="0.5"
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

                {/* Synaptic Paths (Right Side) */}
                {[...Array(6)].map((_, i) => (
                    <path
                        key={`r-${i}`}
                        d={`M 50 50 Q ${80 - i * 12} ${90 - i * 5}, ${90 - i * 15} 50`}
                        fill="none"
                        className={`${coreColor} opacity-20`}
                        strokeWidth="0.5"
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

                {/* Inner Breathing Rings - Simulating Pulsation */}
                <circle cx="50" cy="50" r="12" fill="none" className={coreColor} strokeWidth="0.5" strokeOpacity="0.3">
                    <animate attributeName="r" values="10;14;10" dur="6s" repeatCount="indefinite" />
                </circle>
                <circle cx="50" cy="50" r="18" fill="none" className={coreColor} strokeWidth="0.2" strokeOpacity="0.1">
                    <animate attributeName="r" values="15;20;15" dur="8s" repeatCount="indefinite" />
                </circle>

                {/* The Central Nucleus - The seat of consciousness */}
                <circle cx="50" cy="50" r="4" className="fill-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                    <animate attributeName="r" values="3.5;5;3.5" dur="3s" repeatCount="indefinite" />
                </circle>

                {/* Firing Neurons (Animated Particles) */}
                {active && particles.map((p) => (
                    <circle key={`dot-${p.id}`} r="0.8" className="fill-white opacity-0">
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
};

export default NeuralCore;
