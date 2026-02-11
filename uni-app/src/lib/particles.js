// •UNI• CGEI Particle System
// The emotional atmosphere expressed through motion
// Each particle type represents a feeling made visible

// ─── Particle Factory ───

export function createRaindrop(canvasW, canvasH, intensity = 0.7) {
    const speed = 4 + Math.random() * 6 * intensity;
    const wind = -1.5 + Math.random() * 0.5;
    return {
        type: 'rain',
        x: Math.random() * (canvasW + 100) - 50,
        y: -10 - Math.random() * canvasH * 0.5,
        vx: wind,
        vy: speed,
        life: 1,
        maxLife: 1,
        size: 1 + Math.random() * 1.5,
        length: 12 + Math.random() * 18 * intensity,
        opacity: 0.15 + Math.random() * 0.25,
        color: '180, 200, 255',
    };
}

export function createHeart(x, y, canvasW) {
    const drift = (Math.random() - 0.5) * 1.2;
    return {
        type: 'heart',
        x: x || Math.random() * canvasW,
        y: y || canvasW, // start from bottom if no position
        vx: drift,
        vy: -(1.2 + Math.random() * 1.5),
        life: 1,
        maxLife: 1,
        size: 8 + Math.random() * 10,
        opacity: 0.4 + Math.random() * 0.4,
        color: '255, 107, 157',
        phase: Math.random() * Math.PI * 2, // for sine drift
        phaseSpeed: 0.02 + Math.random() * 0.02,
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
        x: -200 + Math.random() * (canvasW + 200),
        y: Math.random() * canvasH * 0.4,
        vx: 0.1 + Math.random() * 0.2,
        vy: 0,
        life: 1,
        maxLife: 1,
        size: 120 + Math.random() * 200,
        opacity: 0,
        targetOpacity: 0.03 + Math.random() * 0.05,
        color: '255, 255, 255',
        fadeSpeed: 0.002,
    };
}

