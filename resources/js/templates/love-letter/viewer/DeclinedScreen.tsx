import { memo } from 'react';
import { motion } from 'framer-motion';

import { adjustBrightness } from '@/lib/color-utils';
import type { LoveLetterViewerTheme } from './types';

type DeclinedScreenProps = {
    theme: LoveLetterViewerTheme;
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
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

function DeclinedScreen({ theme }: DeclinedScreenProps) {
    const textColor = theme.isDarkBackground ? '#f5f0e1' : '#2d1810';
    const mutedColor = theme.isDarkBackground
        ? 'rgba(245, 240, 225, 0.6)'
        : 'rgba(45, 24, 16, 0.6)';

    return (
        <motion.div
            className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-12"
            style={{
                background: `linear-gradient(180deg, ${theme.backgroundColor} 0%, ${adjustBrightness(theme.backgroundColor, -5)} 100%)`,
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Subtle vignette */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, ${theme.backgroundColor} 100%)`,
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex max-w-sm flex-col items-center text-center">
                {/* Heart icon */}
                <motion.div variants={itemVariants} className="mb-6">
                    <svg
                        className="h-12 w-12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={mutedColor}
                        strokeWidth="1"
                        opacity={0.5}
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </motion.div>

                {/* Message */}
                <motion.p
                    variants={itemVariants}
                    className="mb-8 text-lg leading-relaxed"
                    style={{
                        fontFamily: theme.bodyFont,
                        color: mutedColor,
                    }}
                >
                    That&apos;s okay. Thank you for reading this letter.
                </motion.p>

                {/* Decorative line */}
                <motion.div
                    variants={itemVariants}
                    className="mb-8 h-px w-16"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${mutedColor}, transparent)`,
                    }}
                />

                {/* Create your own CTA */}
                <motion.div variants={itemVariants}>
                    <a
                        href="/"
                        className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] transition-all duration-300"
                        style={{
                            fontFamily: 'Cormorant Garamond, Georgia, serif',
                            color: theme.accentColor,
                            opacity: 0.6,
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

export default memo(DeclinedScreen);
