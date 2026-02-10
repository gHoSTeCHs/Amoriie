import { memo, useRef, useLayoutEffect, useState, useEffect } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions, Container } from '@tsparticles/engine';

import { adjustBrightness } from '@/lib/color-utils';
import type { LoveLetterViewerTheme } from '../types';

type PetalScatterEnvelopeProps = {
    theme: LoveLetterViewerTheme;
    onSealBreak?: () => void;
    onComplete: () => void;
    reducedMotion?: boolean;
};

function PetalScatterEnvelope({
    theme,
    onSealBreak,
    onComplete,
    reducedMotion = false,
}: PetalScatterEnvelopeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const envelopeRef = useRef<HTMLDivElement>(null);
    const envelopeBodyRef = useRef<HTMLDivElement>(null);
    const flapRef = useRef<HTMLDivElement>(null);
    const sealRef = useRef<HTMLDivElement>(null);
    const letterRef = useRef<HTMLDivElement>(null);
    const particlesContainerRef = useRef<Container | null>(null);

    const [particlesInit, setParticlesInit] = useState(false);
    const [showPetals, setShowPetals] = useState(false);

    const speedMultiplier = theme.speedMultiplier;
    const petalColor = theme.sealColor || '#f4a5b8';

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setParticlesInit(true);
        });
    }, []);

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

            gsap.set(envelopeBodyRef.current, { scale: 1 });
            gsap.set(flapRef.current, { rotateX: 0 });
            gsap.set(sealRef.current, { scale: 1, opacity: 1 });
            gsap.set(letterRef.current, { y: 0, opacity: 1, scale: 1 });
            gsap.set(envelopeRef.current, { opacity: 1, y: 0 });

            tl.to(envelopeBodyRef.current, {
                scale: 1.03,
                duration: 0.2 * speedMultiplier,
                ease: 'power2.out',
            })
                .to(envelopeBodyRef.current, {
                    scale: 1,
                    duration: 0.15 * speedMultiplier,
                    ease: 'power2.inOut',
                })
                .to(
                    sealRef.current,
                    {
                        scale: 1.2,
                        duration: 0.15 * speedMultiplier,
                        ease: 'power2.out',
                    },
                    '-=0.1'
                )
                .to(sealRef.current, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.2 * speedMultiplier,
                    ease: 'power2.in',
                    onStart: () => {
                        setShowPetals(true);
                        onSealBreak?.();
                    },
                })
                .to(
                    flapRef.current,
                    {
                        rotateX: -165,
                        duration: 0.7 * speedMultiplier,
                        ease: 'power2.inOut',
                    },
                    '-=0.1'
                )
                .to(
                    letterRef.current,
                    {
                        y: -170,
                        duration: 0.6 * speedMultiplier,
                        ease: 'power3.out',
                    },
                    '-=0.35'
                )
                .to(
                    envelopeRef.current,
                    {
                        opacity: 0,
                        y: 30,
                        scale: 0.95,
                        duration: 0.45 * speedMultiplier,
                        ease: 'power2.in',
                    },
                    '-=0.25'
                )
                .to(
                    letterRef.current,
                    {
                        y: -210,
                        scale: 1.12,
                        duration: 0.4 * speedMultiplier,
                        ease: 'back.out(1.3)',
                    },
                    '-=0.2'
                );
        }, containerRef);

        return () => ctx.revert();
    }, [speedMultiplier, reducedMotion, onSealBreak, onComplete]);

    const petalOptions: ISourceOptions = {
        fullScreen: false,
        fpsLimit: 60,
        particles: {
            number: {
                value: 0,
            },
            color: {
                value: [
                    petalColor,
                    adjustBrightness(petalColor, 15),
                    adjustBrightness(petalColor, -10),
                    '#ffd6e0',
                    '#ffb6c1',
                ],
            },
            shape: {
                type: 'circle',
            },
            opacity: {
                value: { min: 0.6, max: 0.9 },
                animation: {
                    enable: true,
                    speed: 0.8,
                    sync: false,
                    startValue: 'max',
                    destroy: 'min',
                },
            },
            size: {
                value: { min: 4, max: 12 },
            },
            move: {
                enable: true,
                speed: { min: 2, max: 6 },
                direction: 'outside',
                outModes: {
                    default: 'destroy',
                },
                random: true,
                straight: false,
            },
            rotate: {
                value: { min: 0, max: 360 },
                direction: 'random',
                animation: {
                    enable: true,
                    speed: 15,
                },
            },
            tilt: {
                enable: true,
                value: { min: 0, max: 360 },
                direction: 'random',
                animation: {
                    enable: true,
                    speed: 10,
                },
            },
            wobble: {
                enable: true,
                distance: 15,
                speed: { min: 5, max: 15 },
            },
            life: {
                duration: {
                    value: { min: 1.5, max: 3 },
                },
                count: 1,
            },
        },
        emitters: showPetals
            ? {
                  position: {
                      x: 50,
                      y: 50,
                  },
                  rate: {
                      quantity: 8,
                      delay: 0.05,
                  },
                  life: {
                      duration: 0.6,
                      count: 1,
                  },
                  size: {
                      width: 60,
                      height: 40,
                  },
              }
            : undefined,
        detectRetina: true,
        background: {
            color: 'transparent',
        },
    };

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
                        className="relative h-64 w-80 rounded-xl shadow-2xl"
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
                                Blooming...
                            </p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <div
            ref={containerRef}
            className="flex min-h-dvh items-center justify-center"
            style={{ perspective: '1100px' }}
        >
            {/* Petal particles layer */}
            {particlesInit && showPetals && (
                <div className="pointer-events-none absolute inset-0 z-30">
                    <Particles
                        id="petal-scatter"
                        className="h-full w-full"
                        options={petalOptions}
                        particlesLoaded={async (container) => {
                            particlesContainerRef.current = container ?? null;
                        }}
                    />
                </div>
            )}

            <div className="relative">
                {/* Envelope Container */}
                <div
                    ref={envelopeRef}
                    className="relative"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Envelope Body */}
                    <div
                        ref={envelopeBodyRef}
                        className="relative h-52 w-72 overflow-hidden sm:h-60 sm:w-80"
                        style={{
                            background: `linear-gradient(160deg, ${adjustBrightness(theme.paperColor, 8)} 0%, ${theme.paperColor} 50%, ${adjustBrightness(theme.paperColor, -3)} 100%)`,
                            boxShadow: `
                                0 25px 50px -15px rgba(0, 0, 0, 0.2),
                                0 10px 25px -10px rgba(0, 0, 0, 0.12),
                                inset 0 1px 0 rgba(255, 255, 255, 0.4),
                                0 0 0 1px ${adjustBrightness(theme.paperColor, -8)}15
                            `,
                            borderRadius: '8px',
                        }}
                    >
                        {/* Soft paper texture */}
                        <div
                            className="absolute inset-0 opacity-12"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                            }}
                        />

                        {/* Floral corner decorations */}
                        <FloralCorner position="top-left" color={petalColor} />
                        <FloralCorner position="top-right" color={petalColor} />
                        <FloralCorner position="bottom-left" color={petalColor} />
                        <FloralCorner position="bottom-right" color={petalColor} />

                        {/* Soft inner glow */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `radial-gradient(ellipse at 50% 40%, ${petalColor}10 0%, transparent 50%)`,
                            }}
                        />

                        {/* Letter inside */}
                        <div
                            ref={letterRef}
                            className="absolute bottom-3 left-1/2 h-44 w-60 -translate-x-1/2 sm:h-52 sm:w-68"
                            style={{
                                background: `linear-gradient(170deg, #fffefb 0%, ${adjustBrightness(theme.paperColor, 10)} 60%, ${theme.paperColor} 100%)`,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                borderRadius: '6px',
                            }}
                        >
                            {/* Letter lines */}
                            <div className="absolute inset-5 flex flex-col gap-2.5 opacity-18">
                                {[...Array(7)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-px rounded-full"
                                        style={{
                                            backgroundColor: theme.inkColor,
                                            width: i === 0 ? '30%' : `${50 + Math.random() * 45}%`,
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Tiny floral accent on letter */}
                            <svg
                                className="absolute bottom-4 right-4 h-6 w-6 opacity-20"
                                viewBox="0 0 24 24"
                                fill={petalColor}
                            >
                                <circle cx="12" cy="12" r="3" />
                                <ellipse cx="12" cy="6" rx="2.5" ry="4" />
                                <ellipse cx="12" cy="18" rx="2.5" ry="4" />
                                <ellipse cx="6" cy="12" rx="4" ry="2.5" />
                                <ellipse cx="18" cy="12" rx="4" ry="2.5" />
                            </svg>
                        </div>
                    </div>

                    {/* Envelope Flap */}
                    <div
                        ref={flapRef}
                        className="absolute -top-px left-0 right-0 origin-top"
                        style={{
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {/* Flap front */}
                        <div
                            className="absolute left-0 right-0 h-28 origin-top sm:h-32"
                            style={{
                                background: `linear-gradient(180deg, ${adjustBrightness(theme.paperColor, 5)} 0%, ${theme.paperColor} 100%)`,
                                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                                backfaceVisibility: 'hidden',
                                borderRadius: '8px 8px 0 0',
                            }}
                        >
                            <div
                                className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                                }}
                            />
                        </div>

                        {/* Flap back */}
                        <div
                            className="absolute left-0 right-0 h-28 origin-top sm:h-32"
                            style={{
                                background: `linear-gradient(0deg, ${adjustBrightness(theme.paperColor, -8)} 0%, ${adjustBrightness(theme.paperColor, -3)} 100%)`,
                                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                                transform: 'rotateX(180deg)',
                                backfaceVisibility: 'hidden',
                            }}
                        />

                        {/* Floral seal */}
                        <div
                            ref={sealRef}
                            className="absolute left-1/2 top-14 z-10 -translate-x-1/2 sm:top-16"
                        >
                            <div
                                className="relative flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14"
                                style={{
                                    background: `radial-gradient(circle at 35% 35%, ${adjustBrightness(petalColor, 20)} 0%, ${petalColor} 50%, ${adjustBrightness(petalColor, -15)} 100%)`,
                                    boxShadow: `
                                        0 4px 12px ${petalColor}50,
                                        inset 0 2px 4px rgba(255,255,255,0.3),
                                        inset 0 -2px 4px rgba(0,0,0,0.15)
                                    `,
                                }}
                            >
                                {/* Rose pattern in seal */}
                                <svg
                                    className="h-6 w-6 opacity-60 sm:h-7 sm:w-7"
                                    viewBox="0 0 24 24"
                                    fill={adjustBrightness(petalColor, -25)}
                                >
                                    <circle cx="12" cy="12" r="2.5" />
                                    <ellipse
                                        cx="12"
                                        cy="7"
                                        rx="2"
                                        ry="3.5"
                                        transform="rotate(0 12 12)"
                                    />
                                    <ellipse
                                        cx="12"
                                        cy="7"
                                        rx="2"
                                        ry="3.5"
                                        transform="rotate(72 12 12)"
                                    />
                                    <ellipse
                                        cx="12"
                                        cy="7"
                                        rx="2"
                                        ry="3.5"
                                        transform="rotate(144 12 12)"
                                    />
                                    <ellipse
                                        cx="12"
                                        cy="7"
                                        rx="2"
                                        ry="3.5"
                                        transform="rotate(216 12 12)"
                                    />
                                    <ellipse
                                        cx="12"
                                        cy="7"
                                        rx="2"
                                        ry="3.5"
                                        transform="rotate(288 12 12)"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FloralCorner({
    position,
    color,
}: {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    color: string;
}) {
    const positionStyles: Record<string, React.CSSProperties> = {
        'top-left': { top: '8px', left: '8px' },
        'top-right': { top: '8px', right: '8px', transform: 'scaleX(-1)' },
        'bottom-left': { bottom: '8px', left: '8px', transform: 'scaleY(-1)' },
        'bottom-right': { bottom: '8px', right: '8px', transform: 'scale(-1)' },
    };

    return (
        <svg
            className="absolute h-8 w-8 opacity-25"
            style={positionStyles[position]}
            viewBox="0 0 32 32"
            fill="none"
        >
            <path
                d="M4 28 Q4 16 16 4"
                stroke={color}
                strokeWidth="1.5"
                fill="none"
            />
            <circle cx="8" cy="8" r="3" fill={color} opacity="0.6" />
            <circle cx="5" cy="12" r="2" fill={color} opacity="0.4" />
            <circle cx="12" cy="5" r="2" fill={color} opacity="0.4" />
            <ellipse cx="10" cy="10" rx="1.5" ry="2.5" fill={color} opacity="0.5" transform="rotate(-45 10 10)" />
        </svg>
    );
}

export default memo(PetalScatterEnvelope);