export function createBird(canvasW, canvasH) {
    const fromLeft = Math.random() > 0.5;
    return {
        type: 'bird',
        x: fromLeft ? -30 : canvasW + 30,
        y: 40 + Math.random() * canvasH * 0.25,
        vx: fromLeft ? (1.5 + Math.random() * 2) : -(1.5 + Math.random() * 2),
        vy: -0.3 + Math.random() * 0.6,
        life: 1,
        maxLife: 1,
        size: 6 + Math.random() * 6,
        opacity: 0.4 + Math.random() * 0.3,
        color: '200, 200, 220',
        wingPhase: 0,
        wingSpeed: 0.06 + Math.random() * 0.03,
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

// ─── Particle Physics ───

export function updateParticle(p, canvasW, canvasH, dt = 1) {
    switch (p.type) {
        case 'rain':
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (p.y > canvasH + 20) p.life = 0;
            break;

        case 'heart':
            p.phase += p.phaseSpeed;
            p.x += p.vx + Math.sin(p.phase) * 0.4;
            p.y += p.vy * dt;
            p.opacity -= 0.003 * dt;
            if (p.y < -40 || p.opacity <= 0) p.life = 0;
            break;

        case 'spark':
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vx *= 0.97;
            p.vy *= 0.97;
            p.opacity -= p.decay * dt;
            if (p.opacity <= 0) p.life = 0;
            break;

        case 'firefly':
            p.phase += p.phaseSpeed;
            p.wanderAngle += (Math.random() - 0.5) * 0.1;
            p.vx += Math.cos(p.wanderAngle) * 0.02;
            p.vy += Math.sin(p.wanderAngle) * 0.02;
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.x += p.vx;
            p.y += p.vy;
            p.opacity += (p.targetOpacity * (0.5 + Math.sin(p.phase) * 0.5) - p.opacity) * 0.05;
            // Wrap around
            if (p.x < -20) p.x = canvasW + 20;
            if (p.x > canvasW + 20) p.x = -20;
            if (p.y < -20) p.y = canvasH + 20;
            if (p.y > canvasH + 20) p.y = -20;
            break;

        case 'drop':
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (p.y > canvasH + 10) p.life = 0;
            break;

        case 'cloud':
            p.x += p.vx * dt;
            if (p.opacity < p.targetOpacity) {
                p.opacity += p.fadeSpeed;
            }
            if (p.x > canvasW + p.size) p.life = 0;
            break;

        case 'bird':
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.wingPhase += p.wingSpeed;
            if (p.x < -60 || p.x > canvasW + 60) p.life = 0;
            break;

        case 'bounce':
            p.vy += p.gravity * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.opacity -= 0.006 * dt;
            if (p.y > canvasH + 10 || p.opacity <= 0) p.life = 0;
            break;
    }
}

// ─── Particle Rendering ───

export function renderParticle(ctx, p) {
    if (p.opacity <= 0) return;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));

    switch (p.type) {
        case 'rain':
            ctx.strokeStyle = `rgba(${p.color}, ${p.opacity})`;
            ctx.lineWidth = p.size;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.vx * 2, p.y + p.length);
            ctx.stroke();
            break;

        case 'heart':
            drawHeart(ctx, p.x, p.y, p.size, p.color, p.opacity);
            break;

        case 'spark':
            ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            // Glow
            ctx.shadowColor = `rgba(${p.color}, 0.5)`;
            ctx.shadowBlur = p.size * 3;
            ctx.fill();
            break;

        case 'firefly':
            const glowSize = p.size * 3;
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
            grad.addColorStop(0, `rgba(${p.color}, ${p.opacity})`);
            grad.addColorStop(1, `rgba(${p.color}, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'drop':
            ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
            ctx.beginPath();
            // Teardrop shape
            ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI, false);
            ctx.lineTo(p.x, p.y - p.size * 1.2);
            ctx.fill();
            break;

        case 'cloud':
            const cGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            cGrad.addColorStop(0, `rgba(${p.color}, ${p.opacity})`);
            cGrad.addColorStop(0.5, `rgba(${p.color}, ${p.opacity * 0.4})`);
            cGrad.addColorStop(1, `rgba(${p.color}, 0)`);
            ctx.fillStyle = cGrad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'bird':
            drawBird(ctx, p.x, p.y, p.size, p.wingPhase, p.vx > 0, p.color, p.opacity);
            break;

        case 'bounce':
            ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            break;
    }

    ctx.restore();
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

function drawBird(ctx, x, y, size, wingPhase, facingRight, color, opacity) {
    ctx.strokeStyle = `rgba(${color}, ${opacity})`;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    const wingY = Math.sin(wingPhase) * size * 0.6;
    const dir = facingRight ? 1 : -1;
    ctx.beginPath();
    // Left wing
    ctx.moveTo(x - size * dir, y + wingY);
    ctx.quadraticCurveTo(x - size * 0.3 * dir, y - size * 0.2, x, y);
    // Right wing
    ctx.quadraticCurveTo(x + size * 0.3 * dir, y - size * 0.2, x + size * dir, y + wingY);
    ctx.stroke();
}

// ─── Weather Presets ───

// ─── Weather Presets ───

export const WEATHER_PRESETS = {
    angry: {
        sky: ['#1a0505', '#200808'],
        skyImage: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80&w=1200', // Dark Storm
        particles: {
            rain: { count: 120, spawnRate: 4 },
        },
        lightning: true,
        lightningInterval: [2000, 5000],
    },
    sad: {
        sky: ['#05081a', '#0a1020'],
        skyImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1200', // Deep Blue Water
        particles: {
            drop: { count: 40, spawnRate: 1.2 },
            cloud: { count: 4, spawnRate: 0.02 },
        },
        lightning: false,
    },
    love: {
        sky: ['#1a0a12', '#200d16'],
        skyImage: 'https://images.unsplash.com/photo-1615715037327-6f8cc36495b4?auto=format&fit=crop&q=80&w=1200', // Abstract Fluid Warmth
        particles: {
            heart: { count: 12, spawnRate: 0.4 },
            firefly: { count: 18, spawnRate: 0.15 },
        },
        lightning: false,
    },
    happy: {
        sky: ['#1a1508', '#201a0a'],
        skyImage: 'https://images.unsplash.com/photo-1528353518104-dbd48bee7bc4?auto=format&fit=crop&q=80&w=1200', // Golden Dust
        particles: {
            firefly: { count: 30, spawnRate: 0.3 },
            spark: { count: 8, spawnRate: 0.2 },
        },
        lightning: false,
    },
    excited: {
        sky: ['#081518', '#0d1a1e'],
        skyImage: 'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?auto=format&fit=crop&q=80&w=1200', // Northern Lights Tint
        particles: {
            spark: { count: 25, spawnRate: 1.2 },
            bounce: { count: 15, spawnRate: 0.5 },
        },
        lightning: false,
    },
    playful: {
        sky: ['#0a1a0d', '#0d200f'],
        skyImage: 'https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=80&w=1200', // Soft Garden Mist
        particles: {
            bounce: { count: 20, spawnRate: 0.6 },
            firefly: { count: 12, spawnRate: 0.2 },
        },
        lightning: false,
    },
    tender: {
        sky: ['#120a1a', '#160d20'],
        skyImage: 'https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9?auto=format&fit=crop&q=80&w=1200', // Soft Sunset Void
        particles: {
            firefly: { count: 25, spawnRate: 0.2 },
            bird: { count: 2, spawnRate: 0.01 },
        },
        lightning: false,
    },
    neutral: {
        sky: ['#050508', '#0a0a12'],
        particles: {
            firefly: { count: 12, spawnRate: 0.1 },
            bird: { count: 1, spawnRate: 0.005 },
        },
    },
    valentine: {
        sky: ['#1a050d', '#200810'],
        skyImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1200', // Romantic Rose Petals/Texture
        particles: {
            rose: { count: 30, spawnRate: 0.5 },
            heart: { count: 10, spawnRate: 0.1 },
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
            p.y -= p.vy * dt;
            p.x += Math.sin(p.y / 50) * 1.5 * dt;
            p.opacity = Math.min(0.7, p.life * 4);
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
    } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}
