import React, { useRef, useEffect, useCallback } from 'react';
import {
    WEATHER_PRESETS,
    spawnParticle,
    updateParticle,
    renderParticle,
    drawBird,
    drawBee,
    drawVolumetricCloud,
} from '../lib/particles';

export default function AtmosphereCanvas({ mood = 'neutral', intensity = 0.5, keywords: contextKeywords, bubbleEmit, drawEmit, onDraw, bellPos, bubblePositions = [] }) {
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
    const bgVideo = useRef(null);
    const targetBgVideo = useRef(null);
    const prevBgImage = useRef(null);
    const prevBgVideo = useRef(null);
    const isDrawing = useRef(false);

    const transitionSpeed = useRef(0.003);
    const lastAssetUrl = useRef(null);

    const pickNewAsset = useCallback((targetMoodName, force = false) => {
        const preset = WEATHER_PRESETS[targetMoodName];
        const pool = preset?.skyImages || [];
        if (pool.length === 0) return;

        const idx = Math.floor(Math.random() * pool.length);
        const selectedSrc = pool[idx];

        // Guard: Don't reload the same asset if it's already active or loading
        if (!force && selectedSrc === lastAssetUrl.current) return;
        lastAssetUrl.current = selectedSrc;

        // Randomized fade speed: 0.0005 (glacial) to 0.003 (standard)
        transitionSpeed.current = 0.0005 + Math.random() * 0.0025;

        const handleLoad = (asset, isVideo = false) => {
            // CROSS-FADE SWAP: Only capture the old baseline RIGHT as the new one is ready
            prevBgImage.current = targetBgImage.current || bgImage.current;
            prevBgVideo.current = targetBgVideo.current || bgVideo.current;

            if (isVideo) {
                targetBgVideo.current = asset;
                targetBgImage.current = null;
            } else {
                targetBgImage.current = asset;
                targetBgVideo.current = null;
            }
            transitionProgress.current = 0;
        };

        if (selectedSrc.toLowerCase().endsWith('.mp4')) {
            const video = document.createElement('video');
            video.src = selectedSrc;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.crossOrigin = "anonymous";
            video.oncanplay = () => {
                if (video.duration) {
                    video.currentTime = Math.random() * video.duration;
                }
                handleLoad(video, true);
            };
        } else {
            const img = new Image();
            img.src = selectedSrc;
            img.crossOrigin = "anonymous";
            img.onload = () => handleLoad(img, false);
        }
    }, []);

    // Handle mood changes with strict target protection
    useEffect(() => {
        if (mood !== targetMood.current) {
            targetMood.current = mood;
            pickNewAsset(mood);
        }
    }, [mood, pickNewAsset]);

    // Constant Atmospheric Bleed: Cycle images even if mood stays same
    useEffect(() => {
        const cycle = () => {
            const delay = 20000 + Math.random() * 30000; // 20-50 seconds (slower cycle)
            return setTimeout(() => {
                if (transitionProgress.current >= 1) {
                    pickNewAsset(targetMood.current, true); // Force a new asset from the same mood
                }
                timer = cycle();
            }, delay);
        };
        let timer = cycle();
        return () => clearTimeout(timer);
    }, [pickNewAsset]);

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

        for (let i = 0; i < (count || 12); i++) {
            // Spawn energy flow
            const energy = spawnParticle('energy', window.innerWidth, window.innerHeight, intensity, {
                x: originX,
                y: originY,
                tx: x,
                ty: y
            });
            if (energy) particles.current.push(energy);

            // Sentiment particles at destination (Explosion Spark)
            const p = spawnParticle(type, window.innerWidth, window.innerHeight, intensity, { x, y });
            if (p) {
                // High-velocity sparks for "Cosmic Burst" feel
                p.vx *= 2;
                p.vy *= 2;
                particles.current.push(p);
            }

            // Initial Burst (Neon Pulse)
            const m = spawnParticle('morph', window.innerWidth, window.innerHeight, intensity, {
                x, y, w: 100, h: 40, color: p?.color, isBurst: true
            });
            if (m) particles.current.push(m);
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

            // Transition logic (Slower for Emotional Bleed + Randomized Flux)
            if (transitionProgress.current < 1) {
                transitionProgress.current = Math.min(1, transitionProgress.current + transitionSpeed.current * dt);
                if (transitionProgress.current >= 1) {
                    currentMood.current = targetMood.current;
                    bgImage.current = targetBgImage.current;
                    bgVideo.current = targetBgVideo.current;
                    prevBgImage.current = null;
                    prevBgVideo.current = null;
                    clearTimeout(lightningTimer.current);
                    scheduleLightning();
                }
            } else {
                // Stabilize pointers once transition is locked
                bgImage.current = targetBgImage.current;
                bgVideo.current = targetBgVideo.current;
                prevBgImage.current = null;
                prevBgVideo.current = null;
            }

            // ─── Generative Art Layer ───
            const activeMood = transitionProgress.current >= 1 ? currentMood.current : targetMood.current;
            const preset = WEATHER_PRESETS[activeMood] || WEATHER_PRESETS.neutral;

            ctx.save();
            const time = timestamp * 0.0005;

            // Base layer: Slow, breathing gradient
            const grad = ctx.createRadialGradient(
                w / 2 + Math.sin(time * 0.2) * (w * 0.2),
                h / 2 + Math.cos(time * 0.3) * (h * 0.2),
                0,
                w / 2, h / 2, Math.max(w, h)
            );

            const [c1, c2] = preset.sky || ['#050508', '#0a0a12'];
            grad.addColorStop(0, c2);
            grad.addColorStop(1, c1);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Abstract "Ethereal" Layer (The Generative Part)
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = 0.15;

            for (let i = 0; i < 3; i++) {
                const shiftX = Math.sin(time * (0.3 + i * 0.1) + i) * (w * 0.15); // Slightly wider sweep
                const shiftY = Math.cos(time * (0.2 - i * 0.1) - i) * (h * 0.1);

                const abstractGrad = ctx.createRadialGradient(
                    w / 2 + shiftX, h / 2 + shiftY, 0,
                    w / 2 + shiftX, h / 2 + shiftY, w * (1.2 + i * 0.3) // Much wider gradient reach
                );

                // Mood-reactive accent colors
                const accent = i === 0 ? 'rgba(100, 100, 255, 0.4)' : (i === 1 ? 'rgba(255, 100, 255, 0.2)' : 'rgba(100, 255, 200, 0.1)');
                abstractGrad.addColorStop(0, accent);
                abstractGrad.addColorStop(1, 'transparent');

                ctx.fillStyle = abstractGrad;
                // Distorted Ovals - "The Ribbons"
                ctx.save();
                ctx.translate(w / 2 + shiftX, h / 2 + shiftY);
                ctx.rotate(time * 0.05 * (i + 1)); // Slower, more majestic rotation
                ctx.scale(4.0, 0.8); // Much wider X-scale to create edge-to-edge ribbons
                ctx.beginPath();
                ctx.arc(0, 0, w * 0.8, 0, Math.PI * 2); // Larger base radius
                ctx.fill();
                ctx.restore();
            }
            ctx.restore();

            // ─── Image/Video Texture Layer (Generative Obfuscation + Cross-fade) ───
            const renderMedia = (source, alpha, isPrev = false) => {
                if (!source) return;
                ctx.save();

                const drift = Math.sin(time * 0.05 + (isPrev ? 1.5 : 0)) * 15;
                const scaleRes = 1.02 + Math.cos(time * 0.1 + (isPrev ? 1.5 : 0)) * 0.01;
                const dynamicBlur = 4 + Math.sin(time * 0.2) * 3; // Crisper (4-7px)

                // Consistent alpha tracking to prevent dimming during swaps
                ctx.globalAlpha = alpha * 0.5;
                ctx.filter = `brightness(0.45) contrast(1.1) saturate(1.1) blur(${dynamicBlur}px)`;
                ctx.globalCompositeOperation = 'source-over'; // Standard blending is more stable than 'screen'

                const mWidth = source.videoWidth || source.width;
                const mHeight = source.videoHeight || source.height;

                const scale = Math.max(w / mWidth, h / mHeight) * scaleRes;
                const x = (w - mWidth * scale) / 2 + drift;
                const y = (h - mHeight * scale) / 2 + (drift * 0.5);

                // Primary layer
                ctx.drawImage(source, x, y, mWidth * scale, mHeight * scale);
                // "Ghost" Layer
                ctx.globalAlpha *= 0.4;
                ctx.drawImage(source, x - drift * 2, y - drift, mWidth * scale, mHeight * scale);

                ctx.restore();
            };

            const currentMedia = targetBgVideo.current || targetBgImage.current;
            const resMedia = prevBgVideo.current || prevBgImage.current;

            // CROSS-FADE DOCTRINE: The "resMedia" (legacy) fades OUT while "currentMedia" (new target) fades IN.
            if (resMedia && transitionProgress.current < 1) {
                renderMedia(resMedia, (1 - transitionProgress.current), true);
            }
            if (currentMedia) {
                renderMedia(currentMedia, transitionProgress.current);
            }

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

                                // NATURE DOCTRINE: Ultra-rare chance to spawn a tiny PACK of bees alongside a bird
                                if (type === 'bird' && Math.random() < 0.08) {
                                    const packSize = 1 + Math.floor(Math.random() * 2);
                                    const packLead = spawnParticle('bee', w, h, intensity);
                                    if (packLead) {
                                        for (let i = 0; i < packSize; i++) {
                                            const offsetBee = {
                                                ...packLead,
                                                x: packLead.x + (Math.random() - 0.5) * 30,
                                                y: packLead.y + (Math.random() - 0.5) * 30,
                                                phase: packLead.phase + i * 0.8, // Desync wings slightly
                                                _mood: activeMood
                                            };
                                            particles.current.push(offsetBee);
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }

            particles.current.forEach(p => {
                updateParticle(p, w, h, dt);

                // Handle Walker combat triggers
                if (p.type === 'walker' && p._shouldFire) {
                    p._shouldFire = false;
                    const proj = spawnParticle('projectile', w, h, intensity, p._fireDetails);
                    if (proj) particles.current.push(proj);
                }

                // Aggressive Cleanup: Relaxed for "Emotional Bleed"
                if (p._mood && p._mood !== targetMood.current) {
                    p.opacity *= 0.98; // Much slower fade out
                    if (p.opacity < 0.01) p.life = 0;
                }
            });

            particles.current = particles.current.filter(p => p.life > 0);

            // Advanced Rendering
            particles.current.forEach(p => {
                if (p.type === 'bird') {
                    drawBird(ctx, p.x, p.y, p.size, p.wingPhase, p.vx > 0, p.color, p.opacity);
                } else if (p.type === 'walker') {
                    drawWalker(ctx, p.x, p.y, p.size, p.walkPhase, p.vx > 0, p.color, p.opacity);
                } else if (p.type === 'cloud') {
                    drawVolumetricCloud(ctx, p);
                } else if (p.type === 'bee') {
                    drawBee(ctx, p);
                } else {
                    renderParticle(ctx, p);
                }
            });

            // ─── Cinematic Post-Processing ───

            // 1. Dynamic Synaptic Noise (Velvety Grain)
            ctx.save();
            ctx.globalCompositeOperation = 'overlay';
            ctx.globalAlpha = 0.05;
            for (let i = 0; i < 40; i++) { // Increased density
                const size = Math.random() * 2;
                ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
                ctx.fillRect(Math.random() * w, Math.random() * h, size, size);
            }
            ctx.restore();

            // 2. Cinematic Vignette (Depth focus)
            const vignette = ctx.createRadialGradient(w / 2, h / 2, w / 4, w / 2, h / 2, w * 0.8);
            vignette.addColorStop(0, 'rgba(5, 5, 8, 0)');
            vignette.addColorStop(1, 'rgba(5, 5, 8, 0.4)');
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, w, h);

            if (lightningFlash.current > 0) {
                ctx.fillStyle = `rgba(200, 210, 255, ${lightningFlash.current * 0.12})`;
                ctx.fillRect(0, 0, w, h);
                lightningFlash.current *= 0.85;
                if (lightningFlash.current < 0.01) lightningFlash.current = 0;
            }

            // Morphing Bubbles Layer (Gentle Ambient + Spitting Logic)
            if (bubblePositions && bubblePositions.length > 0) {
                bubblePositions.forEach(b => {
                    // Continuous "Spit" effect
                    const spitChance = b.sentiment === 'love' || b.sentiment === 'happy' ? 0.08 : 0.02;
                    if (Math.random() < spitChance * intensity * dt) {
                        const type = b.sentiment === 'love' ? 'heart' : (b.sentiment === 'angry' ? 'melt' : 'spark');
                        const p = spawnParticle(type, w, h, intensity, {
                            x: b.x + Math.random() * b.width,
                            y: b.y + b.height / 2
                        });
                        if (p) {
                            p.vx *= 0.5;
                            p.vy = type === 'melt' ? 1 : -1;
                            particles.current.push(p);
                        }
                    }

                    if (Math.random() < 0.005 * intensity) {
                        const m = spawnParticle('morph', w, h, intensity, {
                            x: b.x, y: b.y, w: b.width, h: b.height,
                            color: '150, 150, 255', // Softer atmospheric blue, never pure white
                            isBurst: false
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
