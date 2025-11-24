"use client";

import React, { useRef, useEffect, useCallback } from 'react';

const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const draw = useCallback((ctx: CanvasRenderingContext2D, particles: any[]) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = 'rgba(120, 119, 198, 0.2)';

        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
            ctx.fill();

            p.y -= p.s;
            if (p.y < -p.r) {
                p.y = ctx.canvas.height + p.r;
            }
        });

        requestAnimationFrame(() => draw(ctx, particles));
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let animationFrameId: number;
        let particles: any[] = [];

        const setCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            if (ctx) {
               ctx.scale(dpr, dpr);
            }
            particles = [];
            const numParticles = Math.floor(canvas.width / 50);

            for(let i = 0; i < numParticles; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 4 + 1, // radius
                    s: Math.random() * 0.5 + 0.2 // speed
                });
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            setCanvasSize();
        });

        resizeObserver.observe(canvas.parentElement!);
        
        setCanvasSize();
        animationFrameId = requestAnimationFrame(() => draw(ctx, particles));

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
        };
    }, [draw]);

    return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />;
};

export default ParticleBackground;
