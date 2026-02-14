import { memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { adjustBrightness } from '@/lib/color-utils';
import { useNoButtonBehavior } from '@/hooks/use-no-button-behavior';
import type { NoButtonBehavior } from '@/types/viewer';
import type { LoveLetterViewerTheme, ViewerResponse } from './types';

type FinalScreenProps = {
    recipientName: string;
    senderName: string;
    finalMessageText: string;
    askText: string;
    noButtonBehavior?: NoButtonBehavior;
    theme: LoveLetterViewerTheme;
    onResponse: (response: ViewerResponse) => void;
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
    hidden: { opacity: 0, y: 25 },
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

const heartVariants = {
    initial: { scale: 1 },
    animate: {
        scale: [1, 1.15, 1],
        transition: {
            duration: 1.2,
            repeat: Infinity,
            repeatDelay: 0.8,
            ease: 'easeInOut' as const,
        },
    },
};

const floatingHeartVariants = {
    initial: (i: number) => ({
        x: Math.cos((i * Math.PI * 2) / 5) * 80,
        y: Math.sin((i * Math.PI * 2) / 5) * 80,
        opacity: 0,
        scale: 0.5,
    }),
    animate: (i: number) => ({
        x: Math.cos((i * Math.PI * 2) / 5) * 100,
        y: Math.sin((i * Math.PI * 2) / 5) * 100,
        opacity: 0.3,
        scale: 1,
        transition: {
            duration: 3,
            delay: i * 0.2,
            repeat: Infinity,
            repeatType: 'reverse' as const,
            ease: 'easeInOut' as const,
        },
    }),
};

function FinalScreen({
    finalMessageText,
    askText,
    noButtonBehavior = 'plead',
    theme,
    onResponse,
}: FinalScreenProps) {
    const textColor = theme.isDarkBackground ? '#f5f0e1' : '#2d1810';
    const mutedColor = theme.isDarkBackground
        ? 'rgba(245, 240, 225, 0.7)'
        : 'rgba(45, 24, 16, 0.7)';

    const buttonsContainerRef = useRef<HTMLDivElement>(null);
    const {
        noButtonText,
        noButtonPosition,
        yesButtonScale,
        noButtonScale,
        showGracefulDecline,
        handleNoClick,
    } = useNoButtonBehavior(noButtonBehavior, () => onResponse('no'), buttonsContainerRef);

    return (
        <motion.div
            className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-12"
            style={{
                background: `
                    radial-gradient(ellipse 70% 50% at 50% 100%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
                    radial-gradient(ellipse 50% 30% at 80% 70%, rgba(139, 0, 0, 0.06) 0%, transparent 40%),
                    radial-gradient(ellipse 50% 30% at 20% 70%, rgba(139, 0, 0, 0.04) 0%, transparent 40%),
                    linear-gradient(180deg, ${theme.backgroundColor} 0%, ${adjustBrightness(theme.backgroundColor, -5)} 100%)
                `,
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Ambient glow */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: `radial-gradient(ellipse 60% 50% at 50% 50%, transparent 40%, ${theme.backgroundColor} 100%)`,
                }}
            />

            {/* Floating hearts background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        variants={floatingHeartVariants}
                        initial="initial"
                        animate="animate"
                        className="absolute left-1/2 top-1/2"
                    >
                        <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill={theme.sealColor}
                            opacity="0.3"
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </motion.div>
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex max-w-md flex-col items-center text-center">
                {/* Decorative top flourish */}
                <motion.div variants={itemVariants} className="mb-8">
                    <svg
                        className="h-6 w-32"
                        viewBox="0 0 120 20"
                        fill="none"
                        style={{ color: theme.accentColor }}
                    >
                        <path
                            d="M0 10 Q30 2 60 10 Q90 18 120 10"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            opacity="0.4"
                        />
                        <circle cx="60" cy="10" r="2" fill="currentColor" opacity="0.5" />
                        <circle cx="30" cy="6" r="1" fill="currentColor" opacity="0.3" />
                        <circle cx="90" cy="6" r="1" fill="currentColor" opacity="0.3" />
                    </svg>
                </motion.div>

                {/* Final message (optional) */}
                {finalMessageText && (
                    <motion.p
                        variants={itemVariants}
                        className="mb-8 text-lg leading-relaxed sm:text-xl"
                        style={{
                            fontFamily: theme.bodyFont,
                            color: mutedColor,
                        }}
                    >
                        {finalMessageText}
                    </motion.p>
                )}

                {/* Main ask text */}
                <motion.h1
                    variants={itemVariants}
                    className="mb-12 text-3xl leading-tight sm:text-4xl md:text-5xl"
                    style={{
                        fontFamily: theme.headingFont,
                        color: textColor,
                        textShadow: `0 2px 30px ${theme.accentColor}20`,
                    }}
                >
                    {askText}
                </motion.h1>

                {/* Central heart */}
                <motion.div
                    variants={itemVariants}
                    className="mb-10"
                >
                    <motion.div
                        variants={heartVariants}
                        initial="initial"
                        animate="animate"
                    >
                        <svg
                            className="h-10 w-10 sm:h-12 sm:w-12"
                            viewBox="0 0 24 24"
                            style={{
                                filter: `drop-shadow(0 4px 20px ${theme.sealColor}60)`,
                            }}
                        >
                            <defs>
                                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={adjustBrightness(theme.sealColor, 20)} />
                                    <stop offset="100%" stopColor={theme.sealColor} />
                                </linearGradient>
                            </defs>
                            <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                fill="url(#heartGradient)"
                            />
                        </svg>
                    </motion.div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    ref={buttonsContainerRef}
                    className="relative flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6"
                    style={{ minHeight: noButtonBehavior === 'dodge' ? 160 : undefined }}
                >
                    <motion.button
                        onClick={() => onResponse('yes')}
                        aria-label="Yes, I accept"
                        className="group relative flex min-h-[52px] min-w-[140px] items-center justify-center gap-2 overflow-hidden rounded-full px-10 py-3 text-lg font-medium transition-all duration-300 sm:min-w-[160px]"
                        style={{
                            background: `linear-gradient(135deg, ${adjustBrightness(theme.sealColor, 15)} 0%, ${theme.sealColor} 50%, ${adjustBrightness(theme.sealColor, -10)} 100%)`,
                            color: '#fff',
                            fontFamily: 'Cormorant Garamond, Georgia, serif',
                            boxShadow: `
                                0 8px 30px ${theme.sealColor}50,
                                0 4px 15px rgba(0, 0, 0, 0.2),
                                inset 0 1px 0 rgba(255, 255, 255, 0.2)
                            `,
                        }}
                        animate={{ scale: yesButtonScale }}
                        whileHover={{
                            scale: yesButtonScale * 1.05,
                            boxShadow: `
                                0 12px 40px ${theme.sealColor}60,
                                0 6px 20px rgba(0, 0, 0, 0.25),
                                inset 0 1px 0 rgba(255, 255, 255, 0.2)
                            `,
                        }}
                        whileTap={{ scale: yesButtonScale * 0.97 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <motion.div
                            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            style={{
                                background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)`,
                            }}
                            animate={{
                                x: ['-100%', '200%'],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatDelay: 1,
                            }}
                        />

                        <svg
                            className="h-5 w-5 transition-transform group-hover:scale-110"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span className="relative tracking-wide">Yes!</span>
                    </motion.button>

                    <motion.button
                        onClick={handleNoClick}
                        aria-label="Not yet, maybe later"
                        className="group relative flex min-h-[52px] min-w-[140px] items-center justify-center rounded-full px-10 py-3 text-lg transition-all duration-300 sm:min-w-[160px]"
                        style={{
                            background: 'transparent',
                            color: mutedColor,
                            fontFamily: 'Cormorant Garamond, Georgia, serif',
                            border: `1px solid ${theme.isDarkBackground ? 'rgba(245, 240, 225, 0.25)' : 'rgba(45, 24, 16, 0.25)'}`,
                            ...(noButtonPosition ? { position: 'absolute' as const, left: noButtonPosition.x, top: noButtonPosition.y } : {}),
                        }}
                        animate={{ scale: noButtonScale }}
                        whileHover={{
                            scale: noButtonScale * 1.02,
                            borderColor: theme.isDarkBackground
                                ? 'rgba(245, 240, 225, 0.4)'
                                : 'rgba(45, 24, 16, 0.4)',
                        }}
                        whileTap={{ scale: noButtonScale * 0.98 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <span className="relative tracking-wide">{noButtonText}</span>
                    </motion.button>
                </motion.div>

                <AnimatePresence>
                    {showGracefulDecline && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            onClick={() => onResponse('no')}
                            className="mt-4 text-sm transition-opacity hover:opacity-80"
                            style={{
                                color: mutedColor,
                                fontFamily: theme.bodyFont,
                                opacity: 0.6,
                            }}
                        >
                            I respect your answer
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Bottom flourish */}
                <motion.div
                    variants={itemVariants}
                    className="mt-12"
                >
                    <svg
                        className="h-4 w-24 rotate-180"
                        viewBox="0 0 120 20"
                        fill="none"
                        style={{ color: theme.accentColor }}
                    >
                        <path
                            d="M0 10 Q30 2 60 10 Q90 18 120 10"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            opacity="0.3"
                        />
                    </svg>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default memo(FinalScreen);
