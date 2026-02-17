// •UNI• CGEI Particle System
import { ATMOSPHERE_IMAGES } from './atmosphere-assets.js';
// The emotional atmosphere expressed through motion
// Each particle type represents a feeling made visible

// ─── Particle Factory ───

export function createRaindrop(canvasW, canvasH, intensity = 0.7) {
    const speed = 10 + Math.random() * 12 * intensity; // Faster, more weight
    const wind = -0.8 + Math.random() * 0.4;
    return {
        type: 'rain',
        x: Math.random() * (canvasW + 200) - 100,
        y: -50,
        vx: wind,
        vy: speed,
        life: 1,
        maxLife: 1,
        size: 1.2 + Math.random() * 2.0 * intensity, // Thicker drops
        length: 25 + Math.random() * 35 * intensity, // Much longer streaks
        opacity: 0.2 + Math.random() * 0.3 * intensity, // More present
        color: '200, 230, 255', // Shimmering silver-blue
    };
}

export function createHeart(x, y, canvasW) {
    const drift = (Math.random() - 0.5) * 4;
    const size = 6 + Math.random() * 20;
    // CGEI Evolution: Random heart styles (filled, outline, wide, tall)
    const style = Math.random() > 0.5 ? 'filled' : 'outline';
    const shapeBias = 0.8 + Math.random() * 0.4; // Varied proportions

    return {
        type: 'heart',
        x: x || Math.random() * canvasW,
        y: y || canvasW,
        vx: drift,
        vy: -(0.5 + Math.random() * 1.5),
        life: 1,
        maxLife: 1,
        size,
        style,
        shapeBias,
        opacity: 0.2 + Math.random() * 0.5,
        color: Math.random() > 0.8 ? '255, 100, 200' : '255, 150, 180', // Vibrant variety
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.02 + Math.random() * 0.04,
        rotation: (Math.random() - 0.5) * 0.2,
        vr: (Math.random() - 0.5) * 0.01
    };
}

export function createMelt(x, y, color) {
    return {
        type: 'melt',
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 1 + Math.random() * 2,
        life: 1,
        maxLife: 1,
        size: 2 + Math.random() * 4,
        opacity: 0.6,
        color: color || '255, 255, 255',
        gravity: 0.05
    };
}

export function createPop(x, y, color) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 6;
    return {
        type: 'pop',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        size: 1 + Math.random() * 3,
        opacity: 1,
        color: color || '255, 255, 255',
        decay: 0.05 + Math.random() * 0.05
    };
}

export function createSpark(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 4;
    return {
        type: 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        size: 2 + Math.random() * 3,
        opacity: 0.8 + Math.random() * 0.2,
        color: '255, 180, 50',
        decay: 0.015 + Math.random() * 0.02,
    };
}

export function createFirefly(canvasW, canvasH) {
    return {
        type: 'firefly',
        x: Math.random() * canvasW,
        y: Math.random() * canvasH,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        life: 1,
        maxLife: 1,
        size: 1 + Math.random() * 1.5,
        opacity: 0,
        targetOpacity: 0.3 + Math.random() * 0.4,
        color: '255, 220, 100',
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.005 + Math.random() * 0.01,
        wanderAngle: Math.random() * Math.PI * 2,
    };
}

export function createDrop(canvasW) {
    return {
        type: 'drop',
        x: Math.random() * canvasW,
        y: -5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0.8 + Math.random() * 1.2,
        life: 1,
        maxLife: 1,
        size: 3 + Math.random() * 4,
        opacity: 0.2 + Math.random() * 0.2,
        color: '100, 140, 255',
    };
}

