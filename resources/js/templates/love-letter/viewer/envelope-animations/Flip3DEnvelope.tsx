import { memo, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { AnimatePresence, motion } from 'framer-motion';

import { adjustBrightness } from '@/lib/color-utils';
import type { LoveLetterViewerTheme } from '../types';

type Flip3DEnvelopeProps = {
    theme: LoveLetterViewerTheme;
    onSealBreak?: () => void;
    onComplete: () => void;
    reducedMotion?: boolean;
};

type SealParticle = {
    id: number;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    delay: number;
};

function generateSealParticles(count: number): SealParticle[] {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 120 - 40,
        rotation: Math.random() * 360,
        scale: 0.3 + Math.random() * 0.7,
        delay: Math.random() * 0.15,
    }));
}

function Flip3DEnvelope({
    theme,
    onSealBreak,
    onComplete,
    reducedMotion = false,
}: Flip3DEnvelopeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const envelopeRef = useRef<HTMLDivElement>(null);
    const flapRef = useRef<HTMLDivElement>(null);
    const sealRef = useRef<HTMLDivElement>(null);
    const letterRef = useRef<HTMLDivElement>(null);
    const sealParticlesRef = useRef<HTMLDivElement>(null);

    const [sealParticles] = useState(() => generateSealParticles(12));
    const [showParticles, setShowParticles] = useState(false);

    const speedMultiplier = theme.speedMultiplier;

    useLayoutEffect(() => {
        if (reducedMotion) {
            const timeout = setTimeout(() => {
                onComplete();
            }, 800);
            return () => clearTimeout(timeout);
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => onComplete(),
            });

            gsap.set(letterRef.current, { y: 0, opacity: 1 });
            gsap.set(flapRef.current, { rotateX: 0 });
            gsap.set(sealRef.current, { scale: 1, opacity: 1 });

            tl.to(sealRef.current, {
                scale: 1.15,
                duration: 0.25 * speedMultiplier,
                ease: 'power2.out',
            })
                .to(sealRef.current, {
                    scale: 0.9,
                    opacity: 0,
                    duration: 0.25 * speedMultiplier,
                    ease: 'power2.in',
                    onStart: () => {
                        setShowParticles(true);
                        onSealBreak?.();
                    },
                })
                .to(
                    flapRef.current,
                    {
                        rotateX: -180,
                        duration: 0.7 * speedMultiplier,
                        ease: 'power2.inOut',
                    },
                    '-=0.2',
                )
                .to(
                    letterRef.current,
                    {
                        y: -180,
                        duration: 0.8 * speedMultiplier,
                        ease: 'power3.out',
                    },
                    '-=0.3',
                )
                .to(
                    envelopeRef.current,
                    {
                        opacity: 0,
                        scale: 0.9,
                        y: 50,
                        duration: 0.5 * speedMultiplier,
                        ease: 'power2.in',
                    },
                    '-=0.3',
                )
                .to(
                    letterRef.current,
                    {
                        scale: 1.1,
                        y: -220,
                        duration: 0.4 * speedMultiplier,
                        ease: 'power2.out',
                    },
                    '-=0.2',
                );
        }, containerRef);

        return () => ctx.revert();
    }, [speedMultiplier, reducedMotion, onSealBreak, onComplete]);

    if (reducedMotion) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    className="flex min-h-dvh items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div
                        className="relative h-64 w-80 rounded-lg shadow-2xl"
                        style={{ backgroundColor: theme.paperColor }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p
                                className="text-lg italic opacity-60"
                                style={{
                                    color: theme.inkColor,
                                    fontFamily: theme.bodyFont,
                                }}
                            >
                                Opening...
                            </p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <>
            <style>{`
                @keyframes sealParticleScatter {
                    0% {
                        transform: translate(0, 0) rotate(0deg) scale(0.5);
                        opacity: 1;
                    }
                    30% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--particle-x), var(--particle-y)) rotate(var(--particle-rotation)) scale(var(--particle-scale));
                        opacity: 0;
                    }
                }
            `}</style>
            <div
                ref={containerRef}
                className="flex min-h-dvh items-center justify-center"
                style={{ perspective: '1200px' }}
            >
                <div
                    ref={envelopeRef}
                    className="relative"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div
                        className="relative h-56 w-72 overflow-hidden rounded-sm shadow-2xl sm:h-64 sm:w-80"
                        style={{
                            background: `linear-gradient(135deg, ${theme.paperColor} 0%, ${adjustBrightness(theme.paperColor, -10)} 100%)`,
                            boxShadow: `
                                0 25px 50px -12px rgba(0, 0, 0, 0.5),
                                0 0 0 1px rgba(139, 90, 43, 0.2),
                                inset 0 1px 0 rgba(255, 255, 255, 0.1)
                            `,
                        }}
                    >
                        <div
                            className="absolute inset-0 opacity-30"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                            }}
                        />

                        <div
                            className="absolute inset-0"
                            style={{
                                boxShadow:
                                    'inset 0 -20px 40px -20px rgba(139, 90, 43, 0.15)',
                            }}
                        />

                        <div
                            ref={letterRef}
                            className="absolute bottom-4 left-1/2 h-48 w-64 -translate-x-1/2 rounded-sm sm:h-56 sm:w-72"
                            style={{
                                background: `linear-gradient(180deg, #fffef9 0%, ${theme.paperColor} 100%)`,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            <div className="absolute inset-4 flex flex-col gap-3 opacity-20">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-px rounded-full"
                                        style={{
                                            backgroundColor: theme.inkColor,
                                            width: `${70 + Math.random() * 25}%`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div
                        ref={flapRef}
                        className="absolute -top-px right-0 left-0 origin-top"
                        style={{
                            transformStyle: 'preserve-3d',
                            backfaceVisibility: 'visible',
                        }}
                    >
                        <div
                            className="absolute right-0 left-0 h-32 origin-top sm:h-36"
                            style={{
                                background: `linear-gradient(180deg, ${adjustBrightness(theme.paperColor, -5)} 0%, ${theme.paperColor} 100%)`,
                                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                                backfaceVisibility: 'hidden',
                            }}
                        >
                            <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                                }}
                            />
                        </div>

                        <div
                            className="absolute right-0 left-0 h-32 origin-top sm:h-36"
                            style={{
                                background: `linear-gradient(0deg, ${adjustBrightness(theme.paperColor, -15)} 0%, ${adjustBrightness(theme.paperColor, -8)} 100%)`,
                                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                                transform: 'rotateX(180deg)',
                                backfaceVisibility: 'hidden',
                            }}
                        />

                        <div
                            ref={sealRef}
                            className="absolute top-16 left-1/2 z-10 -translate-x-1/2 sm:top-20"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <div
                                className="relative flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16"
                                style={{
                                    background: `radial-gradient(circle at 30% 30%, ${adjustBrightness(theme.sealColor, 20)} 0%, ${theme.sealColor} 50%, ${adjustBrightness(theme.sealColor, -20)} 100%)`,
                                    boxShadow: `
                                        0 4px 15px rgba(0, 0, 0, 0.4),
                                        inset 0 2px 4px rgba(255, 255, 255, 0.2),
                                        inset 0 -2px 4px rgba(0, 0, 0, 0.3)
                                    `,
                                }}
                            >
                                <div
                                    className="h-8 w-8 rounded-full sm:h-10 sm:w-10"
                                    style={{
                                        background: `radial-gradient(circle at 40% 40%, ${adjustBrightness(theme.sealColor, 10)} 0%, ${theme.sealColor} 100%)`,
                                        boxShadow: `
                                            inset 0 1px 2px rgba(255, 255, 255, 0.3),
                                            inset 0 -1px 2px rgba(0, 0, 0, 0.2)
                                        `,
                                    }}
                                />

                                <svg
                                    className="absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 sm:h-6 sm:w-6"
                                    viewBox="0 0 24 24"
                                    style={{
                                        filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))',
                                    }}
                                >
                                    <path
                                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                        fill={adjustBrightness(
                                            theme.sealColor,
                                            -10,
                                        )}
                                        opacity="0.6"
                                    />
                                </svg>
                            </div>

                            <div
                                ref={sealParticlesRef}
                                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            >
                                {showParticles &&
                                    sealParticles.map((particle) => (
                                        <div
                                            key={particle.id}
                                            className="absolute h-2 w-2 rounded-full sm:h-3 sm:w-3"
                                            style={{
                                                background: `radial-gradient(circle, ${theme.sealColor} 0%, ${adjustBrightness(theme.sealColor, -30)} 100%)`,
                                                boxShadow:
                                                    '0 2px 4px rgba(0,0,0,0.3)',
                                                animation: `sealParticleScatter 0.6s ease-out forwards`,
                                                animationDelay: `${particle.delay}s`,
                                                ['--particle-x' as string]: `${particle.x}px`,
                                                ['--particle-y' as string]: `${particle.y}px`,
                                                ['--particle-rotation' as string]: `${particle.rotation}deg`,
                                                ['--particle-scale' as string]:
                                                    particle.scale,
                                            }}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default memo(Flip3DEnvelope);
