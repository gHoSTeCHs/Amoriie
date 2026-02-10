import { memo, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

import { adjustBrightness } from '@/lib/color-utils';
import type { LoveLetterViewerTheme } from '../types';

type SlideOutEnvelopeProps = {
    theme: LoveLetterViewerTheme;
    onSealBreak?: () => void;
    onComplete: () => void;
    reducedMotion?: boolean;
};

function SlideOutEnvelope({
    theme,
    onSealBreak,
    onComplete,
    reducedMotion = false,
}: SlideOutEnvelopeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const envelopeRef = useRef<HTMLDivElement>(null);
    const flapRef = useRef<HTMLDivElement>(null);
    const letterRef = useRef<HTMLDivElement>(null);
    const clipperRef = useRef<HTMLDivElement>(null);

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

            gsap.set(letterRef.current, { x: 0, opacity: 1, scale: 1 });
            gsap.set(flapRef.current, { rotateX: 0 });
            gsap.set(envelopeRef.current, { opacity: 1, y: 0 });

            tl.to(flapRef.current, {
                rotateX: -140,
                duration: 0.4 * speedMultiplier,
                ease: 'power2.out',
                onComplete: () => {
                    onSealBreak?.();
                },
            })
                .to(
                    letterRef.current,
                    {
                        x: 320,
                        duration: 0.6 * speedMultiplier,
                        ease: 'power3.out',
                    },
                    '-=0.1'
                )
                .to(
                    clipperRef.current,
                    {
                        opacity: 0,
                        duration: 0.2 * speedMultiplier,
                        ease: 'power2.in',
                    },
                    '-=0.3'
                )
                .to(
                    envelopeRef.current,
                    {
                        opacity: 0,
                        y: 40,
                        scale: 0.95,
                        duration: 0.4 * speedMultiplier,
                        ease: 'power2.in',
                    },
                    '-=0.2'
                )
                .to(
                    letterRef.current,
                    {
                        x: 0,
                        scale: 1.15,
                        duration: 0.35 * speedMultiplier,
                        ease: 'back.out(1.4)',
                    },
                    '-=0.15'
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
                                Opening...
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
            style={{ perspective: '1000px' }}
        >
            <div className="relative">
                {/* Envelope Container */}
                <div
                    ref={envelopeRef}
                    className="relative"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Envelope Body */}
                    <div
                        className="relative h-52 w-72 overflow-hidden rounded-sm sm:h-60 sm:w-80"
                        style={{
                            background: `linear-gradient(145deg, ${theme.paperColor} 0%, ${adjustBrightness(theme.paperColor, -8)} 100%)`,
                            boxShadow: `
                                0 20px 40px -12px rgba(0, 0, 0, 0.4),
                                0 0 0 1px ${adjustBrightness(theme.paperColor, -15)},
                                inset 0 1px 0 rgba(255, 255, 255, 0.15)
                            `,
                        }}
                    >
                        {/* Paper texture overlay */}
                        <div
                            className="absolute inset-0 opacity-25"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                            }}
                        />

                        {/* Horizontal fold line - mechanical detail */}
                        <div
                            className="absolute left-4 right-4 top-1/3 h-px"
                            style={{
                                background: `linear-gradient(90deg, transparent 0%, ${adjustBrightness(theme.paperColor, -12)} 20%, ${adjustBrightness(theme.paperColor, -12)} 80%, transparent 100%)`,
                            }}
                        />

                        {/* Side grooves for mechanical feel */}
                        <div
                            className="absolute bottom-4 left-2 top-4 w-px"
                            style={{
                                background: `linear-gradient(180deg, transparent 0%, ${adjustBrightness(theme.paperColor, -10)} 30%, ${adjustBrightness(theme.paperColor, -10)} 70%, transparent 100%)`,
                            }}
                        />
                        <div
                            className="absolute bottom-4 right-2 top-4 w-px"
                            style={{
                                background: `linear-gradient(180deg, transparent 0%, ${adjustBrightness(theme.paperColor, -10)} 30%, ${adjustBrightness(theme.paperColor, -10)} 70%, transparent 100%)`,
                            }}
                        />

                        {/* Clipper - hides letter overflow during slide */}
                        <div
                            ref={clipperRef}
                            className="absolute inset-0 overflow-hidden"
                        >
                            {/* Letter slot visual */}
                            <div
                                className="absolute left-8 right-8 top-1/2 -translate-y-1/2"
                                style={{
                                    height: '65%',
                                    background: adjustBrightness(theme.paperColor, -6),
                                    borderRadius: '2px',
                                    boxShadow: `inset 0 2px 8px rgba(0,0,0,0.1)`,
                                }}
                            />
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
                        {/* Flap front (visible when closed) */}
                        <div
                            className="absolute left-0 right-0 h-28 origin-top sm:h-32"
                            style={{
                                background: `linear-gradient(180deg, ${adjustBrightness(theme.paperColor, -3)} 0%, ${theme.paperColor} 100%)`,
                                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                backfaceVisibility: 'hidden',
                            }}
                        >
                            {/* Flap texture */}
                            <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                                }}
                            />

                            {/* Simple fold indicator - mechanical precision */}
                            <div
                                className="absolute left-1/2 top-8 h-12 w-px -translate-x-1/2 sm:top-10"
                                style={{
                                    background: `linear-gradient(180deg, ${adjustBrightness(theme.paperColor, -10)} 0%, transparent 100%)`,
                                }}
                            />
                        </div>

                        {/* Flap back (visible when opened) */}
                        <div
                            className="absolute left-0 right-0 h-28 origin-top sm:h-32"
                            style={{
                                background: `linear-gradient(0deg, ${adjustBrightness(theme.paperColor, -12)} 0%, ${adjustBrightness(theme.paperColor, -6)} 100%)`,
                                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                                transform: 'rotateX(180deg)',
                                backfaceVisibility: 'hidden',
                            }}
                        />
                    </div>
                </div>

                {/* Letter - positioned to slide out */}
                <div
                    ref={letterRef}
                    className="absolute left-1/2 top-1/2 h-44 w-64 -translate-x-1/2 -translate-y-1/2 rounded-sm sm:h-52 sm:w-72"
                    style={{
                        background: `linear-gradient(135deg, #fffef9 0%, ${adjustBrightness(theme.paperColor, 5)} 100%)`,
                        boxShadow: `
                            0 8px 24px rgba(0, 0, 0, 0.15),
                            0 2px 8px rgba(0, 0, 0, 0.1),
                            0 0 0 1px rgba(0,0,0,0.03)
                        `,
                    }}
                >
                    {/* Letter content preview lines */}
                    <div className="absolute inset-5 flex flex-col gap-2.5 opacity-25">
                        {[...Array(7)].map((_, i) => (
                            <div
                                key={i}
                                className="h-px rounded-full"
                                style={{
                                    backgroundColor: theme.inkColor,
                                    width: `${65 + Math.random() * 30}%`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Letter header decoration */}
                    <div
                        className="absolute left-5 right-5 top-4 h-px"
                        style={{
                            background: `linear-gradient(90deg, ${theme.inkColor}15 0%, ${theme.inkColor}30 50%, ${theme.inkColor}15 100%)`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default memo(SlideOutEnvelope);
