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
        keywords: 'glimmer,interface,soft,light'
    },
    {
        text: "I am your AI Coordinator. I manage the shared synchronization between you and your partner.",
        bellState: 'idle',
        sceneColors: ['#0d0d1e', '#0f0a1a'],
        delay: 2500,
        sentiment: 'tender',
        keywords: 'sync,connection,soft,glow'
    },
    {
        text: "Most apps treat messages like static text. But in UNI, every word has an emotional context. I visualize that context in real-time.",
        bellState: 'thinking',
        sceneColors: ['#0d1520', '#0a1018'],
        delay: 3000,
        sentiment: 'neutral',
    },
    {
        text: "I listen to the tone and intent of your conversation. I use this data to synchronize your shared visual environment.",
        bellState: 'generating',
        sceneColors: ['#1a0a18', '#200d1a'],
        delay: 2000,
        sentiment: 'love',
        keywords: 'sunset,warmth,soft,abstract',
        demoLabel: '❤️ Sentiment Analysis',
    },
    {
        text: "When the mood shifts, the entire interface reacts. I transform your shared space into a visual representation of your current connection.",
        bellState: 'idle',
        sceneColors: ['#1e0a1a', '#260d20'],
        delay: 2500,
        sentiment: 'love',
        keywords: 'heart,nebula,cosmic,love,warm',
        demoLabel: '🎨 Generative Atmosphere',
    },
    {
        text: "And when the conversation grows heavy? I reflect that too. I provide the visual context so you can stay in sync through any emotion.",
        bellState: 'thinking',
        sceneColors: ['#1a0808', '#200d0d'],
        delay: 2500,
        sentiment: 'angry',
        keywords: 'storm,lightning,thunder,dark,waves',
        demoLabel: '⚡ Visual Synchronization',
    },
    {
        text: "Significant interactions are summarized into 'Atmospheric Artifacts'—high-fidelity records of your shared history.",
        bellState: 'glow',
        sceneColors: ['#1a0808', '#200d0d'],
        delay: 2800,
        sentiment: 'angry',
        keywords: 'crystal,prism,reflection,light,memory',
        demoLabel: '📸 Artifact Generation',
    },
    {
        text: "We are building a permanent history of your connection, where data is transformed into a shared contextual archive.",
        bellState: 'idle',
        sceneColors: ['#1a0808', '#200d0d'],
        delay: 2000,
        sentiment: 'angry',
    },
    {
        text: null,
        bellState: 'idle',
        sceneColors: ['#1a0808', '#200d0d'],
        delay: 3500,
        sentiment: 'angry',
        futureFeatures: [
            '🎙️ Voice Tone Sync',
            '🎵 Dynamic Soundscapes',
            '🖼️ Contextual AI-Canvas',
            '📖 Relationship History',
            '🎁 Physical Artifact Printing',
        ],
    },
    {
        text: "Your space is ready. I will monitor, synchronize, and support your connection in real-time.",
        bellState: 'generating',
        sceneColors: ['#0d0d18', '#0a0f1a'],
        delay: 3000,
        sentiment: 'neutral',
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