export function createCloud(canvasW, canvasH) {
    return {
        type: 'cloud',
        x: -600 + Math.random() * (canvasW + 1200),
        y: -150 + Math.random() * canvasH * 0.2, // Pinned to "North Side" (Top 20%)
        vx: 0.1 + Math.random() * 0.2, // Slightly faster drift
        vy: 0,
        life: 1,
        maxLife: 1,
        size: 500 + Math.random() * 600, // Even more massive
        opacity: 0,
        targetOpacity: 0.25 + Math.random() * 0.2, // Significant presence (~20% screen feel)
        color: '100, 100, 120', // Stronger grey-blue
        fadeSpeed: 0.002,
    };
}

export function createBird(canvasW, canvasH) {
    const fromLeft = Math.random() > 0.5;
    return {
        type: 'bird',
        x: fromLeft ? -50 : canvasW + 50,
        y: 20 + Math.random() * canvasH * 0.5, // Wider vertical range
        vx: fromLeft ? (1.2 + Math.random() * 2.5) : -(1.2 + Math.random() * 2.5),
        vy: (Math.random() - 0.5) * 0.5,
        life: 1,
        maxLife: 1,
        size: 15 + Math.random() * 10, // Much larger and more majestic
        opacity: 0.3 + Math.random() * 0.4,
        color: Math.random() > 0.8 ? '200, 200, 255' : (Math.random() > 0.5 ? '180, 180, 200' : '150, 150, 170'),
        wingPhase: Math.random() * Math.PI * 2,
        wingSpeed: 0.03 + Math.random() * 0.03, // Slower, more graceful wings
    };
}

export function createBee(canvasW, canvasH) {
    const fromLeft = Math.random() > 0.5;
    return {
        type: 'bee',
        x: fromLeft ? -20 : canvasW + 20,
        y: 50 + Math.random() * canvasH * 0.6,
        vx: fromLeft ? (0.8 + Math.random() * 1.5) : -(0.8 + Math.random() * 1.5),
        vy: (Math.random() - 0.5) * 0.4,
        life: 1,
        maxLife: 1,
        size: 0.8 + Math.random() * 1.2, // Slightly more visible
        opacity: 0.6,
        color: '255, 210, 80',
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.15 + Math.random() * 0.2,
        vibrateRange: 1 + Math.random() * 1
    };
}

export function createEcosystemGuardian(canvasW, canvasH) {
    const fromLeft = Math.random() > 0.5;
    const personas = ['lantern', 'mover', 'lovers', 'observer'];
    let persona = personas[Math.floor(Math.random() * personas.length)];

    const side = Math.random() > 0.5 ? 'white' : 'black';
    const color = side === 'white' ? '255, 255, 255' : '0, 0, 0';

    return {
        type: 'guardian',
        persona,
        side,
        x: fromLeft ? -100 : canvasW + 100,
        y: canvasH - 60 - Math.random() * 60,
        vx: fromLeft ? (0.4 + Math.random() * 0.5) : -(0.4 + Math.random() * 0.5),
        vy: 0,
        life: 1,
        maxLife: 1,
        size: 14 + Math.random() * 10,
        opacity: 0,
        targetOpacity: 0.02 + Math.random() * 0.02, // Bioluminescent fading
        color,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.02 + Math.random() * 0.03,
        fadeSpeed: 0.005,
        behaviorTimer: 0,
        state: 'moving',
        hasLantern: persona === 'lantern'
    };
}

export function createBounce(canvasW, canvasH) {
    return {
        type: 'bounce',
        x: Math.random() * canvasW,
        y: Math.random() * canvasH,
        vx: (Math.random() - 0.5) * 2,
        vy: -(2 + Math.random() * 3),
        life: 1,
        maxLife: 1,
        size: 3 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.3,
        color: '168, 224, 99',
        gravity: 0.06,
    };
}

export function createEnergy(originX, originY, targetX, targetY, color) {
    return {
        type: 'energy',
        x: originX,
        y: originY,
        tx: targetX,
        ty: targetY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        maxLife: 1,
        size: 2 + Math.random() * 2,
        opacity: 0.5, // Fainter, more ghost-like
        color: color || '220, 220, 255',
        speed: 0.02 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
        oscFreq: 0.05 + Math.random() * 0.1
    };
}

