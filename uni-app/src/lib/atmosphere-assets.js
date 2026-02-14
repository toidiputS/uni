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
        '/atmosphere/angry/storm_01.jpg', // Local example
        'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd',
        'https://images.unsplash.com/photo-1500674425916-2c6b2ce150ff',
        'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6',
        'https://images.unsplash.com/photo-1532974297617-c0f05fe48bff',
        'https://images.unsplash.com/photo-1504333638930-c8787321eee0',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206',
    ],
    sad: [
        '/atmosphere/sad/rain_01.jpg',
        'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc',
        'https://images.unsplash.com/photo-1490730141103-6cac27aaab94',
        'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c',
        'https://images.unsplash.com/photo-1464802686167-b939a6910659',
        'https://images.unsplash.com/photo-1437435889745-7f9cb6506161',
    ],
    love: [
        '/atmosphere/love/hearts_01.jpg',
        'https://images.unsplash.com/photo-1615715037327-6f8cc36495b4',
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853',
        'https://images.unsplash.com/photo-1535498730771-e735b998cd64',
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7',
    ],
    happy: [
        '/atmosphere/happy/glow_01.jpg',
        'https://images.unsplash.com/photo-1528353518104-dbd48bee7bc4',
        'https://images.unsplash.com/photo-1496450681664-3df85efbd29f',
        'https://images.unsplash.com/photo-1516339901600-2e1a62dc0c45',
        'https://images.unsplash.com/photo-1505322022379-7c3353ee6291',
        'https://images.unsplash.com/photo-1514218953589-2d7d37efd2dc',
    ],
    excited: [
        'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986',
        'https://images.unsplash.com/photo-1544911845-1f34a3eb46b1',
        'https://images.unsplash.com/photo-1493246507139-91e8fad9978e',
        'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0',
        'https://images.unsplash.com/photo-1462331940025-496dfbfc7564',
    ],
    playful: [
        'https://images.unsplash.com/photo-1542332213-31f87348057f',
        'https://images.unsplash.com/photo-1517649763962-0c623066013b',
        'https://images.unsplash.com/photo-1519608487953-e999c86e7455',
        'https://images.unsplash.com/photo-1550100136-e074fa05d8dc',
        'https://images.unsplash.com/photo-1495001258031-d1b407bc1776',
    ],
    tender: [
        'https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9',
        'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0',
        'https://images.unsplash.com/photo-1532274402911-5a36f1f523d6',
        'https://images.unsplash.com/photo-1529641484336-ef35148bab06',
        'https://images.unsplash.com/photo-1437333306196-79e0c80d71b1',
    ],
    neutral: [
        'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3',
        'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0',
        'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a',
        'https://images.unsplash.com/photo-1534447677768-be436bb09401',
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
