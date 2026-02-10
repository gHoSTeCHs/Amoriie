import { memo, useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

import { adjustBrightness } from '@/lib/color-utils';
import type { LoveLetterViewerTheme } from '../types';

type UnfoldEnvelopeProps = {
    theme: LoveLetterViewerTheme;
    onSealBreak?: () => void;
    onComplete: () => void;
    reducedMotion?: boolean;
};

function UnfoldEnvelope({
    theme,
    onSealBreak,
    onComplete,
    reducedMotion = false,
}: UnfoldEnvelopeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const outerWrapRef = useRef<HTMLDivElement>(null);
    const leftFoldRef = useRef<HTMLDivElement>(null);
    const rightFoldRef = useRef<HTMLDivElement>(null);
    const centerPanelRef = useRef<HTMLDivElement>(null);
    const letterRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    const [stage, setStage] = useState<'closed' | 'opening' | 'revealed'>('closed');

    const speedMultiplier = theme.speedMultiplier;
    const goldColor = theme.accentColor || '#d4af37';

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

            gsap.set(leftFoldRef.current, { rotateY: 0 });
            gsap.set(rightFoldRef.current, { rotateY: 0 });
            gsap.set(centerPanelRef.current, { scale: 1, opacity: 1 });
            gsap.set(letterRef.current, { scale: 0.85, opacity: 0, y: 20 });
            gsap.set(glowRef.current, { opacity: 0, scale: 0.9 });

            tl.to(glowRef.current, {
                opacity: 0.6,
                scale: 1.1,
                duration: 0.4 * speedMultiplier,
                ease: 'power2.out',
            })
                .to(
                    glowRef.current,
                    {
                        opacity: 0.3,
                        scale: 1,
                        duration: 0.3 * speedMultiplier,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            setStage('opening');
                            onSealBreak?.();
                        },
                    },
                    '+=0.1'
                )
                .to(
                    leftFoldRef.current,
                    {
                        rotateY: -180,
                        duration: 0.8 * speedMultiplier,
                        ease: 'power2.inOut',
                    },
                    '-=0.1'
                )
                .to(
                    rightFoldRef.current,
                    {
                        rotateY: 180,
                        duration: 0.7 * speedMultiplier,
                        ease: 'power2.inOut',
                    },
                    '-=0.5'
                )
                .to(
                    [leftFoldRef.current, rightFoldRef.current],
                    {
                        opacity: 0,
                        duration: 0.3 * speedMultiplier,
                        ease: 'power2.in',
                    },
                    '-=0.2'
                )
                .to(
                    centerPanelRef.current,
                    {
                        scale: 0.9,
                        opacity: 0,
                        duration: 0.4 * speedMultiplier,
                        ease: 'power2.in',
                        onStart: () => setStage('revealed'),
                    },
                    '-=0.2'
                )
                .to(
                    glowRef.current,
                    {
                        opacity: 0,
                        scale: 1.3,
                        duration: 0.4 * speedMultiplier,
                        ease: 'power2.out',
                    },
                    '-=0.3'
                )
                .to(
                    letterRef.current,
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 0.5 * speedMultiplier,
                        ease: 'back.out(1.2)',
                    },
                    '-=0.3'
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
                        className="relative h-64 w-80 rounded-sm shadow-2xl"
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
                                Unveiling...
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
            style={{ perspective: '1200px' }}
        >
            {/* Golden glow effect */}
            <div
                ref={glowRef}
                className="pointer-events-none absolute h-96 w-96 rounded-full"
                style={{
                    background: `radial-gradient(circle, ${goldColor}40 0%, ${goldColor}20 30%, transparent 70%)`,
                    filter: 'blur(20px)',
                }}
            />

            <div ref={outerWrapRef} className="relative">
                {/* Center Panel - the base */}
                <div
                    ref={centerPanelRef}
                    className="relative h-56 w-44 sm:h-64 sm:w-52"
                    style={{
                        background: `linear-gradient(160deg, ${theme.paperColor} 0%, ${adjustBrightness(theme.paperColor, -5)} 100%)`,
                        boxShadow: `
                            0 25px 50px -12px rgba(0, 0, 0, 0.4),
                            inset 0 0 0 1px ${goldColor}30,
                            inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `,
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {/* Paper texture */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        }}
                    />

                    {/* Gold border frame */}
                    <div
                        className="absolute inset-2 rounded-sm"
                        style={{
                            border: `1px solid ${goldColor}50`,
                            boxShadow: `inset 0 0 20px ${goldColor}10`,
                        }}
                    />

                    {/* Corner ornaments */}
                    <OrnateCorner position="top-left" color={goldColor} />
                    <OrnateCorner position="top-right" color={goldColor} />
                    <OrnateCorner position="bottom-left" color={goldColor} />
                    <OrnateCorner position="bottom-right" color={goldColor} />

                    {/* Left Fold */}
                    <div
                        ref={leftFoldRef}
                        className="absolute bottom-0 left-0 top-0 w-full origin-left"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Front face */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(90deg, ${adjustBrightness(theme.paperColor, -3)} 0%, ${theme.paperColor} 100%)`,
                                backfaceVisibility: 'hidden',
                                boxShadow: `inset -2px 0 8px rgba(0,0,0,0.1)`,
                            }}
                        >
                            <div
                                className="absolute inset-0 opacity-15"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                                }}
                            />
                            {/* Gold edge trim */}
                            <div
                                className="absolute bottom-4 right-0 top-4 w-px"
                                style={{
                                    background: `linear-gradient(180deg, transparent 0%, ${goldColor} 20%, ${goldColor} 80%, transparent 100%)`,
                                }}
                            />
                            {/* Decorative seal impression */}
                            <div
                                className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
                                style={{
                                    background: `radial-gradient(circle, ${goldColor} 0%, transparent 70%)`,
                                }}
                            />
                        </div>

                        {/* Back face */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(270deg, ${adjustBrightness(theme.paperColor, -12)} 0%, ${adjustBrightness(theme.paperColor, -8)} 100%)`,
                                transform: 'rotateY(180deg)',
                                backfaceVisibility: 'hidden',
                            }}
                        >
                            <div
                                className="absolute bottom-4 left-0 top-4 w-px"
                                style={{
                                    background: `linear-gradient(180deg, transparent 0%, ${goldColor}60 20%, ${goldColor}60 80%, transparent 100%)`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Fold */}
                    <div
                        ref={rightFoldRef}
                        className="absolute bottom-0 right-0 top-0 w-full origin-right"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Front face */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(270deg, ${adjustBrightness(theme.paperColor, -3)} 0%, ${theme.paperColor} 100%)`,
                                backfaceVisibility: 'hidden',
                                boxShadow: `inset 2px 0 8px rgba(0,0,0,0.1)`,
                            }}
                        >
                            <div
                                className="absolute inset-0 opacity-15"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                                }}
                            />
                            {/* Gold edge trim */}
                            <div
                                className="absolute bottom-4 left-0 top-4 w-px"
                                style={{
                                    background: `linear-gradient(180deg, transparent 0%, ${goldColor} 20%, ${goldColor} 80%, transparent 100%)`,
                                }}
                            />
                            {/* Royal crest hint */}
                            <svg
                                className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 opacity-30"
                                viewBox="0 0 24 24"
                                fill={goldColor}
                            >
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                        </div>

                        {/* Back face */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(90deg, ${adjustBrightness(theme.paperColor, -12)} 0%, ${adjustBrightness(theme.paperColor, -8)} 100%)`,
                                transform: 'rotateY(180deg)',
                                backfaceVisibility: 'hidden',
                            }}
                        >
                            <div
                                className="absolute bottom-4 right-0 top-4 w-px"
                                style={{
                                    background: `linear-gradient(180deg, transparent 0%, ${goldColor}60 20%, ${goldColor}60 80%, transparent 100%)`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Revealed Letter */}
                <div
                    ref={letterRef}
                    className="absolute left-1/2 top-1/2 h-56 w-44 -translate-x-1/2 -translate-y-1/2 sm:h-64 sm:w-52"
                    style={{
                        background: `linear-gradient(170deg, #fffef9 0%, ${adjustBrightness(theme.paperColor, 8)} 50%, ${theme.paperColor} 100%)`,
                        boxShadow: `
                            0 30px 60px -15px rgba(0, 0, 0, 0.35),
                            0 0 0 1px ${goldColor}25,
                            inset 0 1px 0 rgba(255, 255, 255, 0.4)
                        `,
                    }}
                >
                    {/* Inner gold frame */}
                    <div
                        className="absolute inset-3 rounded-sm"
                        style={{
                            border: `1px solid ${goldColor}40`,
                        }}
                    />

                    {/* Letter content lines */}
                    <div className="absolute inset-6 flex flex-col gap-2 opacity-20">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="h-px rounded-full"
                                style={{
                                    backgroundColor: theme.inkColor,
                                    width: i === 0 ? '40%' : `${60 + Math.random() * 35}%`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Signature line */}
                    <div
                        className="absolute bottom-6 right-6 h-px w-16"
                        style={{
                            background: `linear-gradient(90deg, transparent 0%, ${theme.inkColor}40 100%)`,
                        }}
                    />

                    <OrnateCorner position="top-left" color={goldColor} size="sm" />
                    <OrnateCorner position="top-right" color={goldColor} size="sm" />
                    <OrnateCorner position="bottom-left" color={goldColor} size="sm" />
                    <OrnateCorner position="bottom-right" color={goldColor} size="sm" />
                </div>
            </div>
        </div>
    );
}

function OrnateCorner({
    position,
    color,
    size = 'md',
}: {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    color: string;
    size?: 'sm' | 'md';
}) {
    const dimensions = size === 'sm' ? 'h-4 w-4' : 'h-6 w-6';
    const offset = size === 'sm' ? '0.5rem' : '0.375rem';

    const positionStyles: Record<string, React.CSSProperties> = {
        'top-left': { top: offset, left: offset },
        'top-right': { top: offset, right: offset, transform: 'scaleX(-1)' },
        'bottom-left': { bottom: offset, left: offset, transform: 'scaleY(-1)' },
        'bottom-right': { bottom: offset, right: offset, transform: 'scale(-1)' },
    };

    return (
        <svg
            className={`absolute ${dimensions} opacity-50`}
            style={positionStyles[position]}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
        >
            <path d="M2 12 C2 6, 6 2, 12 2" />
            <path d="M2 8 C2 4.5, 4.5 2, 8 2" />
            <circle cx="4" cy="4" r="1" fill={color} />
        </svg>
    );
}

export default memo(UnfoldEnvelope);
