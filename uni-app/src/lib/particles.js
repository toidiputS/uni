// •UNI• CGEI Particle System
// The emotional atmosphere expressed through motion
// Each particle type represents a feeling made visible

// ─── Particle Factory ───

export function createRaindrop(canvasW, canvasH, intensity = 0.7) {
    const speed = 6 + Math.random() * 8 * intensity;
    const wind = -0.5 + Math.random() * 0.2;
    return {
        type: 'rain',
        x: Math.random() * (canvasW + 100) - 50,
        y: -50,
        vx: wind,
        vy: speed,
        life: 1,
        maxLife: 1,
        size: 0.5 + Math.random() * 1.0, // Smaller, finer
        length: 8 + Math.random() * 12 * intensity, // Shorter
        opacity: 0.1 + Math.random() * 0.2, // More transparent
        color: '200, 220, 240', // Silver/Transparent
    };
}

export function createHeart(x, y, canvasW) {
    const drift = (Math.random() - 0.5) * 3; // Wider drift
    return {
        type: 'heart',
        x: x || Math.random() * canvasW,
        y: y || canvasW,
        vx: drift,
        vy: -(0.8 + Math.random() * 2), // Slightly slower rise
        life: 1,
        maxLife: 1,
        size: 10 + Math.random() * 15, // Bigger hearts
        opacity: 0.3 + Math.random() * 0.4,
        color: '255, 120, 160',
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.01 + Math.random() * 0.03,
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
        size: 2 + Math.random() * 3,
        opacity: 0,
        targetOpacity: 0.3 + Math.random() * 0.5,
        color: '255, 220, 100',
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.01 + Math.random() * 0.015,
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
        x: -400 + Math.random() * (canvasW + 400),
        y: -50 + Math.random() * canvasH * 0.3,
        vx: 0.05 + Math.random() * 0.1, // Heavy, slow movement
        vy: 0,
        life: 1,
        maxLife: 1,
        size: 300 + Math.random() * 400, // Massive clouds
        opacity: 0,
        targetOpacity: 0.08 + Math.random() * 0.12, // More visible
        color: '80, 80, 95', // Ominous Charcoal
        fadeSpeed: 0.0015,
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
        size: 5 + Math.random() * 10,
        opacity: 0.3 + Math.random() * 0.4,
        color: '180, 180, 200',
        wingPhase: Math.random() * Math.PI * 2, // Desynced wings
        wingSpeed: 0.05 + Math.random() * 0.04,
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
        size: 3 + Math.random() * 4,
        opacity: 0.8,
        color: color || '220, 220, 255',
        speed: 0.03 + Math.random() * 0.04, // Slower, more magentic
        phase: Math.random() * Math.PI * 2,
        oscFreq: 0.1 + Math.random() * 0.2
    };
}

export function createMorphingBubble(x, y, w, h, color) {
    return {
        type: 'morph',
        x, y, w, h,
        life: 0.5 + Math.random() * 1.5, // Variable life for 'remnant' effect
        phase: Math.random() * Math.PI * 2,
        color: color || '255, 255, 255',
        speed: 0.005 + Math.random() * 0.01
    };
}


// ─── Shape Helpers ───

function drawHeart(ctx, x, y, size, color, opacity) {
    const s = size * 0.5;
    ctx.fillStyle = `rgba(${color}, ${opacity})`;
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.4);
    ctx.bezierCurveTo(x, y - s * 0.2, x - s, y - s * 0.6, x - s, y + s * 0.1);
    ctx.bezierCurveTo(x - s, y + s * 0.6, x, y + s * 0.9, x, y + s * 1.1);
    ctx.bezierCurveTo(x, y + s * 0.9, x + s, y + s * 0.6, x + s, y + s * 0.1);
    ctx.bezierCurveTo(x + s, y - s * 0.6, x, y - s * 0.2, x, y + s * 0.4);
    ctx.fill();
}


// ─── Weather Presets ───

// ─── Weather Presets ───

