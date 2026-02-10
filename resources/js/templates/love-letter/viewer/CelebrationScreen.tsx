import { memo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

import { adjustBrightness } from '@/lib/color-utils';
import type { LoveLetterViewerTheme } from './types';

type CelebrationScreenProps = {
    message: string;
    theme: LoveLetterViewerTheme;
};

const CELEBRATION_COLORS = ['#f43f5e', '#fb7185', '#fda4af', '#d4af37', '#fbbf24'];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.3,
        },
    },
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 300,
            damping: 25,
        },
    },
};

const heartVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -45 },
    visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 400,
            damping: 15,
            delay: 0.5,
        },
    },
};

const pulseVariants = {
    animate: {
        scale: [1, 1.08, 1],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut' as const,
        },
    },
};

function CelebrationScreen({ message, theme }: CelebrationScreenProps) {
    const textColor = theme.isDarkBackground ? '#f5f0e1' : '#2d1810';

    const fireConfetti = useCallback(() => {
        const defaults = {
            colors: CELEBRATION_COLORS,
            shapes: ['circle', 'square'] as confetti.Shape[],
            ticks: 200,
            gravity: 0.8,
            scalar: 1.2,
            drift: 0,
        };

        confetti({
            ...defaults,
            particleCount: 60,
            spread: 55,
            origin: { x: 0.2, y: 0.6 },
            angle: 60,
            startVelocity: 45,
        });

        confetti({
            ...defaults,
            particleCount: 60,
            spread: 55,
            origin: { x: 0.8, y: 0.6 },
            angle: 120,
            startVelocity: 45,
        });

        setTimeout(() => {
            confetti({
                ...defaults,
                particleCount: 100,
                spread: 100,
                origin: { x: 0.5, y: 0.5 },
                startVelocity: 35,
            });
        }, 250);
    }, []);

    useEffect(() => {
        fireConfetti();
        const interval = setInterval(fireConfetti, 4000);
        return () => clearInterval(interval);
    }, [fireConfetti]);

    return (
        <motion.div
            className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-12"
            style={{
                background: `
                    radial-gradient(ellipse 80% 60% at 50% 30%, ${theme.sealColor}15 0%, transparent 50%),
                    radial-gradient(ellipse 60% 40% at 30% 70%, ${theme.accentColor}10 0%, transparent 40%),
                    radial-gradient(ellipse 60% 40% at 70% 70%, ${theme.accentColor}08 0%, transparent 40%),
                    linear-gradient(180deg, ${theme.backgroundColor} 0%, ${adjustBrightness(theme.backgroundColor, -3)} 100%)
                `,
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Floating hearts */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${10 + (i * 7) % 80}%`,
                            bottom: '-10%',
                        }}
                        animate={{
                            y: [0, -window.innerHeight - 100],
                            x: [0, Math.sin(i) * 50],
                            rotate: [0, (i % 2 === 0 ? 1 : -1) * 360],
                            opacity: [0, 0.7, 0.7, 0],
                        }}
                        transition={{
                            duration: 6 + (i % 3) * 2,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: 'easeOut',
                        }}
                    >
                        <svg
                            className="h-6 w-6"
                            viewBox="0 0 24 24"
                            fill={i % 2 === 0 ? theme.sealColor : theme.accentColor}
                            opacity={0.4}
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </motion.div>
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex max-w-md flex-col items-center text-center">
                {/* Main heart */}
                <motion.div
                    variants={heartVariants}
                    className="mb-8"
                >
                    <motion.div variants={pulseVariants} animate="animate">
                        <svg
                            className="h-20 w-20 sm:h-24 sm:w-24"
                            viewBox="0 0 24 24"
                            style={{
                                filter: `drop-shadow(0 8px 30px ${theme.sealColor}70)`,
                            }}
                        >
                            <defs>
                                <linearGradient id="celebrationHeart" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={adjustBrightness(theme.sealColor, 25)} />
                                    <stop offset="50%" stopColor={theme.sealColor} />
                                    <stop offset="100%" stopColor={adjustBrightness(theme.sealColor, -15)} />
                                </linearGradient>
                            </defs>
                            <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                fill="url(#celebrationHeart)"
                            />
                        </svg>
                    </motion.div>
                </motion.div>

                {/* Celebration text */}
                <motion.h1
                    variants={itemVariants}
                    className="mb-6 text-4xl sm:text-5xl"
                    style={{
                        fontFamily: theme.headingFont,
                        color: textColor,
                        textShadow: `0 4px 30px ${theme.accentColor}30`,
                    }}
                >
                    Yes!
                </motion.h1>

                {/* Message */}
                <motion.p
                    variants={itemVariants}
                    className="mb-10 text-lg leading-relaxed sm:text-xl"
                    style={{
                        fontFamily: theme.bodyFont,
                        color: textColor,
                        opacity: 0.9,
                    }}
                >
                    {message}
                </motion.p>

                {/* Decorative divider */}
                <motion.div
                    variants={itemVariants}
                    className="mb-8 flex items-center gap-4"
                >
                    <div
                        className="h-px w-12"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${theme.accentColor}50)`,
                        }}
                    />
                    <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill={theme.accentColor}
                        opacity={0.5}
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <div
                        className="h-px w-12"
                        style={{
                            background: `linear-gradient(90deg, ${theme.accentColor}50, transparent)`,
                        }}
                    />
                </motion.div>

                {/* Create your own CTA */}
                <motion.div variants={itemVariants}>
                    <a
                        href="/"
                        className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] transition-all duration-300"
                        style={{
                            fontFamily: 'Cormorant Garamond, Georgia, serif',
                            color: theme.accentColor,
                            opacity: 0.7,
                        }}
                    >
                        <span className="transition-opacity group-hover:opacity-100">
                            Create your own
                        </span>
                        <svg
                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default memo(CelebrationScreen);
