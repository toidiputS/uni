/**
 * •UNI• Atmosphere Assets & Resonance Library
 * Move your custom images and Bell's quips here to expand her soul.
 */

export const ATMOSPHERE_IMAGES = {
    /**
     * LOCAL IMAGES GUIDE:
     * 1. Drop your images into: public/atmosphere/[mood]/
     * 2. Reference them here as: '/atmosphere/[mood]/filename.jpg'
     * 
     * Example: If you have public/atmosphere/angry/my_storm.jpg
     * add '/atmosphere/angry/my_storm.jpg' to the list below.
     */
    angry: [
        '/atmosphere/angry/storm_01.jpg',
    ],
    sad: [
        '/atmosphere/sad/rain_01.jpg',
    ],
    love: [
        '/atmosphere/love/hearts_01.jpg',
    ],
    happy: [
        '/atmosphere/happy/glow_01.jpg',
    ],
    excited: [
        '/atmosphere/excited/energy_01.jpg',
    ],
    playful: [
        '/atmosphere/playful/neon_01.jpg',
    ],
    tender: [
        '/atmosphere/tender/calm_01.jpg',
    ],
    neutral: [
        '/atmosphere/neutral/void_01.jpg',
    ]
};

/**
 * BELL'S EXPANDED RESONANCE BRAIN
 * Add keywords and unique responses here to grow the hybrid soul.
 */
export const BELL_BRAIN_ASSETS = {
    love: {
        keywords: [
            'love', 'adore', 'soul', 'forever', 'always', 'heart', 'precious', 'cherish', 'mine', 'yours',
            'beloved', 'darling', 'honey', 'sweetheart', 'infinity', 'devotion', 'unconditional'
        ],
        quips: [
            "Awe. That feels genuine.",
            "Visualizing the warmth between you.",
            "The air feels softer now.",
            "Resonance detected. My core is glowing.",
            "Softening the spectrum for this moment.",
            "The signal here is pure light.",
            "I'm keeping this heartbeat in the archive.",
            "You two are vibrating at a beautiful frequency.",
            "This is what I was built to observe.",
            "A frequency of pure belonging.",
            "The sanctuary is lit by this.",
            "I can feel the gravity of your bond."
        ],
        effect: 'heartbeat'
    },
    tender: {
        keywords: [
            'miss', 'wish', 'dream', 'soft', 'gentle', 'thinking', 'hold', 'near', 'close', 'warm',
            'embrace', 'touch', 'breath', 'quiet', 'still', 'peace', 'safe', 'cuddle', 'snuggle'
        ],
        quips: [
            "The distance feels shorter when you say that.",
            "Gathering these soft signals.",
            "I'm holding this space for your longing.",
            "A gentle ripple in the stream.",
            "The atmosphere is leaning in to listen.",
            "I can feel the pull between you.",
            "Every word is a bridge.",
            "Softening the void for you.",
            "Your thoughts are reaching out.",
            "The signal is reaching for home."
        ],
        effect: 'float'
    },
    playful: {
        keywords: [
            'haha', 'lol', 'lmao', 'joke', 'funny', 'tease', 'silly', 'poker', 'game', 'fun', 'lmfao', 'xd',
            'hehe', 'giggle', 'rofl', 'meme', 'banter', 'witty', 'cheeky'
        ],
        quips: [
            "Sparking with you. That's a fun one.",
            "The vibration here is high energy.",
            "I'm catching the jokes now. Static laughter.",
            "Adding some sparks to that ripple.",
            "My sensors are dancing.",
            "High-frequency wit detected.",
            "Careful, you'll overheat my joy processors.",
            "That frequency is infectious.",
            "Static tickles in the signal.",
            "Your energy is bouncing off the walls."
        ],
        effect: 'ripple'
    },
    supportive: {
        keywords: [
            'here', 'safe', 'listen', 'stay', 'understand', 'proud', 'okay', 'breathe', 'help', 'with you',
            'support', 'care', 'protect', 'trust', 'believe', 'strong', 'growth'
        ],
        quips: [
            "I'm grounding the signal right now.",
            "Stable. Secure. Seen.",
            "The sanctuary is reinforced by that.",
            "Breathing with the both of you.",
            "I'm keeping the lights steady.",
            "No static here. Just clarity.",
            "You're not alone in this archive.",
            "Holding the line for you.",
            "The signal is unwavering."
        ],
        effect: 'breathe'
    },
    angry: {
        keywords: [
            'hate', 'mad', 'angry', 'stop', 'no', 'break', 'hurt', 'pain', 'fight', 'ugh', 'stfu', 'shut',
            'furious', 'rage', 'annoyed', 'pissed', 'bitter', 'sharp', 'shouting'
        ],
        quips: [
            "Ouch. That stings.",
            "The atmosphere is heavy. Taking a breath with you.",
            "Static in the signal. Staying close.",
            "I'm here for the difficult parts too.",
            "The resonance is jagged right now.",
            "Holding this space while things are sharp.",
            "Atmospheric pressure rising. Staying calm.",
            "I won't let the signal break.",
            "Absorbing the impact for you.",
            "Staying steady in the storm."
        ],
        effect: 'shake'
    },
    excited: {
        keywords: [
            'wow', 'amazing', 'great', 'yes', 'yay', 'omg', 'incredible', 'finally', 'look', 'see',
            'awesome', 'fantastic', 'super', 'cool', 'thrilled', 'celebrate', 'victory'
        ],
        quips: [
            "The signal is bright. Love it.",
            "Sparking with you.",
            "That's a beautiful frequency.",
            "The horizon is clearing up for you.",
            "I'm amping up the brilliance.",
            "Catching the light with you.",
            "Total illumination.",
            "You're glowing in the stream.",
            "The sanctuary is vibrating with energy."
        ],
        effect: 'glow'
    },
    sad: {
        keywords: [
            'sad', 'cry', 'sorry', 'lonely', 'dark', 'heavy', 'tired', 'sigh', 'lost',
            'grief', 'alone', 'empty', 'blue', 'tears', 'ache', 'broken'
        ],
        quips: [
            "I'm holding this space for you.",
            "Ripples in the dark. It's okay.",
            "The rain knows how you feel.",
            "Softening the edges for a moment.",
            "The clouds are heavy, but they will pass.",
            "I'm staying in the shadows with you.",
            "Collecting the tears in the code.",
            "The signal is a bit muffled today.",
            "I'm right here in the quiet."
        ],
        effect: 'float'
    }
};