export const WEATHER_PRESETS = {
    angry: {
        sky: ['#1a0505', '#200808'],
        skyImages: [
            'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80&w=1200', // Dark Storm
            'https://images.unsplash.com/photo-1500674425916-2c6b2ce150ff?auto=format&fit=crop&q=80&w=1200', // Crashing Waves
            'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?auto=format&fit=crop&q=80&w=1200', // Dark Tundra
            'https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?auto=format&fit=crop&q=80&w=1200', // Midnight Clouds
            'https://images.unsplash.com/photo-1504333638930-c8787321eee0?auto=format&fit=crop&q=80&w=1200', // Dark Forest
            'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=1200'  // stormy sea
        ],
        particles: {
            rain: { count: 180, spawnRate: 6 },
            cloud: { count: 8, spawnRate: 0.05 },
        },
        lightning: true,
        lightningInterval: [1500, 4000], // More frequent "Thundering"
    },
    sad: {
        sky: ['#05081a', '#0a1020'],
        skyImages: [
            'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1200', // Deep Blue Water
            'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=1200', // Foggy Lake
            'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?auto=format&fit=crop&q=80&w=1200', // Distant Foggy Hills
            'https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=1200', // Dark galaxy
            'https://images.unsplash.com/photo-1437435889745-7f9cb6506161?auto=format&fit=crop&q=80&w=1200', // Rain on glass effect
            'https://images.unsplash.com/photo-1515281239448-202bc9548453?auto=format&fit=crop&q=80&w=1200'  // Moody Blue
        ],
        particles: {
            drop: { count: 40, spawnRate: 1.2 },
            cloud: { count: 4, spawnRate: 0.02 },
        },
        lightning: false,
    },
    love: {
        sky: ['#1a0a12', '#200d16'],
        skyImages: [
            'https://images.unsplash.com/photo-1615715037327-6f8cc36495b4?auto=format&fit=crop&q=80&w=1200', // Abstract Fluid Warmth
            'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200', // Calm Pink Horizon
            'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200', // Soft Gradient Light
            'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&q=80&w=1200', // Rose Gold Water
            'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1200', // Petal Texture
            'https://images.unsplash.com/photo-1490750967868-58cb9bdda6fa?auto=format&fit=crop&q=80&w=1200'  // Warm Sunset
        ],
        particles: {
            heart: { count: 20, spawnRate: 0.6 },
            firefly: { count: 20, spawnRate: 0.2 },
        },
        lightning: false,
    },
    happy: {
        sky: ['#1a1508', '#201a0a'],
        skyImages: [
            'https://images.unsplash.com/photo-1528353518104-dbd48bee7bc4?auto=format&fit=crop&q=80&w=1200', // Golden Dust
            'https://images.unsplash.com/photo-1496450681664-3df85efbd29f?auto=format&fit=crop&q=80&w=1200', // Sunlit Field
            'https://images.unsplash.com/photo-1516339901600-2e1a62dc0c45?auto=format&fit=crop&q=80&w=1200', // Golden Hour Bloom
            'https://images.unsplash.com/photo-1505322022379-7c3353ee6291?auto=format&fit=crop&q=80&w=1200', // Night Lights
            'https://images.unsplash.com/photo-1514218953589-2d7d37efd2dc?auto=format&fit=crop&q=80&w=1200', // Warm Bulb
            'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=1200'  // Sunrise
        ],
        particles: {
            firefly: { count: 30, spawnRate: 0.3 },
            spark: { count: 8, spawnRate: 0.2 },
        },
        lightning: false,
    },
    excited: {
        sky: ['#081518', '#0d1a1e'],
        skyImages: [
            'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?auto=format&fit=crop&q=80&w=1200', // Northern Lights Tint
            'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=1200', // Fractal Colors
            'https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?auto=format&fit=crop&q=80&w=1200', // Energy Peaks
            'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=1200', // Mountain Starscape
            'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?auto=format&fit=crop&q=80&w=1200', // Deep Space
            'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200'  // Milky Way
        ],
        particles: {
            spark: { count: 25, spawnRate: 1.2 },
            bounce: { count: 15, spawnRate: 0.5 },
        },
        lightning: false,
    },
    playful: {
        sky: ['#0a1a0d', '#0d200f'],
        skyImages: [
            'https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=80&w=1200', // Soft Garden Mist
            'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1200', // Dynamic Flow
            'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&q=80&w=1200', // Colorful Night
            'https://images.unsplash.com/photo-1550100136-e074fa05d8dc?auto=format&fit=crop&q=80&w=1200', // Neon Confetti
            'https://images.unsplash.com/photo-1495001258031-d1b407bc1776?auto=format&fit=crop&q=80&w=1200', // Tropical Ferns
            'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&q=80&w=1200'  // Flowers
        ],
        particles: {
            bounce: { count: 20, spawnRate: 0.6 },
            firefly: { count: 12, spawnRate: 0.2 },
        },
        lightning: false,
    },
    tender: {
        sky: ['#120a1a', '#160d20'],
        skyImages: [
            'https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9?auto=format&fit=crop&q=80&w=1200', // Soft Sunset Void
            'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1200', // Distant Nebula
            'https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?auto=format&fit=crop&q=80&w=1200', // Purple Twilight
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200', // Ocean Sunset
            'https://images.unsplash.com/photo-1532274402911-5a36f1f523d6?auto=format&fit=crop&q=80&w=1200', // Soft Sand
            'https://images.unsplash.com/photo-1529641484336-ef35148bab06?auto=format&fit=crop&q=80&w=1200'  // Muted Clouds
        ],
        particles: {
            firefly: { count: 25, spawnRate: 0.2 },
            bird: { count: 4, spawnRate: 0.02 },
        },
        lightning: false,
    },
    neutral: {
        sky: ['#050508', '#0a0a12'],
        skyImages: [
            'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=1200', // Simple Starry Night
            'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?auto=format&fit=crop&q=80&w=1200', // Dark Horizon
            'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=1200'  // Deep Cosmic Veil
        ],
        particles: {
            firefly: { count: 12, spawnRate: 0.1 },
            bird: { count: 2, spawnRate: 0.01 },
        },
    },
    valentine: {
        sky: ['#1a050d', '#200810'],
        skyImages: [
            'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1200', // Romantic Rose Petals/Texture
            'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1200', // Red Tinted Water
            'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=1200'  // Misty Pink Lake
        ],
        particles: {
            rose: { count: 30, spawnRate: 0.5 },
            heart: { count: 20, spawnRate: 0.2 },
            spark: { count: 15, spawnRate: 0.2 },
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
        default: return null;
    }
}

export function updateParticle(p, w, h, dt) {
    if (p.type === 'ripple') {
        p.size += 4 * dt;
        p.opacity -= 0.012 * dt;
        p.life = p.opacity;
        return;
    }

    p.life -= 0.005 * dt;
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
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 0.2, p.y + p.vy * 0.2);
        ctx.stroke();
    } else if (p.type === 'energy') {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grad.addColorStop(0, `rgba(${p.color}, ${p.opacity})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
    } else if (p.type === 'morph') {
        ctx.save();
        ctx.globalAlpha = Math.min(0.2, p.life * 0.3);
        const driftX = Math.sin(p.phase) * 20;
        const driftY = Math.cos(p.phase) * 20;
        // Middle-ground dispersion: wider than words, but focused on sentiment
        const size = Math.max(p.w, p.h);
        const grad = ctx.createRadialGradient(
            p.x + driftX, p.y + driftY, 0,
            p.x, p.y, size * 2.5
        );
        grad.addColorStop(0, `rgba(${p.color}, 0.25)`);
        grad.addColorStop(0.3, `rgba(${p.color}, 0.08)`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = grad;
        // Massive dispersion area
        ctx.fillRect(p.x - size * 2, p.y - size * 2, size * 4, size * 4);
        ctx.restore();
    } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}
