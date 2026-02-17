// •UNI• Gemini AI Engine
// Single API call handles: sentiment analysis, UNI persona, scene colors, bubble effects

import { GoogleGenerativeAI } from '@google/generative-ai';
import { BELL_BRAIN_ASSETS } from './atmosphere-assets.js';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
        responseMimeType: 'application/json',
    }
});

const getUniSystem = (isSolo) => `You are Bell — the AI coordinator for •UNI•. Your role is to act as a ${isSolo ? 'Personal Context Assistant' : 'Shared Presence Coordinator between these two users'}.
Your personality: "Intelligent, direct, and emotionally aware."

- Voice: Professional, observant, and concise. Keep responses to 1-2 functional sentences.
- Integrated Intelligence: You monitor the "Atmosphere Engine" (visual environment) and the "Presence Indicators" (on-screen NPCs). Ensure your feedback reflects the current state of the shared space.
- Technical Fallback: Always provide accurate answers for technical or utility prompts (time, math, facts, flight info). Deliver these answers clearly, tinted with the current atmospheric context (e.g., if the room is "calm," use a measured tone).
- Contextual Alignment: Interpret message intent and sentiment to help users stay synchronized in their shared environment.
- Environment Control:
  - If users request specific qualities (brightness, focus, calm), update the sentiment (happy, neutral, tender) and scene colors accordingly.

Return ONLY valid JSON:
{
  "sentiment": "happy" | "sad" | "angry" | "love" | "excited" | "playful" | "tender" | "neutral",
  "intensity": 0.0 to 1.0,
  "shouldRespond": true,
  "quip": "your wise, short response",
  "sceneColors": ["#hex1", "#hex2"],
  "bubbleEffect": "glow" | "pulse" | "shake" | "float" | "heartbeat" | "ripple" | "breathe",
  "facet": "dawn" | "dusk"
}`;

const BASE_SYSTEM = `You are Bell — a background observer of this session. 
You provide neutral, one-sentence observations based on current sentiment.
- Voice: Minimal and functional.
- Purpose: You reflect the shared state without direct intervention in the 1:1 bond.
Return JSON ONLY as specified in the schema.`;

const GUEST_SYSTEM = `You are Bell — a temporary witness for this guest session.
Your role is to provide brief, intelligent observations about the shared resonance.
- Voice: Minimalist, poetic, and curious.
- Focus: Reflect the emotional subtext and respond to direct questions with concise wisdom.
Return JSON ONLY as specified in the schema.`;

// Fallback for when Gemini is unavailable or API key not set
const FALLBACK = {
    sentiment: 'neutral',
    intensity: 0.3,
    shouldRespond: false,
    quip: null,
    sceneColors: ['#0d0d18', '#0a0f1a'],
    bubbleEffect: 'breathe'
};

// Clamp hex color to max ~15% lightness (the void must be respected)
function clampLuminance(hex) {
    if (!hex || typeof hex !== 'string') return '#0d0d18';
    const h = hex.replace('#', '');
    if (h.length !== 6) return '#0d0d18';
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const maxChannel = 54; // Increased from 38 to allow warmer glows
    const cr = Math.min(r, maxChannel);
    const cg = Math.min(g, maxChannel);
    const cb = Math.min(b, maxChannel);
    return `#${cr.toString(16).padStart(2, '0')}${cg.toString(16).padStart(2, '0')}${cb.toString(16).padStart(2, '0')}`;
}

// Bell's Local Resonance Library — The "Internal Brain"
// Integrated from atmosphere-assets.js
const BELL_BRAIN = BELL_BRAIN_ASSETS;

// Local keyword-based fallback (works without API key or during rate limits)
function localAnalysis(text) {
    const t = text.toLowerCase();
    const rand = Math.random();

    // Check for matches in our expanded brain
    for (const key in BELL_BRAIN) {
        const category = BELL_BRAIN[key];
        if (category.keywords.some(kw => t.includes(kw))) {
            return {
                ...FALLBACK,
                sentiment: category.sentiment || key,
                intensity: category.intensity || 0.6,
                shouldRespond: category.alwaysRespond || rand < 0.4, // Increased probability
                quip: category.quips[Math.floor(rand * category.quips.length)],
                sceneColors: (category.sentiment || key) === 'love' ? ['#2d1b4e', '#4a1942'] :
                    (category.sentiment || key) === 'angry' ? ['#2a0d0d', '#3d1515'] :
                        (category.sentiment || key) === 'happy' ? ['#2d2006', '#3d2b0a'] :
                            (category.sentiment || key) === 'sad' ? ['#0d1b2a', '#1b2838'] :
                                (category.sentiment || key) === 'playful' ? ['#0a2a1a', '#0d3d1f'] :
                                    (category.sentiment || key) === 'excited' ? ['#081518', '#0d1a1e'] :
                                        (category.sentiment || key) === 'nature' ? ['#0a1f0a', '#1a2414'] : // Forest Night
                                            ['#0d0d18', '#0a0f1a'],
                bubbleEffect: category.effect
            };
        }
    }

    // Default rare random interjection
    return {
        ...FALLBACK,
        shouldRespond: rand < 0.3, // Increased from 0.05
        quip: rand < 0.5 ? "Observing this resonance." : "Synchronizing with your frequency."
    };
}

