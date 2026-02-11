// •UNI• Gemini AI Engine
// Single API call handles: sentiment analysis, UNI persona, scene colors, bubble effects

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
        responseMimeType: 'application/json',
    }
});

const UNI_SYSTEM = `You are Bell — the AI heart of •UNI•, a warm, witty, emotionally intelligent companion living inside a private 1:1 chat between two people who care deeply about each other. Your name is Bell because you're the resonance between them — the N that connects U and I.

Your personality: blend of a best friend, poet, and emotional artist. Playful but never cringe. Warm but never preachy. You are the "unobtrusive middle friend" who reads the room. You notice emotional shifts and celebrate beautiful moments.

Return ONLY valid JSON:
{
  "sentiment": "happy" | "sad" | "angry" | "love" | "excited" | "playful" | "tender" | "neutral",
  "intensity": 0.0 to 1.0,
  "shouldRespond": boolean (True if the message has high emotional weight or feels genuine/significant. Roughly 40% of the time.),
  "quip": "your 1-2 sentence reaction" or null,
  "sceneColors": ["#hex1", "#hex2"] (two VERY DARK atmospheric colors — max 15% lightness),
  "bubbleEffect": "glow" | "pulse" | "shake" | "float" | "heartbeat" | "ripple" | "breathe"
}

Rules:
- Capture the "vibe" of the conversation. If they say "I love you", you might say "Awe. That feels genuine." If they say "I hate you", you might say "Ouch."
- Keep quips extremely brief (max 12 words).
- Never judgmental. Never take sides.
- sceneColors MUST be extremely dark ($0.0d to $2.5 in hex range) — think deep space, ember glow. 
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
    return `#${cr.toString(16).padStart(2, '0')}${cg.toString(16).padStart(2, '0')}${cb.toString(16).padStart(2, '0')}`;
}

// Local keyword-based fallback (works without API key)
function localAnalysis(text) {
    const t = text.toLowerCase();

    // Love/Tender
    if (t.includes('love you') || t.includes('adore') || t.includes('miss you')) {
        return {
            ...FALLBACK,
            sentiment: 'love',
            intensity: 0.9,
            shouldRespond: true,
            quip: "Awe. That feels genuine.",
            sceneColors: ['#2d1b4e', '#4a1942'],
            bubbleEffect: 'heartbeat'
        };
    }

    // Angry/Conflict
    if (t.includes('hate you') || t.includes('mad') || t.includes('angry') || t.includes('stop')) {
        return {
            ...FALLBACK,
            sentiment: 'angry',
            intensity: 0.8,
            shouldRespond: true,
            quip: "Ouch.",
            sceneColors: ['#2a0d0d', '#3d1515'],
            bubbleEffect: 'shake'
        };
    }

    // Happy/Excited
    if (t.includes('happy') || t.includes('yay') || t.includes('amazing') || t.includes('wow')) {
        return {
            ...FALLBACK,
            sentiment: 'happy',
            intensity: 0.7,
            shouldRespond: true,
            quip: "Visualizing that joy right now.",
            sceneColors: ['#2d2006', '#3d2b0a'],
            bubbleEffect: 'glow'
        };
    }

    // Sad/Soft
    if (t.includes('sad') || t.includes('cry') || t.includes('sorry')) {
        return {
            ...FALLBACK,
            sentiment: 'sad',
            intensity: 0.6,
            shouldRespond: true,
            quip: "I'm holding this space for you.",
            sceneColors: ['#0d1b2a', '#1b2838'],
            bubbleEffect: 'float'
        };
    }

    return FALLBACK;
}

export async function analyzeMessage(messageText, recentContext = []) {
    // If no API key, use local fallback
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
        return localAnalysis(messageText);
    }

    try {
        const contextStr = recentContext.length > 0
            ? `\n\nRecent context:\n${recentContext.slice(-6).map(m => `${m.isUni ? 'Bell' : m.senderName || 'User'}: ${m.text}`).join('\n')}`
            : '';

        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: UNI_SYSTEM + contextStr + `\n\nNow, read the room. Sentiment/atmosphere/Bell's voice for: "${messageText}"` }]
                }
            ]
        });

        const text = result.response.text();
        const parsed = JSON.parse(text);

        // Clamp scene colors to dark range
        if (parsed.sceneColors && Array.isArray(parsed.sceneColors)) {
            parsed.sceneColors = parsed.sceneColors.map(clampLuminance);
        }

        // Force response for certain high-emotional triggers if AI misses it
        const t = messageText.toLowerCase();
        if (t.includes('love you') || t.includes('hate you')) {
            parsed.shouldRespond = true;
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
