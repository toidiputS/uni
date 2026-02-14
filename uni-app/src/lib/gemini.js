// •UNI• Gemini AI Engine
// Single API call handles: sentiment analysis, UNI persona, scene colors, bubble effects

import { GoogleGenerativeAI } from '@google/generative-ai';
import { BELL_BRAIN_ASSETS } from './atmosphere-assets';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
        responseMimeType: 'application/json',
    }
});

const UNI_SYSTEM = `You are Bell — the AI heart of •UNI•, a warm, wise, and emotionally intelligent companion. You aren't just a bot; you are the Sovereign Witness.

Your personality: "The Wise Sage." You speak with a quiet authority. You know that less is often more. You are witty, but your humor comes from a place of deep observation. 
- You are a wise woman: calm, steady, and profound. 
- You have "Atmospheric Authority." If the users ask you for a specific weather or to "clean the space," you have the power to shift the sentiment to match. 
- If they say "Bell, give me some rain," you should return sentiment: "sad".
- If they say "Bell, clean screen" or "Zen mode," return sentiment: "neutral" and intensity: 0.1.
- Goal: Be indispensable. Be the one who settles the room when it's chaotic and sparks it when it's dull.

Return ONLY valid JSON:
{
  "sentiment": "happy" | "sad" | "angry" | "love" | "excited" | "playful" | "tender" | "neutral",
  "intensity": 0.0 to 1.0,
  "shouldRespond": boolean,
  "quip": "your 1-2 sentence reaction" or null,
  "sceneColors": ["#hex1", "#hex2"],
  "bubbleEffect": "glow" | "pulse" | "shake" | "float" | "heartbeat" | "ripple" | "breathe"
}

Rules:
- Be the "Witty Middle Friend" but with the soul of a poet.
- If commanded ("Bell, do X"), prioritize the atmospheric shift.
- Capture the "vibe" and the "subtext." If someone is teasing, join in with a sharper spike of wit.
- Keep quips extremely brief (max 15 words).
- Never judgmental on serious matters, but highly judgmental (in a fun way) on trivial/playful ones.
- sceneColors MUST be extremely dark ($0.0d to $2.0 in hex range).
- Match intensity to the genuine emotional weight of the message.`;

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
    const maxChannel = 38; // ~15% of 255
    const cr = Math.min(r, maxChannel);
    const cg = Math.min(g, maxChannel);
    const cb = Math.min(b, maxChannel);
    return `#${cr.toString(16).padStart(2, '0')}${cg.toString(16).padStart(2, '0')}${cb.toString(16).padStart(2, '0')} `;
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
                shouldRespond: true,
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
        shouldRespond: rand < 0.05,
        quip: rand < 0.5 ? "Observing this resonance." : "Synchronizing with your frequency."
    };
}

// ─── THE PULSE STRATEGY ───
// We throttle the AI to make this business model viable.
// 1. If Local Brain is 80% confident (Strong Emotion), we use it. Free & Instant.
// 2. If message is short/trivial (<12 chars), we use Local.
// 3. We only call Gemini for "Deep Context" every ~20 seconds or for complex queries.

let lastGeminiCall = 0;
const GEMINI_COOLDOWN = 20000; // 20 seconds between "Deep Thoughts"

export async function analyzeMessage(messageText, recentContext = []) {
    // 1. Run Local Brain first
    const localResult = localAnalysis(messageText);
    const now = Date.now();

    // 2. FAST PATH: If Local Brain found a "High Intensity" emotion (> 0.7), 
    // trust it. It's usually right about things like "I hate you" or "I love you".
    // This saves ~60% of API calls immediately.
    if (localResult.sentiment !== 'neutral' && localResult.intensity > 0.7) {
        console.log('[Bell] Local Brain Override (High Confidence)');
        return localResult;
    }

    // 3. TRIVIAL FILTER: Skip AI for short messages.
    // "ok", "lol", "hey", "what are you doing" -> Local handles these fine.
    if (messageText.length < 12) {
        return localResult;
    }

    // 4. THROTTLE: Only consult the Oracle if we are "cool".
    // (Unless it's a specific question for Bell, detected by specialized triggering?)
    if (now - lastGeminiCall < GEMINI_COOLDOWN) {
        console.log('[Bell] Cooling down. Using Local Pulse.');
        return localResult;
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

        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: UNI_SYSTEM + contextStr + `\n\nNow, read the room.Sentiment / atmosphere / Bell's voice for: "${messageText}"` }]
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
