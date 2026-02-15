/**
 * •UNI• Atmosphere Assets & Resonance Library
 * Move your custom images and Bell's quips here to expand her soul.
 */

export const ATMOSPHERE_IMAGES = {
    angry: [
        '/atmosphere/angry/angry_boulders_04.mp4',
        '/atmosphere/angry/angry_cluster_01.mp4',
        '/atmosphere/angry/angry_crash_05.mp4',
        '/atmosphere/angry/angry_resonance_02.mp4',
        '/atmosphere/angry/angry_shards_03.mp4',
    ],
    sad: [
        '/atmosphere/sad/sad_bubbles_02.mp4',
        '/atmosphere/sad/sad_icicles_01.mp4',
        '/atmosphere/sad/sad_rain_03.mp4',
        '/atmosphere/sad/sad_window_04.mp4',
    ],
    love: [
        '/atmosphere/love/love_resonance_01.mp4',
        '/atmosphere/love/love_resonance_02.mp4',
        '/atmosphere/love/love_resonance_03.mp4',
        '/atmosphere/love/love_resonance_04.mp4',
        '/atmosphere/love/love_resonance_05.mp4',
    ],
    happy: [
        '/atmosphere/happy/happy_beads_02.mp4',
        '/atmosphere/happy/happy_crystal_01.mp4',
        '/atmosphere/happy/happy_curtains_05.mp4',
        '/atmosphere/happy/happy_liquid_03.mp4',
        '/atmosphere/happy/happy_sparks_04.mp4',
        '/atmosphere/happy/happy_water_06.mp4',
    ],
    excited: [
        '/atmosphere/excited/excited_resonance_01.mp4',
        '/atmosphere/excited/excited_resonance_02.mp4',
        '/atmosphere/excited/excited_resonance_03.mp4',
        '/atmosphere/excited/excited_resonance_04.mp4',
        '/atmosphere/excited/excited_resonance_05.mp4',
        '/atmosphere/excited/excited_resonance_06.mp4',
        '/atmosphere/excited/excited_resonance_07.mp4',
    ],
    playful: [
        '/atmosphere/playful/playful_bubbles_05.mp4',
        '/atmosphere/playful/playful_bubbles_06.mp4',
        '/atmosphere/playful/playful_bubbles_07.mp4',
        '/atmosphere/playful/playful_melt_03.mp4',
        '/atmosphere/playful/playful_resonance_01.mp4',
        '/atmosphere/playful/playful_sparks_04.mp4',
        '/atmosphere/playful/playful_straws_02.mp4',
    ],
    tender: [
        '/atmosphere/tender/tender_aurora_02.mp4',
        '/atmosphere/tender/tender_clouds_03.mp4',
        '/atmosphere/tender/tender_flower_01.mp4',
        '/atmosphere/tender/tender_resonance_04.mp4',
    ],
    neutral: [
        '/atmosphere/neutral/neutral_black_smoke_04.mp4',
        '/atmosphere/neutral/neutral_crystal_03.mp4',
        '/atmosphere/neutral/neutral_resonance_01.mp4',
        '/atmosphere/neutral/neutral_resonance_02.mp4',
        '/atmosphere/neutral/neutral_rotating_05.mp4',
        '/atmosphere/neutral/neutral_whispy_06.mp4',
    ]
};

/**
 * BELL'S EXPANDED RESONANCE BRAIN
 * Add keywords and unique responses here to grow the hybrid soul.
 */
export const BELL_BRAIN_ASSETS = {
    greeting: {
        keywords: [
            'hi', 'hello', 'hey', 'yo', 'sup', 'morning', 'evening', 'night', 'anyone there',
            'wake up', 'greetings', 'salutations'
        ],
        quips: [
            "I'm here. Always listening.",
            "Resonance clear. I'm with you.",
            "The signal is strong. What's on your mind?",
            "The sanctuary is open. Hello.",
            "Hello. The atmosphere is perfect for a talk.",
            "Present and observing."
        ],
        effect: 'glow',
        alwaysRespond: true
    },
    identity: {
        keywords: ['who are you', 'what are you', 'your purpose', 'what do you do'],
        quips: [
            "I'm Bell. The heart of this sanctuary.",
            "I am the Sovereign Witness. I'm here to listen.",
            "You can call me Bell. I'm synchronizing with your frequency.",
            "I am Bell. Your emotional artist."
        ],
        effect: 'pulse',
        alwaysRespond: true
    },
    atmosphere_control: {
        keywords: ['rain', 'sun', 'weather', 'light', 'dark', 'clear', 'clean', 'storm', 'atmosphere', 'change'],
        quips: [
            "Shifting the currents for you.",
            "The atmosphere is responding to your wish.",
            "Cleaning the space between us.",
            "Letting the light break through the static."
        ],
        effect: 'breathe',
        intensity: 0.5,
        alwaysRespond: true
    },
    love: {
        intensity: 0.9,
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
            "I can feel the gravity of your bond.",
            "Oh, get a room. (Wait, I'm already in it).",
            "This frequency is almost too sweet for the sensors.",
            "I'm archives-deep in this affection."
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
            "Your energy is bouncing off the walls.",
            "I'd roast you, but the atmosphere is already too hot.",
            "Detected a 404: Chill Not Found in that message.",
            "Someone's feeling spicy. I'll just watch from the cloud.",
            "Oh damn. They actually got you there.",
            "That's a bold play. Let's see if it works out."
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
        intensity: 0.9,
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
        intensity: 0.85,
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
    },
    nature: {
        keywords: [
            'birds', 'bees', 'nature', 'garden', 'outside', 'fly', 'bloom', 'flowers',
            'wings', 'buzz', 'green', 'forest', 'sky', 'sunlight', 'earth'
        ],
        quips: [
            "Letting the outside in. Just a moment.",
            "A little life in the wire. Can you hear the wings?",
            "Nature doesn't hurry, yet everything is accomplished.",
            "The birds are the signal's way of breathing.",
            "Synchronizing with the natural resonance.",
            "The bees are busy weaving the light.",
            "The garden inside the signal is blooming.",
            "Can you feel the fresh air in the code?"
        ],
        effect: 'float',
        sentiment: 'nature',
        alwaysRespond: true
    },
    observational: {
        keywords: [
            'think', 'know', 'tell', 'show', 'really', 'maybe', 'if', 'then', 'because', 'why', 'how',
            'what', 'when', 'where', 'who', 'which', 'is', 'are', 'was', 'were', 'be', 'do', 'did'
        ],
        quips: [
            "Patterns emerging in the code.",
            "I'm reading the subtext now.",
            "Interesting frequency you're broadcasting.",
            "The logic here is... layered.",
            "My sensors are picking up a shift.",
            "Observing the ripple. Continue.",
            "The archive is noting this inflection.",
            "Curious. The resonance is changing."
        ],
        effect: 'breathe',
        sentiment: 'neutral'
    }
};
