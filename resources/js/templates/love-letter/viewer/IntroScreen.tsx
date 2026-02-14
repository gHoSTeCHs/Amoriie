import { memo } from 'react';
import { motion } from 'framer-motion';

import { adjustBrightness } from '@/lib/color-utils';
import type { LoveLetterViewerTheme } from './types';

type IntroScreenProps = {
    recipientName: string;
    senderName: string;
    theme: LoveLetterViewerTheme;
    onStart: () => void;
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3,
        },
    },
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 300,
            damping: 30,
        },
    },
};

const envelopeVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 200,
            damping: 25,
            delay: 0.1,
        },
    },
    hover: {
        scale: 1.02,
        y: -4,
        transition: {
            type: 'spring' as const,
            stiffness: 400,
            damping: 20,
        },
    },
    tap: {
        scale: 0.98,
    },
};

const sealVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
        scale: 1,
        rotate: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 300,
            damping: 20,
            delay: 0.6,
        },
    },
};

const pulseVariants = {
    initial: { opacity: 0.5 },
    animate: {
        opacity: [0.5, 1, 0.5],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut' as const,
        },
    },
};

function IntroScreen({ recipientName, theme, onStart }: IntroScreenProps) {
    const textColor = theme.isDarkBackground ? '#f5f0e1' : '#2d1810';
    const mutedColor = theme.isDarkBackground ? 'rgba(245, 240, 225, 0.6)' : 'rgba(45, 24, 16, 0.6)';

    return (
        <motion.div
            className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-12"
            style={{
                background: `
                    radial-gradient(ellipse 80% 50% at 50% 100%, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.03) 35%, transparent 70%),
                    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(255, 147, 41, 0.06) 0%, rgba(255, 147, 41, 0.02) 25%, transparent 60%),
                    radial-gradient(ellipse 60% 40% at 20% 80%, rgba(255, 147, 41, 0.04) 0%, rgba(255, 147, 41, 0.01) 25%, transparent 60%),
                    linear-gradient(180deg, ${theme.backgroundColor} 0%, ${adjustBrightness(theme.backgroundColor, -5)} 100%)
                `,
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Noise texture overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Vignette */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 45%, ${theme.backgroundColor}40 60%, ${theme.backgroundColor}90 80%, ${theme.backgroundColor} 100%)`,
                }}
            />

            {/* Header text */}
            <motion.p
                variants={itemVariants}
                className="mb-2 text-sm uppercase tracking-[0.3em]"
                style={{
                    color: mutedColor,
                    fontFamily: 'Cormorant Garamond, Georgia, serif',
                }}
            >
                A letter awaits
            </motion.p>

            {/* Recipient name */}
            <motion.h1
                variants={itemVariants}
                className="mb-8 text-center text-4xl sm:mb-12 sm:text-5xl md:text-6xl"
                style={{
                    fontFamily: theme.headingFont,
                    color: textColor,
                    textShadow: '0 2px 20px rgba(212, 175, 55, 0.15)',
                }}
            >
                For {recipientName}
            </motion.h1>

            {/* Envelope */}
            <motion.button
                variants={envelopeVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={onStart}
                className="group relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
                style={{
                    ['--tw-ring-color' as string]: theme.accentColor,
                    ['--tw-ring-offset-color' as string]: theme.backgroundColor,
                } as React.CSSProperties}
                aria-label={`Open letter for ${recipientName}`}
            >
                {/* Envelope glow */}
                <div
                    className="absolute -inset-8 rounded-3xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                        background: `radial-gradient(circle, ${theme.accentColor}30 0%, transparent 70%)`,
                    }}
                />

                {/* Envelope body */}
                <div
                    className="relative h-44 w-64 overflow-hidden rounded-sm shadow-2xl sm:h-52 sm:w-72"
                    style={{
                        background: `linear-gradient(145deg, ${theme.paperColor} 0%, ${adjustBrightness(theme.paperColor, -8)} 100%)`,
                        boxShadow: `
                            0 25px 60px -15px rgba(0, 0, 0, 0.5),
                            0 10px 30px -10px rgba(0, 0, 0, 0.3),
                            inset 0 1px 0 rgba(255, 255, 255, 0.1)
                        `,
                    }}
                >
                    {/* Paper texture */}
                    <div
                        className="absolute inset-0 opacity-40"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23paper)'/%3E%3C/svg%3E")`,
                        }}
                    />

                    {/* Envelope flap (triangular) */}
                    <div
                        className="absolute left-0 right-0 top-0 h-28 sm:h-32"
                        style={{
                            background: `linear-gradient(180deg, ${adjustBrightness(theme.paperColor, -3)} 0%, ${theme.paperColor} 100%)`,
                            clipPath: 'polygon(0 0, 50% 85%, 100% 0)',
                            boxShadow: 'inset 0 -1px 0 rgba(0, 0, 0, 0.05)',
                        }}
                    />

                    {/* Inner shadow for depth */}
                    <div
                        className="absolute inset-0"
                        style={{
                            boxShadow: 'inset 0 -30px 40px -30px rgba(139, 90, 43, 0.1)',
                        }}
                    />
                </div>

                {/* Wax seal */}
                <motion.div
                    variants={sealVariants}
                    className="absolute left-1/2 top-16 z-10 -translate-x-1/2 sm:top-20"
                >
                    <div
                        className="relative flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16"
                        style={{
                            background: `radial-gradient(circle at 35% 35%, ${adjustBrightness(theme.sealColor, 25)} 0%, ${theme.sealColor} 45%, ${adjustBrightness(theme.sealColor, -25)} 100%)`,
                            boxShadow: `
                                0 6px 20px rgba(0, 0, 0, 0.4),
                                0 2px 8px rgba(0, 0, 0, 0.3),
                                inset 0 2px 4px rgba(255, 255, 255, 0.2),
                                inset 0 -3px 6px rgba(0, 0, 0, 0.3)
                            `,
                        }}
                    >
                        {/* Inner ring */}
                        <div
                            className="absolute inset-2 rounded-full"
                            style={{
                                background: `radial-gradient(circle at 40% 40%, ${adjustBrightness(theme.sealColor, 15)} 0%, ${theme.sealColor} 100%)`,
                                boxShadow: `
                                    inset 0 1px 3px rgba(255, 255, 255, 0.25),
                                    inset 0 -2px 4px rgba(0, 0, 0, 0.2)
                                `,
                            }}
                        />

                        {/* Heart emblem */}
                        <svg
                            className="relative z-10 h-5 w-5 sm:h-6 sm:w-6"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                fill={adjustBrightness(theme.sealColor, -15)}
                                style={{
                                    filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.2))',
                                }}
                            />
                        </svg>
                    </div>

                    {/* Seal drip effects */}
                    <div
                        className="absolute -bottom-1 left-1/2 h-3 w-2 -translate-x-1/2 rounded-b-full"
                        style={{
                            background: `linear-gradient(180deg, ${theme.sealColor} 0%, ${adjustBrightness(theme.sealColor, -20)} 100%)`,
                        }}
                    />
                </motion.div>
            </motion.button>

            {/* CTA text */}
            <motion.div
                variants={itemVariants}
                className="mt-10 flex flex-col items-center sm:mt-14"
            >
                <motion.p
                    variants={pulseVariants}
                    initial="initial"
                    animate="animate"
                    className="text-sm tracking-wide"
                    style={{
                        color: theme.accentColor,
                        fontFamily: 'Cormorant Garamond, Georgia, serif',
                    }}
                >
                    Tap the seal to reveal
                </motion.p>

                {/* Decorative line */}
                <motion.div
                    className="mt-4 h-px w-16"
                    style={{
                        background: `linear-gradient(90deg, transparent 0%, ${theme.accentColor}50 50%, transparent 100%)`,
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                />
            </motion.div>

            {/* Bottom flourish */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                <svg
                    className="h-6 w-32"
                    viewBox="0 0 120 20"
                    fill="none"
                    style={{ color: theme.accentColor }}
                >
                    <path
                        d="M0 10 Q30 0 60 10 Q90 20 120 10"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        fill="none"
                        opacity="0.5"
                    />
                    <circle cx="60" cy="10" r="2" fill="currentColor" opacity="0.4" />
                </svg>
            </motion.div>
        </motion.div>
    );
}

export default memo(IntroScreen);
