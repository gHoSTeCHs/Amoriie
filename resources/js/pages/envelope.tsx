import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import gsap from 'gsap';
import { AnimatePresence, motion } from 'framer-motion';

import { getTheme } from '@/templates/love-letter/themes';
import type { LoveLetterViewerTheme } from '@/templates/love-letter/viewer/types';

function adjustBrightness(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const NOISE_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function paperEase(t: number): number {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function PaperTexture({ opacity = 0.18 }: { opacity?: number }) {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                opacity,
                backgroundImage: NOISE_URI,
                pointerEvents: 'none',
                borderRadius: 'inherit',
            }}
        />
    );
}

function LetterLines({ color, count = 7 }: { color: string; count?: number }) {
    const widths = useMemo(
        () =>
            Array.from({ length: count }, () => `${55 + Math.random() * 38}%`),
        [count],
    );

    return (
        <div
            style={{
                position: 'absolute',
                inset: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 9,
            }}
        >
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

const SEAL_SIZE = 56;

type Flip3DEnvelopeProps = {
    theme: LoveLetterViewerTheme;
    onSealBreak?: () => void;
    onComplete: () => void;
    reducedMotion?: boolean;
};

const Flip3DEnvelope = memo(function Flip3DEnvelope({
    theme,
    onSealBreak,
    onComplete,
    reducedMotion = false,
}: Flip3DEnvelopeProps) {
    const PAPER = theme.paperColor;
    const INK = theme.inkColor;
    const SEAL = theme.sealColor;

    const W = 360;
    const H = 240;
    const FLAP_H = 155;

    const OPEN_DURATION = 1200;

    const flapRef = useRef<HTMLDivElement>(null);
    const sealRef = useRef<HTMLDivElement>(null);
    const letterRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const flippedRef = useRef(false);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const letterTimelineRef = useRef<gsap.core.Timeline | null>(null);
    const timeoutRef = useRef<number | null>(null);

    const [sealParticles] = useState(() => generateSealParticles(12));
    const [showParticles, setShowParticles] = useState(false);
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (timelineRef.current) timelineRef.current.kill();
            if (letterTimelineRef.current) letterTimelineRef.current.kill();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const applyFlapTransform = useCallback((angle: number) => {
        const flap = flapRef.current;
        if (!flap) return;

        flap.style.transform = `rotateX(${angle}deg)`;

        const pastMidpoint = Math.abs(angle) > 90;
        if (pastMidpoint !== flippedRef.current) {
            flippedRef.current = pastMidpoint;
            flap.style.zIndex = pastMidpoint ? '-1' : '10';
        }
    }, []);

    const animateFlap = useCallback(
        (onSettled?: () => void) => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);

            const from = 0;
            const to = -155;
            const duration = OPEN_DURATION;
            let startTime: number | null = null;

            function tick(now: number) {
                if (!startTime) startTime = now;

                const elapsed = now - startTime;
                const t = Math.min(elapsed / duration, 1);
                const angle = from + (to - from) * paperEase(t);

                applyFlapTransform(angle);

                if (t < 1) {
                    rafRef.current = requestAnimationFrame(tick);
                } else {
                    applyFlapTransform(to);
                    onSettled?.();
                }
            }

            rafRef.current = requestAnimationFrame(tick);
        },
        [applyFlapTransform],
    );

    const handleSealClick = useCallback(() => {
        if (isStarted) return;
        setIsStarted(true);

        if (reducedMotion) {
            timeoutRef.current = window.setTimeout(() => {
                onComplete();
            }, 800);
            return;
        }

        /**
         * Kill the CSS pulse animation via the ref before GSAP
         * takes over. This avoids both: (a) the flash frame from
         * React re-rendering with animation:'none', and (b) the
         * CSS animation fighting GSAP for the transform property.
         */
        if (sealRef.current) {
            sealRef.current.style.animation = 'none';
        }

        const tl = gsap.timeline();
        timelineRef.current = tl;

        tl.to(sealRef.current, {
            scale: 1.2,
            duration: 0.3,
            ease: 'power2.out',
        }).to(sealRef.current, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            onStart: () => {
                setShowParticles(true);
                onSealBreak?.();
            },
            onComplete: () => {
                animateFlap(() => {
                    if (letterRef.current) {
                        letterRef.current.style.zIndex = '30';
                    }

                    const letterTl = gsap.timeline({
                        onComplete: () => onComplete(),
                    });
                    letterTimelineRef.current = letterTl;

                    letterTl
                        .to(letterRef.current, {
                            y: -280,
                            duration: 1.5,
                            ease: 'power2.out',
                        })
                        .to(
                            letterRef.current,
                            {
                                scale: 1.08,
                                duration: 0.6,
                                ease: 'power2.out',
                            },
                            '-=0.6',
                        );
                });
            },
        });
    }, [isStarted, reducedMotion, onSealBreak, onComplete, animateFlap]);

    if (reducedMotion) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    className="flex min-h-dvh items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <button
                        onClick={handleSealClick}
                        disabled={isStarted}
                        className="flex flex-col items-center gap-4"
                    >
                        <div
                            className="relative rounded-lg shadow-2xl"
                            style={{
                                width: W,
                                height: H,
                                backgroundColor: PAPER,
                                opacity: isStarted ? 0.5 : 1,
                                transition: 'opacity 0.6s ease',
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p
                                    className="text-lg italic"
                                    style={{
                                        color: INK,
                                        fontFamily: theme.bodyFont,
                                        opacity: 0.6,
                                    }}
                                >
                                    {isStarted ? 'Opening...' : 'Tap to open'}
                                </p>
                            </div>
                        </div>
                    </button>
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
                @keyframes sealPulse {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
                    }
                    50% {
                        transform: scale(1.05);
                        box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.2);
                    }
                }
            `}</style>

            <div
                className="flex min-h-dvh flex-col items-center justify-center"
                style={{
                    background: `linear-gradient(160deg, ${theme.backgroundColor} 0%, ${adjustBrightness(theme.backgroundColor, -10)} 100%)`,
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                            'radial-gradient(ellipse at 50% 45%, rgba(200,160,80,0.05) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                <div
                    style={{
                        perspective: 900,
                        perspectiveOrigin: '50% 30%',
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            width: W,
                            height: H,
                        }}
                    >
                        {/* Particles — sibling, not child of seal */}
                        <div
                            ref={particlesRef}
                            className="pointer-events-none"
                            style={{
                                position: 'absolute',
                                top: FLAP_H * 0.65,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 50,
                            }}
                        >
                            {showParticles &&
                                sealParticles.map((particle) => (
                                    <div
                                        key={particle.id}
                                        style={{
                                            position: 'absolute',
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            background: `radial-gradient(circle, ${SEAL} 0%, ${adjustBrightness(SEAL, -30)} 100%)`,
                                            boxShadow:
                                                '0 2px 4px rgba(0,0,0,0.3)',
                                            animation:
                                                'sealParticleScatter 0.6s ease-out forwards',
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

                        {/*
                         * Seal — centered via left:50% + negative margin
                         * instead of translateX(-50%) so GSAP can animate
                         * scale/opacity without clobbering the centering.
                         */}
                        <div
                            ref={sealRef}
                            onClick={handleSealClick}
                            style={{
                                position: 'absolute',
                                top: FLAP_H * 0.58,
                                left: '50%',
                                marginLeft: -(SEAL_SIZE / 2),
                                zIndex: 40,
                                cursor: isStarted ? 'default' : 'pointer',
                                animation: !isStarted
                                    ? 'sealPulse 2s ease-in-out infinite'
                                    : 'none',
                            }}
                        >
                            <div
                                style={{
                                    width: SEAL_SIZE,
                                    height: SEAL_SIZE,
                                    borderRadius: '50%',
                                    background: `radial-gradient(circle at 30% 30%, ${adjustBrightness(SEAL, 20)} 0%, ${SEAL} 50%, ${adjustBrightness(SEAL, -20)} 100%)`,
                                    boxShadow: `
                                        0 4px 15px rgba(0, 0, 0, 0.4),
                                        inset 0 2px 4px rgba(255, 255, 255, 0.2),
                                        inset 0 -2px 4px rgba(0, 0, 0, 0.3)
                                    `,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'transform 0.2s',
                                }}
                                onMouseOver={(e) => {
                                    if (!isStarted)
                                        e.currentTarget.style.transform =
                                            'scale(1.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform =
                                        'scale(1)';
                                }}
                            >
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        background: `radial-gradient(circle at 40% 40%, ${adjustBrightness(SEAL, 10)} 0%, ${SEAL} 100%)`,
                                        boxShadow: `
                                            inset 0 1px 2px rgba(255, 255, 255, 0.3),
                                            inset 0 -1px 2px rgba(0, 0, 0, 0.2)
                                        `,
                                    }}
                                />
                                <svg
                                    style={{
                                        position: 'absolute',
                                        width: 22,
                                        height: 22,
                                        filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))',
                                    }}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                        fill={adjustBrightness(SEAL, -10)}
                                        opacity="0.6"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Letter — outside the isolated envelope body so GSAP can lift it above everything */}
                        <div
                            ref={letterRef}
                            style={{
                                position: 'absolute',
                                top: 14,
                                left: 22,
                                right: 22,
                                bottom: 14,
                                zIndex: 1,
                                borderRadius: 2,
                                background: `linear-gradient(175deg, #fffef7 0%, ${adjustBrightness(PAPER, 8)} 40%, ${adjustBrightness(PAPER, 2)} 100%)`,
                                boxShadow:
                                    '0 1px 4px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(120,80,30,0.08)',
                            }}
                        >
                            <PaperTexture opacity={0.08} />
                            <LetterLines color={INK} count={7} />
                        </div>

                        {/* Envelope body — isolated stacking context, rasterized once */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                isolation: 'isolate',
                                zIndex: 2,
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    zIndex: 1,
                                    borderRadius: 3,
                                    background: `linear-gradient(145deg, ${adjustBrightness(PAPER, -6)} 0%, ${adjustBrightness(PAPER, -16)} 100%)`,
                                    boxShadow: `
                                        0 22px 50px rgba(0,0,0,0.45),
                                        0 0 0 1px rgba(120,80,30,0.12)
                                    `,
                                }}
                            >
                                <PaperTexture opacity={0.15} />
                            </div>

                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: W * 0.52,
                                    height: H,
                                    zIndex: 2,
                                    clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                                    background: `linear-gradient(100deg, ${adjustBrightness(PAPER, -4)} 0%, ${adjustBrightness(PAPER, -12)} 70%, ${adjustBrightness(PAPER, -16)} 100%)`,
                                }}
                            >
                                <PaperTexture opacity={0.12} />
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        boxShadow:
                                            'inset -8px 0 15px -10px rgba(100,70,30,0.08)',
                                        pointerEvents: 'none',
                                    }}
                                />
                            </div>

                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: W * 0.52,
                                    height: H,
                                    zIndex: 3,
                                    clipPath:
                                        'polygon(100% 0, 0 50%, 100% 100%)',
                                    background: `linear-gradient(-100deg, ${adjustBrightness(PAPER, -5)} 0%, ${adjustBrightness(PAPER, -13)} 70%, ${adjustBrightness(PAPER, -17)} 100%)`,
                                }}
                            >
                                <PaperTexture opacity={0.12} />
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        boxShadow:
                                            'inset 8px 0 15px -10px rgba(100,70,30,0.08)',
                                        pointerEvents: 'none',
                                    }}
                                />
                            </div>

                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: H * 0.62,
                                    zIndex: 4,
                                    clipPath:
                                        'polygon(0 100%, 50% 6%, 100% 100%)',
                                    background: `linear-gradient(180deg, ${adjustBrightness(PAPER, -4)} 0%, ${adjustBrightness(PAPER, -10)} 50%, ${adjustBrightness(PAPER, -15)} 100%)`,
                                }}
                            >
                                <PaperTexture opacity={0.14} />
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        boxShadow:
                                            'inset 0 6px 12px -6px rgba(100,70,30,0.1)',
                                        pointerEvents: 'none',
                                    }}
                                />
                            </div>

                            <svg
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    pointerEvents: 'none',
                                    zIndex: 5,
                                }}
                                viewBox={`0 0 ${W} ${H}`}
                                preserveAspectRatio="none"
                            >
                                <line
                                    x1="0"
                                    y1={H}
                                    x2={W / 2}
                                    y2={H * 0.41}
                                    stroke={adjustBrightness(PAPER, -30)}
                                    strokeWidth="0.6"
                                    opacity="0.18"
                                />
                                <line
                                    x1={W}
                                    y1={H}
                                    x2={W / 2}
                                    y2={H * 0.41}
                                    stroke={adjustBrightness(PAPER, -30)}
                                    strokeWidth="0.6"
                                    opacity="0.18"
                                />
                                <line
                                    x1="0"
                                    y1="0"
                                    x2={W * 0.52}
                                    y2={H * 0.5}
                                    stroke={adjustBrightness(PAPER, -26)}
                                    strokeWidth="0.5"
                                    opacity="0.14"
                                />
                                <line
                                    x1={W}
                                    y1="0"
                                    x2={W * 0.48}
                                    y2={H * 0.5}
                                    stroke={adjustBrightness(PAPER, -26)}
                                    strokeWidth="0.5"
                                    opacity="0.14"
                                />
                            </svg>
                        </div>

                        {/* Flap — z-index toggles at 90° */}
                        <div
                            ref={flapRef}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: FLAP_H,
                                transformOrigin: 'top center',
                                transformStyle: 'preserve-3d',
                                transform: 'rotateX(0deg)',
                                willChange: 'transform',
                                zIndex: 10,
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                                    background: `linear-gradient(180deg, ${adjustBrightness(PAPER, 0)} 0%, ${adjustBrightness(PAPER, -6)} 50%, ${adjustBrightness(PAPER, -12)} 100%)`,
                                    backfaceVisibility: 'hidden',
                                    borderRadius: '3px 3px 0 0',
                                }}
                            >
                                <PaperTexture opacity={0.18} />
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        boxShadow:
                                            'inset 0 -18px 28px -18px rgba(100,70,30,0.1)',
                                        pointerEvents: 'none',
                                    }}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: '18%',
                                        right: '18%',
                                        top: '10%',
                                        height: 1,
                                        background: `linear-gradient(90deg, transparent 0%, ${adjustBrightness(PAPER, -22)}33 50%, transparent 100%)`,
                                    }}
                                />
                            </div>

                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
                                    background: `linear-gradient(180deg, ${adjustBrightness(PAPER, -6)} 0%, ${adjustBrightness(PAPER, -10)} 55%, ${adjustBrightness(PAPER, -16)} 100%)`,
                                    transform: 'rotateX(180deg)',
                                    backfaceVisibility: 'hidden',
                                }}
                            >
                                <PaperTexture opacity={0.12} />
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        boxShadow:
                                            'inset 0 -18px 25px -12px rgba(100,70,30,0.12)',
                                        pointerEvents: 'none',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