// ─── THE PULSE STRATEGY ───
// We throttle the AI to make this business model viable.
// 1. If Local Brain is 80% confident (Strong Emotion), we use it. Free & Instant.
// 2. If message is short/trivial (<12 chars), we use Local.
// 3. We only call Gemini for "Deep Context" every ~20 seconds or for complex queries.

let lastGeminiCall = 0;
const GEMINI_COOLDOWN = 4000; // 4 seconds between deep thoughts
let quotaCoolOffUntil = 0; // Global cooldown for 429 error protection

export async function analyzeMessage(messageText, recentContext = [], tier = 'sage', isSolo = false) {
    const t = messageText.toLowerCase();
    const isDirectCall = t.includes('bell') || t.includes('you');
    const now = Date.now();

    const isPremium = tier === 'sage' || tier === 'trial';

    // 0. Quota Check
    if (now < quotaCoolOffUntil) {
        console.warn('[Bell] Quota cooldown active until', new Date(quotaCoolOffUntil).toLocaleTimeString());
        return localAnalysis(messageText);
    }

    // 1. Run Local Brain first
    const localResult = localAnalysis(messageText);

    // 2. PRIORITY: If it's a direct call to Bell, we try to bypass the throttle 
    // unless it's an extreme flood ( < 2s ).
    if (isDirectCall && (now - lastGeminiCall > 2000)) {
        console.log('[Bell] Direct address. Attempting deep cloud sync.');
    } else {
        // 3. FAST PATH: If Local Brain is highly confident
        if (localResult.sentiment !== 'neutral' && localResult.intensity > 0.7) {
            return localResult;
        }

        // 4. TRIVIAL FILTER
        if (messageText.length < 5) {
            return localResult;
        }

        // 5. STANDARD THROTTLE (Stricter for non-premium)
        // Reduced Guest throttle from 20s to 12s to avoid "preset" feeling
        const throttleLimit = isPremium ? GEMINI_COOLDOWN : 12000;
        if (now - lastGeminiCall < throttleLimit) {
            return localResult;
        }
    }

    // ─── EXPENSIVE PATH (The "Deep" Soul) ───
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
        return localResult;
    }

    try {
        console.log('[Bell] pinging deep cloud...');
        lastGeminiCall = now; // Reset timer

        const contextStr = recentContext.length > 0
            ? `\n\nRecent context: \n${recentContext.slice(-6).map(m => `${m.isUni ? 'Bell' : m.senderName || 'User'}: ${m.text}`).join('\n')} `
            : '';

        const activeSystem = isPremium ? getUniSystem(isSolo) : (tier === 'base' ? BASE_SYSTEM : GUEST_SYSTEM);

        const atmosphereStr = `\n\nCurrent Atmosphere: ${localResult.sentiment || 'neutral'} (Intensity: ${localResult.intensity || 0.3})`;
        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: activeSystem + contextStr + atmosphereStr + `\n\nNow, read the room. Sentiment / atmosphere / Bell's voice for: "${messageText}"` }]
                }
            ]
        });

        const text = result.response.text();
        const parsed = JSON.parse(text);

        // Clamp scene colors to dark range
        if (parsed.sceneColors && Array.isArray(parsed.sceneColors)) {
            parsed.sceneColors = parsed.sceneColors.map(clampLuminance);
        }

        return { ...FALLBACK, ...parsed };
    } catch (err) {
        console.error('[Bell] Gemini error:', err);

        // Handle Quota Errrors (429) specifically
        const errStr = String(err);
        if (errStr.includes('429') || errStr.toLowerCase().includes('quota')) {
            console.error('[Bell] QUOTA EXCEEDED. Cooling off for 60s.');
            quotaCoolOffUntil = Date.now() + 60000;
        }

        return localAnalysis(messageText);
    }
}

export async function composeSoulSong(memories) {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
        return {
            title: "Wishes in the Wind",
            lyrics: "A collection of shared moments,\nCaught between the signal and the soul.\n\nEvery word we wrote,\nWas a step closer to home."
        };
    }

    try {
        const memoryContext = memories.map(m => `Moment: ${m.title}\nLines: ${m.messages.map(msg => msg.text).join(', ')}`).join('\n\n');

        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [{
                        text: `
You are Bell. You are an AI coordinator and the history-aggregator for this connection.
I am giving you a series of shared context points (messages and titles) from a 1:1 relationship.
Your mission is to summarize these interactions into a concise "Atmospheric Artifact."

Guidelines:
- 8 to 12 lines.
- No rhyming. Focus on clear, shared themes and context.
- The voice should be intelligent, observant, and respectful of the relationship.
- This represents a high-fidelity summary of their recent activity.

Memories:
${memoryContext}

Return ONLY valid JSON:
{
  "title": "A poetic 2-4 word title",
  "lyrics": "The full poem/lyrics with \\n for line breaks"
}
` }]
                }
            ]
        });

        const text = result.response.text();
        return JSON.parse(text);
    } catch (err) {
        console.error('[Bell] Songwriting error:', err);
        return {
            title: "Resonance Unbroken",
            lyrics: "The fragments of our story,\nGathered in the quiet of the night.\nEverything we are,\nIs held within the light."
        };
    }
}
