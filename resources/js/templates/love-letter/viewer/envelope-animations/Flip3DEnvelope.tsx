import { memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { AnimatePresence, motion } from 'framer-motion';

import { adjustBrightness } from '@/lib/color-utils';
import type { LoveLetterViewerTheme } from '../types';

const NOISE_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

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

function PaperTexture({ opacity = 0.15 }: { opacity?: number }) {
    return (
        <div
            className="pointer-events-none absolute inset-0"
            style={{
                opacity,
                backgroundImage: NOISE_URI,
                borderRadius: 'inherit',
            }}
        />
    );
}

function LetterLines({ color }: { color: string }) {
    const widths = useMemo(
        () => Array.from({ length: 7 }, () => `${55 + Math.random() * 38}%`),
        [],
    );

    return (
        <div className="absolute flex flex-col" style={{ inset: 20, gap: 9 }}>
            <div
                style={{
                    height: 2,
                    borderRadius: 1,
                    backgroundColor: color,
                    width: '38%',
                    opacity: 0.3,
                    marginBottom: 6,
                }}
            />
            {widths.map((w, i) => (
                <div
                    key={i}
                    style={{
                        height: 1,
                        borderRadius: 1,
                        backgroundColor: color,
                        width: w,
                        opacity: 0.15,
                    }}
                />
            ))}
            <div
                style={{
                    marginTop: 'auto',
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <div
                    style={{
                        height: 1,
                        borderRadius: 1,
                        backgroundColor: color,
                        width: '25%',
                        opacity: 0.2,
                    }}
                />
            </div>
        </div>
    );
}

function Flip3DEnvelope({
    theme,
    onSealBreak,
    onComplete,
    reducedMotion = false,
}: Flip3DEnvelopeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const envelopeRef = useRef<HTMLDivElement>(null);
    const sealRef = useRef<HTMLDivElement>(null);
    const letterRef = useRef<HTMLDivElement>(null);

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

            gsap.set(letterRef.current, { y: 0, opacity: 1, zIndex: 1 });
            gsap.set(sealRef.current, { scale: 1, opacity: 1 });

            tl.to(sealRef.current, {
                scale: 1.2,
                duration: 0.3 * speedMultiplier,
                ease: 'power2.out',
            })
                .to(sealRef.current, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.4 * speedMultiplier,
                    ease: 'power2.in',
                    onStart: () => {
                        setShowParticles(true);
                        onSealBreak?.();
                    },
                })
                .to(
                    letterRef.current,
                    {
                        y: -280,
                        zIndex: 30,
                        duration: 1.2 * speedMultiplier,
                        ease: 'power2.out',
                    },
                    '+=0.2',
                )
                .to(
                    envelopeRef.current,
                    {
                        opacity: 0,
                        scale: 0.95,
                        duration: 0.6 * speedMultiplier,
                        ease: 'power2.in',
                    },
                    '-=0.8',
                )
                .to(
                    letterRef.current,
                    {
                        scale: 1.08,
                        duration: 0.6 * speedMultiplier,
                        ease: 'power2.out',
                    },
                    '-=0.4',
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
                        className="relative w-[360px] rounded-lg shadow-2xl"
                        style={{
                            aspectRatio: '3/2',
                            backgroundColor: theme.paperColor,
                        }}
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
                style={{ perspective: 900, perspectiveOrigin: '50% 30%' }}
            >
                <div
                    ref={envelopeRef}
                    className="relative h-[200px] w-[300px] sm:h-[240px] sm:w-[360px]"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div className="pointer-events-none absolute top-[75px] right-0 left-0 z-50 flex justify-center sm:top-[90px]">
                        {showParticles &&
                            sealParticles.map((particle) => (
                                <div
                                    key={particle.id}
                                    className="absolute h-2.5 w-2.5 rounded-full"
                                    style={{
                                        background: `radial-gradient(circle, ${theme.sealColor} 0%, ${adjustBrightness(theme.sealColor, -12)} 100%)`,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
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

                    <div className="absolute top-[75px] right-0 left-0 z-40 flex justify-center sm:top-[90px]">
                        <div ref={sealRef}>
                            <div
                                className="relative flex h-14 w-14 items-center justify-center rounded-full"
                                style={{
                                    background: `radial-gradient(circle at 30% 30%, ${adjustBrightness(theme.sealColor, 8)} 0%, ${theme.sealColor} 50%, ${adjustBrightness(theme.sealColor, -8)} 100%)`,
                                    boxShadow: `
                                        0 4px 15px rgba(0, 0, 0, 0.4),
                                        inset 0 2px 4px rgba(255, 255, 255, 0.2),
                                        inset 0 -2px 4px rgba(0, 0, 0, 0.3)
                                    `,
                                }}
                            >
                                <div
                                    className="h-9 w-9 rounded-full"
                                    style={{
                                        background: `radial-gradient(circle at 40% 40%, ${adjustBrightness(theme.sealColor, 4)} 0%, ${theme.sealColor} 100%)`,
                                        boxShadow: `
                                            inset 0 1px 2px rgba(255, 255, 255, 0.3),
                                            inset 0 -1px 2px rgba(0, 0, 0, 0.2)
                                        `,
                                    }}
                                />

                                <svg
                                    className="absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2"
                                    viewBox="0 0 24 24"
                                    style={{
                                        filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))',
                                    }}
                                >
                                    <path
                                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                        fill={adjustBrightness(
                                            theme.sealColor,
                                            -4,
                                        )}
                                        opacity="0.6"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div
                        ref={letterRef}
                        className="absolute rounded-sm"
                        style={{
                            top: 14,
                            left: 22,
                            right: 22,
                            bottom: 14,
                            zIndex: 1,
                            background: `linear-gradient(175deg, #fffef7 0%, ${adjustBrightness(theme.paperColor, 3)} 40%, ${adjustBrightness(theme.paperColor, 1)} 100%)`,
                            boxShadow:
                                '0 1px 4px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(120,80,30,0.08)',
                        }}
                    >
                        <PaperTexture opacity={0.08} />
                        <LetterLines color={theme.inkColor} />
                    </div>

                    <div
                        className="absolute inset-0"
                        style={{
                            isolation: 'isolate',
                            zIndex: 2,
                        }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                zIndex: 1,
                                borderRadius: 3,
                                background: `linear-gradient(145deg, ${adjustBrightness(theme.paperColor, -2)} 0%, ${adjustBrightness(theme.paperColor, -6)} 100%)`,
                                boxShadow: `
                                    0 22px 50px rgba(0,0,0,0.45),
                                    0 0 0 1px rgba(120,80,30,0.12)
                                `,
                            }}
                        >
                            <PaperTexture opacity={0.15} />
                        </div>

                        <div
                            className="absolute top-0 left-0 h-full"
                            style={{
                                width: '52%',
                                zIndex: 2,
                                clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                                background: `linear-gradient(100deg, ${adjustBrightness(theme.paperColor, -2)} 0%, ${adjustBrightness(theme.paperColor, -5)} 70%, ${adjustBrightness(theme.paperColor, -6)} 100%)`,
                            }}
                        >
                            <PaperTexture opacity={0.12} />
                            <div
                                className="pointer-events-none absolute inset-0"
                                style={{
                                    boxShadow:
                                        'inset -8px 0 15px -10px rgba(100,70,30,0.08)',
                                }}
                            />
                        </div>

                        <div
                            className="absolute top-0 right-0 h-full"
                            style={{
                                width: '52%',
                                zIndex: 3,
                                clipPath: 'polygon(100% 0, 0 50%, 100% 100%)',
                                background: `linear-gradient(-100deg, ${adjustBrightness(theme.paperColor, -2)} 0%, ${adjustBrightness(theme.paperColor, -5)} 70%, ${adjustBrightness(theme.paperColor, -7)} 100%)`,
                            }}
                        >
                            <PaperTexture opacity={0.12} />
                            <div
                                className="pointer-events-none absolute inset-0"
                                style={{
                                    boxShadow:
                                        'inset 8px 0 15px -10px rgba(100,70,30,0.08)',
                                }}
                            />
                        </div>

                        <div
                            className="absolute right-0 bottom-0 left-0"
                            style={{
                                height: '62%',
                                zIndex: 4,
                                clipPath: 'polygon(0 100%, 50% 6%, 100% 100%)',
                                background: `linear-gradient(180deg, ${adjustBrightness(theme.paperColor, -2)} 0%, ${adjustBrightness(theme.paperColor, -4)} 50%, ${adjustBrightness(theme.paperColor, -6)} 100%)`,
                            }}
                        >
                            <PaperTexture opacity={0.14} />
                            <div
                                className="pointer-events-none absolute inset-0"
                                style={{
                                    boxShadow:
                                        'inset 0 6px 12px -6px rgba(100,70,30,0.1)',
                                }}
                            />
                        </div>

                        <svg
                            className="pointer-events-none absolute inset-0 h-full w-full"
                            viewBox="0 0 360 240"
                            preserveAspectRatio="none"
                            style={{ zIndex: 5 }}
                        >
                            <line
                                x1="0"
                                y1="240"
                                x2="180"
                                y2={240 * 0.41}
                                stroke={adjustBrightness(theme.paperColor, -12)}
                                strokeWidth="0.6"
                                opacity="0.18"
                            />
                            <line
                                x1="360"
                                y1="240"
                                x2="180"
                                y2={240 * 0.41}
                                stroke={adjustBrightness(theme.paperColor, -12)}
                                strokeWidth="0.6"
                                opacity="0.18"
                            />
                            <line
                                x1="0"
                                y1="0"
                                x2={360 * 0.52}
                                y2={240 * 0.5}
                                stroke={adjustBrightness(theme.paperColor, -10)}
                                strokeWidth="0.5"
                                opacity="0.14"
                            />
                            <line
                                x1="360"
                                y1="0"
                                x2={360 * 0.48}
                                y2={240 * 0.5}
                                stroke={adjustBrightness(theme.paperColor, -10)}
                                strokeWidth="0.5"
                                opacity="0.14"
                            />
                        </svg>
                    </div>

                    <div
                        className="absolute -top-px right-0 left-0 h-[130px] sm:h-[155px]"
                        style={{
                            zIndex: 10,
                            clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                            background: `linear-gradient(180deg, ${theme.paperColor} 0%, ${adjustBrightness(theme.paperColor, -2)} 50%, ${adjustBrightness(theme.paperColor, -5)} 100%)`,
                            borderRadius: '3px 3px 0 0',
                        }}
                    >
                        <PaperTexture opacity={0.18} />
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                boxShadow:
                                    'inset 0 -18px 28px -18px rgba(100,70,30,0.1)',
                            }}
                        />
                        <div
                            className="absolute top-[10%] right-[18%] left-[18%] h-px"
                            style={{
                                background: `linear-gradient(90deg, transparent 0%, ${adjustBrightness(theme.paperColor, -9)}55 50%, transparent 100%)`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default memo(Flip3DEnvelope);