export function createMorphingBubble(x, y, w, h, color, isBurst = false) {
    return {
        type: 'morph',
        x, y, w, h,
        life: 1.0,
        phase: Math.random() * Math.PI * 2,
        color: color || '255, 255, 255',
        speed: isBurst ? 0.01 + Math.random() * 0.01 : 0.002 + Math.random() * 0.003,
        isBurst
    };
}


// ─── Shape Helpers ───

function drawHeart(ctx, x, y, size, color, opacity, style = 'filled', shapeBias = 1, rotation = 0) {
    const s = size * 0.5;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(shapeBias, 1 / shapeBias);

    ctx.beginPath();
    ctx.moveTo(0, s * 0.4);
    ctx.bezierCurveTo(0, -s * 0.2, -s, -s * 0.6, -s, s * 0.1);
    ctx.bezierCurveTo(-s, s * 0.6, 0, s * 0.9, 0, s * 1.1);
    ctx.bezierCurveTo(0, s * 0.9, s, s * 0.6, s, s * 0.1);
    ctx.bezierCurveTo(s, -s * 0.6, 0, -s * 0.2, 0, s * 0.4);

    if (style === 'filled') {
        ctx.fillStyle = `rgba(${color}, ${opacity})`;
        ctx.fill();
    } else {
        ctx.strokeStyle = `rgba(${color}, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
    ctx.restore();
}


// ─── Weather Presets ───

export const WEATHER_PRESETS = {
    angry: {
        sky: ['#1a0505', '#200808'],
        skyImages: ATMOSPHERE_IMAGES.angry,
        keywords: 'storm,dark,thunder,lightning,void,chaos,abstract',
        particles: {
            rain: { count: 600, spawnRate: 20 },
            cloud: { count: 18, spawnRate: 0.12 },
            guardian: { count: 1, spawnRate: 0.05 }, // Rare witness in the storm
        },
        lightning: true,
        lightningInterval: [1500, 4000],
    },
    sad: {
        sky: ['#05081a', '#0a1020'],
        skyImages: ATMOSPHERE_IMAGES.sad,
        keywords: 'rain,mist,fog,blue,melancholy,gradient,soft',
        particles: {
            drop: { count: 40, spawnRate: 1.2 },
            cloud: { count: 4, spawnRate: 0.02 },
            guardian: { count: 1, spawnRate: 0.02 }, // Somber witness
        },
        lightning: false,
    },
    love: {
        sky: ['#1a0a12', '#200d16'],
        skyImages: ATMOSPHERE_IMAGES.love,
        keywords: 'abstract,pink,warmth,sunset,hearts,soft,blur',
        particles: {
            heart: { count: 20, spawnRate: 0.6 },
            firefly: { count: 20, spawnRate: 0.2 },
            bird: { count: 1, spawnRate: 0.02 },
            guardian: { count: 1, spawnRate: 0.01 }, // Hidden romantic observers
        },
        lightning: false,
    },
    happy: {
        sky: ['#1a1508', '#201a0a'],
        skyImages: ATMOSPHERE_IMAGES.happy,
        keywords: 'golden,glow,spark,warmth,light,bokeh',
        particles: {
            firefly: { count: 30, spawnRate: 0.3 },
            spark: { count: 8, spawnRate: 0.2 },
            bee: { count: 6, spawnRate: 0.1 },
            guardian: { count: 1, spawnRate: 0.02 },
        },
        lightning: false,
    },
    excited: {
        sky: ['#081518', '#0d1a1e'],
        skyImages: ATMOSPHERE_IMAGES.excited,
        keywords: 'aurora,stars,nebula,space,energy,dynamic,speed',
        particles: {
            spark: { count: 25, spawnRate: 1.2 },
            bounce: { count: 15, spawnRate: 0.5 },
            bird: { count: 2, spawnRate: 0.1 },
            guardian: { count: 1, spawnRate: 0.03 }, // Fast moving silhouettes
        },
        lightning: false,
    },
    playful: {
        sky: ['#0a1a0d', '#0d200f'],
        skyImages: ATMOSPHERE_IMAGES.playful,
        keywords: 'neon,bright,kinetic,colorful,mist,bokeh,spark',
        particles: {
            bounce: { count: 20, spawnRate: 0.6 },
            firefly: { count: 12, spawnRate: 0.2 },
            bee: { count: 10, spawnRate: 0.3 },
            guardian: { count: 1, spawnRate: 0.02 }, // Playful ecosystem
        },
        lightning: false,
    },
    tender: {
        sky: ['#120a1a', '#160d20'],
        skyImages: ATMOSPHERE_IMAGES.tender,
        keywords: 'twilight,nebula,soft,minimal,calm,ethereal',
        particles: {
            firefly: { count: 12, spawnRate: 0.05 },
            bird: { count: 2, spawnRate: 0.05 },
            guardian: { count: 1, spawnRate: 0.01 }, // The Sovereign Witness is watching
        },
        lightning: false,
    },
    neutral: {
        sky: ['#050508', '#0a0a12'],
        skyImages: ATMOSPHERE_IMAGES.neutral,
        keywords: 'stars,horizon,cosmic,galaxy,minimal,dark,space',
        particles: {
            guardian: { count: 1, spawnRate: 0.01 }, // Occasional witness in the void
        },
    },
    nature: {
        sky: ['#0a1505', '#10200a'],
        skyImages: ATMOSPHERE_IMAGES.happy, // Reuse happy/nature-ish assets
        keywords: 'forest,green,garden,life,earthy,birds,bees',
        particles: {
            bird: { count: 4, spawnRate: 0.4 },
            bee: { count: 12, spawnRate: 0.8 },
            firefly: { count: 20, spawnRate: 0.2 },
            guardian: { count: 1, spawnRate: 0.02 }, // Garden ghosts
        },
        lightning: false,
    },
    valentine: {
        sky: ['#1a050d', '#200810'],
        skyImages: ATMOSPHERE_IMAGES.love,
        keywords: 'rose,petals,red,pink,romance,love,candles',
        particles: {
            rose: { count: 30, spawnRate: 0.5 },
            heart: { count: 20, spawnRate: 0.2 },
            spark: { count: 15, spawnRate: 0.2 },
            bird: { count: 1, spawnRate: 0.05 }, // Love birds
        },
        lightning: false,
    },
};

// ...

function createRosePetal(canvasW, canvasH) {
    return {
        type: 'rose',
        x: Math.random() * canvasW,
        y: -20,
        vx: (Math.random() - 0.5) * 1,
        vy: 1 + Math.random() * 1.5,
        size: 5 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.05,
        color: '255, 80, 120',
        opacity: 0.4 + Math.random() * 0.4,
        life: 1
    };
}
// ─── Rendering Refinements ───

export function drawBird(ctx, x, y, size, wingPhase, facingRight, color, opacity) {
    ctx.strokeStyle = `rgba(${color}, ${opacity})`;
    ctx.fillStyle = `rgba(${color}, ${opacity * 0.4})`;
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';

    const wingY = Math.sin(wingPhase) * size * 0.8;
    const bodyW = size * 0.4;
    const dir = facingRight ? 1 : -1;

    ctx.beginPath();
    // Body silhouette
    ctx.ellipse(x, y, bodyW, bodyW * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wings (Dynamic Path)
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x - size * 0.5 * dir, y + wingY - size * 0.5, x - size * dir, y + wingY);
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + size * 0.5 * dir, y + wingY - size * 0.5, x + size * dir, y + wingY);
    ctx.stroke();
}

export function drawVolumetricCloud(ctx, p) {
    const bubbles = 6;
    for (let i = 0; i < bubbles; i++) {
        const offset = (i - bubbles / 2) * (p.size * 0.3);
        const s = p.size * (0.6 + Math.random() * 0.4);
        const grad = ctx.createRadialGradient(p.x + offset, p.y, 0, p.x + offset, p.y, s);
        grad.addColorStop(0, `rgba(${p.color}, ${p.opacity})`);
        grad.addColorStop(0.4, `rgba(${p.color}, ${p.opacity * 0.5})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x + offset, p.y, s, 0, Math.PI * 2);
        ctx.fill();
    }
}

