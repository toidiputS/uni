// Bell's Onboarding Sequence
// She introduces herself, demos features, teases Future Features.
// Runs ONCE on first chat entry. Stores flag in localStorage.
// Also acts as an investor demo — showcasing the full CGEI capability.

const ONBOARDING_KEY = 'uni_bell_onboarded';

// Each step: { text, bellState, sceneColors, delay (ms before this step), sentiment }
const SEQUENCE = [
    {
        text: null,
        bellState: 'idle',
        sceneColors: ['#0d0d18', '#0a0f1a'],
        delay: 800,
        sentiment: 'neutral',
    },
    {
        text: "Hi. I'm Bell.",
        bellState: 'generating',
        sceneColors: ['#0d0d18', '#0a0f1a'],
        delay: 1500,
        sentiment: 'neutral',
        keywords: 'glimmer,ethereal,soft,light'
    },
    {
        text: "I'm the heart of •UNI• — the resonance between U and I.",
        bellState: 'idle',
        sceneColors: ['#0d0d1e', '#0f0a1a'],
        delay: 2500,
        sentiment: 'tender',
        keywords: 'resonance,vibration,soft,glow'
    },
    {
        text: "This isn't just a chat app. Watch what happens when emotion touches the screen.",
        bellState: 'thinking',
        sceneColors: ['#0d1520', '#0a1018'],
        delay: 3000,
        sentiment: 'neutral',
    },
    {
        text: "When you say something loving…",
        bellState: 'generating',
        sceneColors: ['#1a0a18', '#200d1a'],
        delay: 2000,
        sentiment: 'love',
        keywords: 'rose,sunset,warmth,soft,abstract',
        demoLabel: '❤️ Emotion Detection',
    },
    {
        text: "…the whole room shifts. The background breathes your feeling.",
        bellState: 'idle',
        sceneColors: ['#1e0a1a', '#260d20'],
        delay: 2500,
        sentiment: 'love',
        keywords: 'heart,nebula,cosmic,love,warm',
        demoLabel: '🎨 Generative Scene',
    },
    {
        text: "Even arguments have weather. Distant thunder. Flash in the dark.",
        bellState: 'thinking',
        sceneColors: ['#1a0808', '#200d0d'],
        delay: 2500,
        sentiment: 'angry',
        keywords: 'storm,lightning,thunder,dark,waves',
        demoLabel: '⚡ Emotional Atmosphere',
    },
    {
        text: "And when a moment matters? You capture it. A memory card — yours forever.",
        bellState: 'glow',
        sceneColors: ['#1a0808', '#200d0d'], // Keep stormy colors
        delay: 2800,
        sentiment: 'angry', // Keep storm "hanging out"
        keywords: 'crystal,prism,reflection,light,memory',
        demoLabel: '📸 Memory Cards',
    },
    {
        text: "Coming soon…",
        bellState: 'idle',
        sceneColors: ['#1a0808', '#200d0d'],
        delay: 2000,
        sentiment: 'angry',
        isFutureFeatures: true,
    },
    {
        text: null,
        bellState: 'idle',
        sceneColors: ['#1a0808', '#200d0d'],
        delay: 3500,
        sentiment: 'angry',
        futureFeatures: [
            '🎙️ Voice Emotion',
            '🎵 Mood Soundscapes',
            '🖼️ AI-Generated Art',
            '📖 Chapter Milestones',
            '🎁 Printable Gifts',
        ],
    },
    {
        text: "I'll be here — quiet, watching, celebrating. You won't always see me. But you'll feel me.",
        bellState: 'generating',
        sceneColors: ['#1a0808', '#200d0d'],
        delay: 3000,
        sentiment: 'angry',
    },
    {
        text: "Now pair with someone you care about. Your canvas is ready.",
        bellState: 'idle',
        sceneColors: ['#0d0d18', '#0a0f1a'], // Return to clean sanctuary colors
        delay: 2500,
        sentiment: 'neutral', // TRIGGER FAST CLEANUP
        isFinal: true,
    },
];

export function hasSeenOnboarding() {
    try {
        return localStorage.getItem(ONBOARDING_KEY) === 'true';
    } catch {
        return false;
    }
}

export function markOnboardingComplete() {
    try {
        localStorage.setItem(ONBOARDING_KEY, 'true');
    } catch {
        // localStorage not available
    }
}

export function resetOnboarding() {
    try {
        localStorage.removeItem(ONBOARDING_KEY);
    } catch {
        // noop
    }
}

export default SEQUENCE;
