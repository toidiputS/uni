// BellDot — The Living Indicator
// Bell's presence in the interface, expressed through motion
// Uses transform:scale() for Safari compatibility (not SVG r attribute)
//
// States:
//   idle       → subtle breathe (Bell is present)
//   thinking   → slow expand (Gemini is processing)
//   generating → orbit activates (Bell is about to speak)
//   listening  → faint pulse (user is typing)
//   glow       → single bright glow (memory saved, moment captured)

import React from 'react';

export default function BellDot({ state = 'idle', size = 28 }) {
    return (
        <div className={`bell-dot-wrap bell-${state}`} style={{ width: size * 4, height: size * 4 }}>
            <svg
                viewBox="0 0 120 120"
                width={size * 4}
                height={size * 4}
                className="bell-dot-svg"
            >
                {/* Orbital ring — visible during 'generating' */}
                <circle
                    cx="60"
                    cy="60"
                    r="38"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    className="bell-orbit"
                />

                {/* Core dot — pure white, highest tier */}
                <circle
                    cx="60"
                    cy="60"
                    r="20"
                    fill="white"
                    className="bell-core"
                />

                {/* Glow ring — 'glow' state only */}
                <circle
                    cx="60"
                    cy="60"
                    r="20"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    className="bell-glow-ring"
                />
            </svg>
        </div>
    );
}