function buildTheme(): LoveLetterViewerTheme {
    const config = getTheme('midnight-candlelight');

    return {
        config,
        customization: {
            paper_color: config.palette.paper[0],
            ink_color: config.palette.ink[0],
            seal_color: config.palette.seal[0],
            heading_font: config.typography.heading_fonts[0],
            body_font: config.typography.body_fonts[0],
            signature_font: config.typography.signature_fonts[0],
            signature_style: 'handwritten',
            animation_speed: 'normal',
            sounds_enabled: false,
            show_borders: true,
            show_drop_cap: true,
            show_flourishes: true,
        },
        backgroundColor: config.palette.background,
        paperColor: config.palette.paper[0],
        inkColor: config.palette.ink[0],
        sealColor: config.palette.seal[0],
        accentColor: config.palette.accent[0],
        headingFont: config.typography.heading_fonts[0],
        bodyFont: config.typography.body_fonts[0],
        signatureFont: config.typography.signature_fonts[0],
        headingFontUrl: '',
        bodyFontUrl: '',
        signatureFontUrl: '',
        isDarkBackground: true,
        speedMultiplier: 1,
    };
}

export default function EnvelopePage() {
    const [key, setKey] = useState(0);
    const [completed, setCompleted] = useState(false);
    const theme = buildTheme();

    const handleSealBreak = () => {};

    const handleComplete = () => {
        setCompleted(true);
    };

    const handleReset = () => {
        setCompleted(false);
        setKey((k) => k + 1);
    };

    return (
        <>
            <Head title="Envelope Animation Test" />

            <div
                className="relative min-h-dvh"
                style={{ backgroundColor: theme.backgroundColor }}
            >
                {!completed ? (
                    <Flip3DEnvelope
                        key={key}
                        theme={theme}
                        onSealBreak={handleSealBreak}
                        onComplete={handleComplete}
                        reducedMotion={false}
                    />
                ) : (
                    <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
                        <p className="text-white/80">Animation completed</p>
                        <button
                            onClick={handleReset}
                            className="rounded-lg bg-white/10 px-6 py-3 text-white hover:bg-white/20"
                        >
                            Reset & Play Again
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
