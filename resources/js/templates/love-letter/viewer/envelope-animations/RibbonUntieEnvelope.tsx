import { memo, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

import { adjustBrightness } from '@/lib/color-utils';
import type { LoveLetterViewerTheme } from '../types';

type RibbonUntieEnvelopeProps = {
    theme: LoveLetterViewerTheme;
    onSealBreak?: () => void;
    onComplete: () => void;
    reducedMotion?: boolean;
};

function RibbonUntieEnvelope({
    theme,
    onSealBreak,
    onComplete,
    reducedMotion = false,
}: RibbonUntieEnvelopeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const envelopeRef = useRef<HTMLDivElement>(null);
    const flapRef = useRef<HTMLDivElement>(null);
    const ribbonRef = useRef<HTMLDivElement>(null);
    const bowRef = useRef<HTMLDivElement>(null);
    const leftLoopRef = useRef<HTMLDivElement>(null);
    const rightLoopRef = useRef<HTMLDivElement>(null);
    const leftTailRef = useRef<HTMLDivElement>(null);
    const rightTailRef = useRef<HTMLDivElement>(null);
    const letterRef = useRef<HTMLDivElement>(null);

    const speedMultiplier = theme.speedMultiplier;
    const ribbonColor = theme.sealColor || '#e8a4b8';

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

            gsap.set(bowRef.current, { rotate: 0, scale: 1 });
            gsap.set(leftLoopRef.current, { rotate: 0, x: 0, opacity: 1 });
            gsap.set(rightLoopRef.current, { rotate: 0, x: 0, opacity: 1 });
            gsap.set(leftTailRef.current, { rotate: 0, y: 0, opacity: 1 });
            gsap.set(rightTailRef.current, { rotate: 0, y: 0, opacity: 1 });
            gsap.set(ribbonRef.current, { opacity: 1, y: 0 });
            gsap.set(flapRef.current, { rotateX: 0, rotateY: 0 });
            gsap.set(envelopeRef.current, { opacity: 1, y: 0, scale: 1 });
            gsap.set(letterRef.current, { y: 0, opacity: 1, scale: 1 });

            tl.to(bowRef.current, {
                rotate: 5,
                duration: 0.1 * speedMultiplier,
                ease: 'power1.inOut',
            })
                .to(bowRef.current, {
                    rotate: -5,
                    duration: 0.1 * speedMultiplier,
                    ease: 'power1.inOut',
                })
                .to(bowRef.current, {
                    rotate: 0,
                    scale: 1.05,
                    duration: 0.1 * speedMultiplier,
                    ease: 'power1.out',
                    onComplete: () => onSealBreak?.(),
                })
                .to(
                    leftLoopRef.current,
                    {
                        rotate: -45,
                        x: -30,
                        scale: 0.8,
                        duration: 0.35 * speedMultiplier,
                        ease: 'power2.out',
                    },
                    '-=0.05'
                )
                .to(
                    rightLoopRef.current,
                    {
                        rotate: 45,
                        x: 30,
                        scale: 0.8,
                        duration: 0.35 * speedMultiplier,
                        ease: 'power2.out',
                    },
                    '<'
                )
                .to(
                    leftTailRef.current,
                    {
                        rotate: -20,
                        y: 15,
                        duration: 0.3 * speedMultiplier,
                        ease: 'power2.out',
                    },
                    '-=0.25'
                )
                .to(
                    rightTailRef.current,
                    {
                        rotate: 20,
                        y: 15,
                        duration: 0.3 * speedMultiplier,
                        ease: 'power2.out',
                    },
                    '<'
                )
                .to(
                    ribbonRef.current,
                    {
                        opacity: 0,
                        y: 40,
                        duration: 0.35 * speedMultiplier,
                        ease: 'power2.in',
                    },
                    '-=0.1'
                )
                .to(
                    flapRef.current,
                    {
                        rotateX: -160,
                        rotateY: -12,
                        duration: 0.6 * speedMultiplier,
                        ease: 'power2.inOut',
                    },
                    '-=0.15'
                )
                .to(
                    letterRef.current,
                    {
                        y: -160,
                        duration: 0.5 * speedMultiplier,
                        ease: 'power3.out',
                    },
                    '-=0.25'
                )
                .to(
                    envelopeRef.current,
                    {
                        opacity: 0,
                        y: 30,
                        scale: 0.95,
                        duration: 0.4 * speedMultiplier,
                        ease: 'power2.in',
                    },
                    '-=0.2'
                )
                .to(
                    letterRef.current,
                    {
                        y: -200,
                        scale: 1.1,
                        duration: 0.35 * speedMultiplier,
                        ease: 'back.out(1.2)',
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
                                Unwrapping...
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
                        className="relative h-52 w-72 overflow-hidden rounded-md sm:h-60 sm:w-80"
                        style={{
                            background: `linear-gradient(155deg, ${adjustBrightness(theme.paperColor, 5)} 0%, ${theme.paperColor} 50%, ${adjustBrightness(theme.paperColor, -5)} 100%)`,
                            boxShadow: `
                                0 25px 50px -15px rgba(0, 0, 0, 0.25),
                                0 10px 20px -10px rgba(0, 0, 0, 0.15),
                                0 0 0 1px ${adjustBrightness(theme.paperColor, -10)}20,
                                inset 0 1px 0 rgba(255, 255, 255, 0.3)
                            `,
                            borderRadius: '6px',
                        }}
                    >
                        {/* Soft paper texture */}
                        <div
                            className="absolute inset-0 opacity-15"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                            }}
                        />

                        {/* Subtle inner glow */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
                            }}
                        />

                        {/* Letter inside envelope */}
                        <div
                            ref={letterRef}
                            className="absolute bottom-3 left-1/2 h-44 w-60 -translate-x-1/2 rounded sm:h-52 sm:w-68"
                            style={{
                                background: `linear-gradient(175deg, #fffefb 0%, ${adjustBrightness(theme.paperColor, 8)} 100%)`,
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                                borderRadius: '4px',
                            }}
                        >
                            {/* Letter lines */}
                            <div className="absolute inset-4 flex flex-col gap-2.5 opacity-20">
                                {[...Array(7)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-px rounded-full"
                                        style={{
                                            backgroundColor: theme.inkColor,
                                            width: i === 0 ? '35%' : `${55 + Math.random() * 40}%`,
                                        }}
                                    />
                                ))}
                            </div>
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
                                background: `linear-gradient(180deg, ${adjustBrightness(theme.paperColor, 2)} 0%, ${theme.paperColor} 100%)`,
                                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                                backfaceVisibility: 'hidden',
                                borderRadius: '6px 6px 0 0',
                            }}
                        >
                            <div
                                className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                                }}
                            />
                        </div>

                        {/* Flap back */}
                        <div
                            className="absolute left-0 right-0 h-28 origin-top sm:h-32"
                            style={{
                                background: `linear-gradient(0deg, ${adjustBrightness(theme.paperColor, -10)} 0%, ${adjustBrightness(theme.paperColor, -5)} 100%)`,
                                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                                transform: 'rotateX(180deg)',
                                backfaceVisibility: 'hidden',
                            }}
                        />
                    </div>

                    {/* Ribbon System */}
                    <div
                        ref={ribbonRef}
                        className="absolute left-0 right-0 top-1/2 z-20 -translate-y-1/2"
                    >
                        {/* Horizontal ribbon band */}
                        <div
                            className="absolute left-0 right-0 top-1/2 h-5 -translate-y-1/2 sm:h-6"
                            style={{
                                background: `linear-gradient(180deg,
                                    ${adjustBrightness(ribbonColor, 15)} 0%,
                                    ${ribbonColor} 30%,
                                    ${adjustBrightness(ribbonColor, -5)} 50%,
                                    ${ribbonColor} 70%,
                                    ${adjustBrightness(ribbonColor, 10)} 100%
                                )`,
                                boxShadow: `
                                    0 2px 6px rgba(0,0,0,0.15),
                                    inset 0 1px 0 rgba(255,255,255,0.4),
                                    inset 0 -1px 0 rgba(0,0,0,0.1)
                                `,
                            }}
                        />

                        {/* Bow container */}
                        <div
                            ref={bowRef}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                            {/* Center knot */}
                            <div
                                className="relative z-10 h-5 w-6 rounded-sm sm:h-6 sm:w-7"
                                style={{
                                    background: `linear-gradient(135deg,
                                        ${adjustBrightness(ribbonColor, 10)} 0%,
                                        ${ribbonColor} 50%,
                                        ${adjustBrightness(ribbonColor, -10)} 100%
                                    )`,
                                    boxShadow: `
                                        0 2px 4px rgba(0,0,0,0.2),
                                        inset 0 1px 0 rgba(255,255,255,0.3)
                                    `,
                                }}
                            />

                            {/* Left loop */}
                            <div
                                ref={leftLoopRef}
                                className="absolute right-full top-1/2 mr-0.5 -translate-y-1/2"
                                style={{
                                    width: '32px',
                                    height: '22px',
                                    background: `linear-gradient(160deg,
                                        ${adjustBrightness(ribbonColor, 20)} 0%,
                                        ${ribbonColor} 40%,
                                        ${adjustBrightness(ribbonColor, -8)} 100%
                                    )`,
                                    borderRadius: '50% 20% 50% 80% / 60% 40% 60% 40%',
                                    boxShadow: `
                                        0 2px 6px rgba(0,0,0,0.15),
                                        inset 1px 1px 0 rgba(255,255,255,0.4)
                                    `,
                                    transformOrigin: 'right center',
                                }}
                            />

                            {/* Right loop */}
                            <div
                                ref={rightLoopRef}
                                className="absolute left-full top-1/2 ml-0.5 -translate-y-1/2"
                                style={{
                                    width: '32px',
                                    height: '22px',
                                    background: `linear-gradient(200deg,
                                        ${adjustBrightness(ribbonColor, 20)} 0%,
                                        ${ribbonColor} 40%,
                                        ${adjustBrightness(ribbonColor, -8)} 100%
                                    )`,
                                    borderRadius: '20% 50% 80% 50% / 40% 60% 40% 60%',
                                    boxShadow: `
                                        0 2px 6px rgba(0,0,0,0.15),
                                        inset -1px 1px 0 rgba(255,255,255,0.4)
                                    `,
                                    transformOrigin: 'left center',
                                }}
                            />

                            {/* Left tail */}
                            <div
                                ref={leftTailRef}
                                className="absolute left-1/2 top-full -ml-3"
                                style={{
                                    width: '14px',
                                    height: '28px',
                                    background: `linear-gradient(170deg,
                                        ${ribbonColor} 0%,
                                        ${adjustBrightness(ribbonColor, -10)} 100%
                                    )`,
                                    clipPath: 'polygon(0 0, 100% 0, 70% 100%, 30% 80%)',
                                    boxShadow: '1px 2px 4px rgba(0,0,0,0.15)',
                                    transformOrigin: 'top center',
                                }}
                            />

                            {/* Right tail */}
                            <div
                                ref={rightTailRef}
                                className="absolute left-1/2 top-full ml-1"
                                style={{
                                    width: '14px',
                                    height: '32px',
                                    background: `linear-gradient(190deg,
                                        ${adjustBrightness(ribbonColor, 5)} 0%,
                                        ${adjustBrightness(ribbonColor, -12)} 100%
                                    )`,
                                    clipPath: 'polygon(0 0, 100% 0, 80% 85%, 20% 100%)',
                                    boxShadow: '-1px 2px 4px rgba(0,0,0,0.15)',
                                    transformOrigin: 'top center',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(RibbonUntieEnvelope);
