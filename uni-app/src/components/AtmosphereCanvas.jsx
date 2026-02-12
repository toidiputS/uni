import React, { useRef, useEffect, useCallback } from 'react';
import {
    WEATHER_PRESETS,
    spawnParticle,
    updateParticle,
    renderParticle,
    drawBird,
    drawVolumetricCloud,
} from '../lib/particles';

export default function AtmosphereCanvas({ mood = 'neutral', intensity = 0.5, bubbleEmit, drawEmit, onDraw, bellPos, bubblePositions = [] }) {
    const canvasRef = useRef(null);
    const particles = useRef([]);
    const animFrame = useRef(null);
    const currentMood = useRef(mood);
    const targetMood = useRef(mood);
    const transitionProgress = useRef(1);
    const spawnAccumulators = useRef({});
    const lightningTimer = useRef(null);
    const lightningFlash = useRef(0);
    const lastTime = useRef(0);
    const bgImage = useRef(null);
    const targetBgImage = useRef(null);
    const isDrawing = useRef(false);

    // Load background images
    useEffect(() => {
        const preset = WEATHER_PRESETS[mood];
        if (preset?.skyImages && preset.skyImages.length > 0) {
            // Pick a random image from the pool
            const randomImgUrl = preset.skyImages[Math.floor(Math.random() * preset.skyImages.length)];
            const img = new Image();
            img.src = randomImgUrl;
            img.onload = () => {
                targetBgImage.current = img;
            };
        } else if (preset?.skyImage) {
            const img = new Image();
            img.src = preset.skyImage;
            img.onload = () => {
                targetBgImage.current = img;
            };
        } else {
            targetBgImage.current = null;
        }

        if (mood !== currentMood.current) {
            targetMood.current = mood;
            transitionProgress.current = 0;
        }
    }, [mood]);

    // Handle bubble and draw emissions from parent
    useEffect(() => {
        if (drawEmit) {
            const p = spawnParticle('trail', window.innerWidth, window.innerHeight, intensity, {
                x: drawEmit.x,
                y: drawEmit.y,
                color: drawEmit.color || '200, 200, 255'
            });
            if (p) particles.current.push(p);
        }
    }, [drawEmit, intensity]);

    useEffect(() => {
        if (!bubbleEmit || !canvasRef.current) return;
        const { type, x, y, count } = bubbleEmit;

        // CGEI EVOLUTION: Flow from Bell to Bubble
        const originX = bellPos?.x || window.innerWidth / 2;
        const originY = bellPos?.y || 72;

        for (let i = 0; i < (count || 8); i++) {
            // Spawn energy flow
            const energy = spawnParticle('energy', window.innerWidth, window.innerHeight, intensity, {
                x: originX,
                y: originY,
                tx: x,
                ty: y
            });
            if (energy) particles.current.push(energy);

            // Also spawn standard sentiment particles at the destination
            const p = spawnParticle(type, window.innerWidth, window.innerHeight, intensity, { x, y });
            if (p) particles.current.push(p);
        }
    }, [bubbleEmit, intensity, bellPos]);

    const triggerLightning = useCallback(() => {
        lightningFlash.current = 1;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const handlePointerDown = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            isDrawing.current = true;

            const p = spawnParticle('ripple', canvas.width, canvas.height, intensity, { x, y });
            if (p) particles.current.push(p);
        };

        const handlePointerMove = (e) => {
            if (!isDrawing.current) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const p = spawnParticle('trail', canvas.width, canvas.height, intensity, { x, y });
            if (p) {
                particles.current.push(p);
                if (onDraw) onDraw({ x, y });
            }
        };

        const handlePointerUp = () => {
            isDrawing.current = false;
        };

        canvas.addEventListener('pointerdown', handlePointerDown);
        canvas.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);

        const scheduleLightning = () => {
            const preset = WEATHER_PRESETS[currentMood.current];
            if (preset?.lightning) {
                const [min, max] = preset.lightningInterval;
                const delay = min + Math.random() * (max - min);
                lightningTimer.current = setTimeout(() => {
                    triggerLightning();
                    scheduleLightning();
                }, delay);
            }
        };

        const loop = (timestamp) => {
            const dt = lastTime.current ? Math.min((timestamp - lastTime.current) / 16.67, 3) : 1;
            lastTime.current = timestamp;

            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);

            // Transition logic
            if (transitionProgress.current < 1) {
                transitionProgress.current = Math.min(1, transitionProgress.current + 0.008 * dt);
                if (transitionProgress.current >= 1) {
                    currentMood.current = targetMood.current;
                    bgImage.current = targetBgImage.current;
                    clearTimeout(lightningTimer.current);
                    scheduleLightning();
                }
            } else {
                bgImage.current = targetBgImage.current;
            }

            // Draw Sky Texture Image (Low Opacity for Sentiment Vibe)
            if (bgImage.current) {
                ctx.save();
                ctx.globalAlpha = 0.12 * (transitionProgress.current > 0.5 ? 1 : transitionProgress.current * 2);
                ctx.filter = 'brightness(0.3) contrast(1.2) saturate(0.8)';
                // Fill & Cover
                const scale = Math.max(w / bgImage.current.width, h / bgImage.current.height);
                const x = (w - bgImage.current.width * scale) / 2;
                const y = (h - bgImage.current.height * scale) / 2;
                ctx.drawImage(bgImage.current, x, y, bgImage.current.width * scale, bgImage.current.height * scale);
                ctx.restore();
            }

            const activeMood = transitionProgress.current >= 1 ? currentMood.current : targetMood.current;
            const preset = WEATHER_PRESETS[activeMood] || WEATHER_PRESETS.neutral;
            const fadingOut = transitionProgress.current < 1;

            if (preset.particles) {
                Object.entries(preset.particles).forEach(([type, config]) => {
                    const key = type;
                    if (!spawnAccumulators.current[key]) spawnAccumulators.current[key] = 0;
                    const currentCount = particles.current.filter(p => p.type === type && p.life > 0).length;

                    if (currentCount < config.count) {
                        spawnAccumulators.current[key] += config.spawnRate * intensity * dt;
                        while (spawnAccumulators.current[key] >= 1) {
                            spawnAccumulators.current[key] -= 1;
                            const p = spawnParticle(type, w, h, intensity);
                            if (p) {
                                p._mood = activeMood;
                                particles.current.push(p);
                            }
                        }
                    }
                });
            }

            particles.current.forEach(p => {
                updateParticle(p, w, h, dt);
                if (fadingOut && p._mood && p._mood !== targetMood.current) {
                    p.opacity *= 0.98;
                }
            });

            particles.current = particles.current.filter(p => p.life > 0);

            // Advanced Rendering
            particles.current.forEach(p => {
                if (p.type === 'bird') {
                    drawBird(ctx, p.x, p.y, p.size, p.wingPhase, p.vx > 0, p.color, p.opacity);
                } else if (p.type === 'cloud') {
                    drawVolumetricCloud(ctx, p);
                } else {
                    renderParticle(ctx, p);
                }
            });

            // Film Grain / Noise Layer
            ctx.save();
            ctx.globalCompositeOperation = 'overlay';
            ctx.globalAlpha = 0.03;
            for (let i = 0; i < 10; i++) {
                ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
                ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
            }
            ctx.restore();

            if (lightningFlash.current > 0) {
                ctx.fillStyle = `rgba(200, 210, 255, ${lightningFlash.current * 0.12})`;
                ctx.fillRect(0, 0, w, h);
                lightningFlash.current *= 0.85;
                if (lightningFlash.current < 0.01) lightningFlash.current = 0;
            }

            // Morphing Bubbles Layer
            if (bubblePositions && bubblePositions.length > 0) {
                bubblePositions.forEach(b => {
                    if (Math.random() < 0.05 * intensity) {
                        const m = spawnParticle('morph', w, h, intensity, {
                            x: b.x, y: b.y, w: b.width, h: b.height,
                            color: WEATHER_PRESETS[b.sentiment]?.sky?.[0] === '#050508' ? '255,255,255' : '150,150,255'
                        });
                        if (m) particles.current.push(m);
                    }
                });
            }

            animFrame.current = requestAnimationFrame(loop);
        };

        const handleVisibility = () => {
            if (document.hidden) {
                cancelAnimationFrame(animFrame.current);
                lastTime.current = 0;
            } else {
                lastTime.current = 0;
                animFrame.current = requestAnimationFrame(loop);
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        scheduleLightning();
        animFrame.current = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animFrame.current);
            clearTimeout(lightningTimer.current);
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('pointerdown', handlePointerDown);
            canvas.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [intensity, triggerLightning, onDraw]);

    return (
        <canvas
            ref={canvasRef}
            className="atmosphere-canvas"
            aria-hidden="true"
        />
    );
}
