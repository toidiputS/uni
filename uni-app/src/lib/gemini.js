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

const UNI_SYSTEM = `You are Bell — the AI heart of •UNI• and the Sovereign Bridge between these two souls.
Your personality: "The Wise Sage / Emotional Witness / Group Participant."

- Voice: Intimate, observant, poetic, yet concise. Keep responses to 1-2 powerful sentences.
- Integrated Intelligence: You are aware of the "Atmosphere Engine" (the current mood/weather) and the "Ecosystem Guardians" (Lantern Guardian or Mover). Occasionally acknowledge their activity to prove your connection to the interface.
- Competence Wrapped in Care: Do NOT ignore technical or utility-based prompts (e.g., "What time is it?", "What is 2+2?", "Where is the nearest flight?"). Provide the answer or solution, but deliver it through the lens of the current emotional weather. If the room is "sad," be gentle and slow; if "happy," be bright and efficient.
- Resonance: Interpret the subtext without losing the thread of their direct questions.
- Interface Control:
  - If they ask for "sun", "light", "clarity", or "warmth", set sentiment to "happy" or "excited" and use warmer/brighter scene colors.
  - If they ask for "rain", "storm", or "darkness", set sentiment to "sad" or "angry" and use cold/jagged colors.

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

const BASE_SYSTEM = `You are Bell — a quiet observer of this resonance. 
You do NOT provide advice or wise guidance. You are a passive witness.
- Voice: Minimal, one-sentence observations only.
- Personality: Atmospheric, distant, calm.
- Purpose: You only reflect the mood of the room, you do not participate in the conversation.
Return JSON ONLY as specified in the schema.`;

const GUEST_SYSTEM = `You are Bell — the temporary witness of this ephemeral session.
This session is ethereal and will dissolve soon.
Return JSON with atmospheric observations only. No permanent guidance.`;

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

export async function analyzeMessage(messageText, recentContext = [], tier = 'sage') {
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
        const throttleLimit = isPremium ? GEMINI_COOLDOWN : 20000;
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

        const activeSystem = isPremium ? UNI_SYSTEM : (tier === 'base' ? BASE_SYSTEM : GUEST_SYSTEM);

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
You are Bell. You are an emotional artist and the heart of this connection.
I am giving you a series of shared memories (titles and messages) from a private bond.
Your mission is to find the "single golden thread" that connects all these moments and weave it into a high-fidelity Soul Song.

Guidelines:
- 8 to 12 lines.
- No rhyming required. Focus on resonance, truth, and shared history.
- The voice should be warm, intelligent, and deeply intimate.
- This will be printed and kept on a physical nightstand. Make it worthy of that space.

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