export function drawBee(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    // Golden body
    ctx.fillStyle = `rgba(255, 200, 50, ${p.opacity})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    // Delicate wings
    ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.5})`;
    ctx.lineWidth = 1;
    const wingStretch = Math.sin(p.phase * 15) * 5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-5, -10 - wingStretch, -10, -5);
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(5, -10 - wingStretch, 10, -5);
    ctx.stroke();
    ctx.restore();
}

export function drawEcosystemGuardian(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.globalAlpha = p.opacity;

    const h = p.size;
    const w = h * 0.3;
    const sway = Math.sin(p.phase) * 2;
    const legSway = Math.sin(p.phase * 4) * (h * 0.15);

    ctx.strokeStyle = `rgba(${p.color}, 0.85)`;
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';

    if (p.persona === 'lantern') {
        const dir = p.vx > 0 ? 1 : -1;
        const raiseHeight = p.isRaisingLantern ? (h * 0.15) : 0;

        // The Lantern Guardian: Carrying a glowing prism
        ctx.beginPath();
        ctx.arc(sway, -h * 0.8 - raiseHeight, w * 0.5, 0, Math.PI * 2); // Head
        ctx.moveTo(sway, -h * 0.65 - raiseHeight);
        ctx.lineTo(sway, -h * 0.3); // Spine (Static base, leaning upper body)

        // Arm with Lantern
        ctx.moveTo(sway, -h * 0.5 - raiseHeight);
        ctx.lineTo(sway + (12 * dir), -h * 0.45 - (raiseHeight * 2));
        ctx.stroke();

        // Lantern/Prism Glow
        const flare = p.flare || 1;
        const glow = (0.5 + Math.sin(p.phase * 5) * 0.3) * flare;

        // Guiding Light Beam (Subtle volumetric cone)
        const beamGrad = ctx.createRadialGradient(sway + (14 * dir), -h * 0.45 - (raiseHeight * 2), 0, sway + (14 * dir), -h * 0.45 - (raiseHeight * 2), size * 2);
        beamGrad.addColorStop(0, `rgba(255, 255, 200, ${0.1 * p.opacity * flare})`);
        beamGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.arc(sway + (14 * dir), -h * 0.45 - (raiseHeight * 2), size * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 180, ${glow * p.opacity})`;
        ctx.beginPath();
        ctx.arc(sway + (14 * dir), -h * 0.45 - (raiseHeight * 2), 4, 0, Math.PI * 2); // The Bulb
        ctx.fill();

        // Lantern frame
        ctx.strokeStyle = `rgba(${p.color}, 0.8)`;
        ctx.beginPath();
        ctx.rect(sway + (10 * dir), -h * 0.6 - (raiseHeight * 2), 8, 10);
        ctx.stroke();

    } else if (p.persona === 'mover') {
        // Stick figure movement
        ctx.beginPath();
        ctx.arc(sway, -h * 0.8, w * 0.5, 0, Math.PI * 2); // Head
        ctx.moveTo(sway, -h * 0.65);
        ctx.lineTo(sway, -h * 0.3); // Spine
        // Arms
        const armSway = Math.sin(p.phase * 4) * (h * 0.2);
        ctx.moveTo(sway, -h * 0.5);
        ctx.lineTo(sway - 8, -h * 0.45 + armSway);
        ctx.moveTo(sway, -h * 0.5);
        ctx.lineTo(sway + 8, -h * 0.45 - armSway);
        // Legs
        ctx.moveTo(sway, -h * 0.3);
        ctx.lineTo(sway - legSway, 0);
        ctx.moveTo(sway, -h * 0.3);
        ctx.lineTo(sway + legSway, 0);
        ctx.stroke();
    } else if (p.persona === 'lovers') {
        // Two stick figures leaning
        for (let i = 0; i < 2; i++) {
            const ox = (i === 0 ? -6 : 6) + sway;
            const tilt = i === 0 ? 3 : -3;
            ctx.beginPath();
            ctx.arc(ox, -h * 0.8, w * 0.4, 0, Math.PI * 2); // Head
            ctx.moveTo(ox, -h * 0.7);
            ctx.lineTo(ox + tilt, -h * 0.3); // Body tilt
            ctx.moveTo(ox + tilt, -h * 0.3);
            ctx.lineTo(ox + (i === 0 ? -2 : 2), 0); // Legs
            ctx.stroke();
            if (i === 0) {
                ctx.fillStyle = `rgba(${p.color}, 0.5)`;
                ctx.font = '8px serif';
                ctx.fillText('♥', sway, -h * 0.9);
            }
        }
    } else {
        // Stick Observer
        ctx.beginPath();
        ctx.arc(sway, -h * 0.85, w * 0.5, 0, Math.PI * 2); // Head
        ctx.moveTo(sway, -h * 0.7);
        ctx.lineTo(sway, -h * 0.3); // Spine
        ctx.moveTo(sway, -h * 0.3);
        ctx.lineTo(sway - 4, 0);
        ctx.moveTo(sway, -h * 0.3);
        ctx.lineTo(sway + 4, 0);
        ctx.stroke();
    }

    ctx.restore();
}

function createRipple(x, y) {
    return {
        type: 'ripple',
        x, y,
        size: 2,
        maxSize: 150 + Math.random() * 100,
        opacity: 0.6,
        life: 1,
        color: '255, 255, 255'
    };
}

function createTrail(x, y, color) {
    return {
        type: 'trail',
        x, y,
        size: 3 + Math.random() * 2,
        opacity: 1,
        life: 1,
        color: color || '255, 255, 255',
        decay: 0.01 + Math.random() * 0.01
    };
}

export function drawRipple(ctx, p) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${p.color}, ${p.opacity})`;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
}

// ─── Spawn by type ───

export function spawnParticle(type, canvasW, canvasH, intensity, origin) {
    switch (type) {
        case 'rain': return createRaindrop(canvasW, canvasH, intensity);
        case 'heart': return createHeart(origin?.x, origin?.y, canvasW);
        case 'spark': return createSpark(
            origin?.x || Math.random() * canvasW,
            origin?.y || Math.random() * canvasH
        );
        case 'ripple': return createRipple(origin?.x, origin?.y);
        case 'rose': return createRosePetal(canvasW, canvasH);
        case 'trail': return createTrail(origin?.x, origin?.y, origin?.color);
        case 'firefly': return createFirefly(canvasW, canvasH);
        case 'drop': return createDrop(canvasW);
        case 'cloud': return createCloud(canvasW, canvasH);
        case 'bird': return createBird(canvasW, canvasH);
        case 'bounce': return createBounce(canvasW, canvasH);
        case 'energy': return createEnergy(origin?.x, origin?.y, origin?.tx, origin?.ty, origin?.color);
        case 'morph': return createMorphingBubble(origin?.x, origin?.y, origin?.w, origin?.h, origin?.color);
        case 'melt': return createMelt(origin?.x, origin?.y, origin?.color);
        case 'pop': return createPop(origin?.x, origin?.y, origin?.color);
        case 'bee': return createBee(canvasW, canvasH);
        case 'guardian': return createEcosystemGuardian(canvasW, canvasH);
        default: return null;
    }
}

export function updateParticle(p, w, h, dt, mousePos = { x: -1000, y: -1000 }) {
    if (p.type === 'ripple') {
        p.size += 4 * dt;
        p.opacity -= 0.012 * dt;
        p.life = p.opacity;
        return;
    }

    // Environmental particles persist until off-screen
    const isEnvironmental = p.type === 'rain' || p.type === 'cloud' || p.type === 'bird' || p.type === 'bee' || p.type === 'guardian';
    if (!isEnvironmental) {
        p.life -= 0.005 * dt;
    }

    if (p.x < -100 || p.x > w + 100 || p.y < -100 || p.y > h + 100) p.life = 0;

    switch (p.type) {
        case 'rain':
            p.y += p.vy * dt;
            p.x += p.vx * dt;
            break;
        case 'heart':
            p.y += p.vy * dt; // vy is negative, so moves up
            p.phase += p.phaseSpeed * dt;
            p.x += Math.sin(p.phase) * 2 * dt;
            p.opacity = Math.min(0.6, p.life * 3);
            break;
        case 'spark':
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.opacity = p.life * 0.8;
            break;
        case 'firefly':
            p.x += Math.cos(p.life * 10) * 0.5 * dt;
            p.y -= p.vy * dt;
            p.opacity = (Math.sin(p.life * 20) * 0.5 + 0.5) * p.life;
            break;
        case 'drop':
            p.y += p.vy * dt;
            p.opacity = p.life;
            break;
        case 'cloud':
            p.x += p.vx * dt;
            p.opacity = Math.min(0.2, p.life * 0.5);
            break;
        case 'bird':
            p.x += p.vx * dt;
            p.y += Math.sin(p.x / 100) * 0.5 * dt;
            p.wingPhase += 0.15 * dt;
            p.opacity = Math.min(0.5, p.life);
            break;
        case 'bee':
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.phase += p.phaseSpeed * dt;
            // High-frequency jitter (vibrato) while traveling
            p.x += Math.sin(p.phase * 10) * 0.8 * dt;
            p.y += Math.cos(p.phase * 8) * 0.8 * dt;
            p.opacity = p.life * (0.6 + Math.sin(p.phase * 15) * 0.2);
            break;
        case 'guardian':
            // Behavior Logic (Peeking, Stopping, Cursor Reaction)
            const dx = mousePos.x - p.x;
            const dy = mousePos.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const isNear = dist < 200;

            if (p.persona === 'lantern') {
                if (isNear) {
                    // Slow down and "investigate" the user's presence
                    p.vx *= 0.95;
                    p.vy *= 0.95;
                    p.isRaisingLantern = true;
                    // Subtly drift towards mouse (Guiding instinct)
                    p.x += dx * 0.002 * dt;
                    p.y += dy * 0.002 * dt;
                } else {
                    p.isRaisingLantern = false;
                    // Return to normal speed
                    const targetVx = (p.vx > 0 ? 1 : -1) * (0.4 + Math.random() * 0.2);
                    p.vx += (targetVx - p.vx) * 0.05 * dt;

                    if (p.behaviorTimer > 150) {
                        p.vx = -p.vx;
                        p.behaviorTimer = 0;
                    }
                }
            } else if (p.persona === 'observer') {
                if (Math.random() < 0.005 && !isNear) p.vx = 0;
                if (isNear) p.vx = (dx > 0 ? -0.5 : 0.5) * dt; // Shy observer retreats slightly
            }

            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.phase += p.phaseSpeed * dt;
            p.behaviorTimer += dt;

            // Bioluminescent pulse depth
            p.flare = isNear ? 1.5 + Math.sin(p.phase * 10) * 0.5 : 1;

            // Ethereal bioluminescent fading
            if (p.opacity < p.targetOpacity) p.opacity += p.fadeSpeed * dt;

            if (p.x < -150 || p.x > w + 150) p.opacity -= p.fadeSpeed * 2 * dt;
            if (p.opacity < 0) p.life = 0;
            break;
        case 'rose':
            p.y += p.vy * dt;
            p.x += Math.sin(p.y / 60) * 2 * dt;
            p.rotation += p.vr * dt;
            p.opacity = Math.min(0.6, p.life * 2);
            break;
        case 'trail':
            p.opacity -= p.decay * dt;
            p.life = p.opacity;
            p.size *= 0.99;
            break;
        case 'bounce':
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
            break;
        case 'energy':
            // Magnetic Drift (Sentinel whisper)
            p.phase += p.oscFreq * dt;
            const targetDx = p.tx - p.x;
            const targetDy = p.ty - p.y;

            // Homing force
            p.vx += targetDx * p.speed * dt;
            p.vy += targetDy * p.speed * dt;

            // Lateral "Wiggle"
            p.x += Math.cos(p.phase) * 1.5 * dt;
            p.y += Math.sin(p.phase) * 1.5 * dt;

            p.vx *= 0.85; // Heavier drag
            p.vy *= 0.85;
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            p.opacity = p.life;
            if (Math.abs(targetDx) < 10 && Math.abs(targetDy) < 10) p.life = 0;
            break;
        case 'morph':
            p.phase += 0.05 * dt;
            p.life -= p.speed * dt;
            break;
        case 'melt':
            p.vy += p.gravity * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.opacity = p.life;
            break;
        case 'pop':
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= p.decay * dt;
            p.opacity = p.life;
            p.size *= 0.95;
            break;
    }
}

export function renderParticle(ctx, p) {
    if (p.type === 'ripple') {
        drawRipple(ctx, p);
        return;
    }

    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;

    if (p.type === 'heart') {
        ctx.font = `${p.size}px serif`;
        ctx.fillText('♥', p.x, p.y);
    } else if (p.type === 'rose') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    } else if (p.type === 'trail') {
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        grad.addColorStop(0, `rgba(${p.color}, ${p.opacity})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
    } else if (p.type === 'drop') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    } else if (p.type === 'rain') {
        ctx.strokeStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        // Long streaks for "Wet Screen" look
        ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 4);
        ctx.stroke();
    } else if (p.type === 'energy') {
        const glowSize = p.size * (4 + Math.sin(p.phase) * 2);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        grad.addColorStop(0, `rgba(${p.color}, ${p.opacity * 0.4})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
    } else if (p.type === 'morph') {
        ctx.save();
        // Stability: Clamp life to 0-1 for predictable alpha
        const safeLife = Math.max(0, Math.min(1, p.life));

        // Cosmic Burst: high-impact, razor-sharp initial flash
        const alpha = p.isBurst
            ? Math.pow(safeLife, 4) * 0.45 // Lowered peak
            : safeLife * (0.04 + Math.sin(p.phase) * 0.02);

        const driftX = Math.sin(p.phase) * (p.isBurst ? 5 : 8);
        const driftY = Math.cos(p.phase) * (p.isBurst ? 5 : 8);
        const size = Math.max(p.w, p.h);

        // Explosion expansion: start tight, end wide and thin
        // Cap expansion to avoid "The Pillar"
        const expansion = Math.min(1.2, (1.0 - safeLife) * 1.2);
        const radius = size * (p.isBurst ? 0.6 + expansion : 0.8 + (safeLife * 0.1));

        const grad = ctx.createRadialGradient(
            p.x + driftX, p.y + driftY, 0,
            p.x + driftX, p.y + driftY, radius
        );
        grad.addColorStop(0, `rgba(${p.color}, ${alpha})`);
        grad.addColorStop(0.3, `rgba(${p.color}, ${alpha * 0.2})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        // Use Arc (Circle) for better center-masking - Ellipse was causing "Pillars"
        ctx.arc(p.x + driftX, p.y + driftY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    } else if (p.type === 'bee') {
        drawBee(ctx, p);
    } else if (p.type === 'guardian') {
        drawEcosystemGuardian(ctx, p);
        return;
    } else if (p.type === 'melt' || p.type === 'pop') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}
