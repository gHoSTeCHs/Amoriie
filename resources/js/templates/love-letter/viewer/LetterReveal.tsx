import { memo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { adjustBrightness } from '@/lib/color-utils';
import type { LoveLetterViewerTheme } from './types';
import TextReveal from './TextReveal';

type LetterRevealProps = {
    letterText: string;
    letterDate: string;
    recipientName: string;
    senderName: string;
    theme: LoveLetterViewerTheme;
    onTextRevealStart?: () => void;
    onComplete: () => void;
    reducedMotion?: boolean;
};

function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    } catch {
        return dateString;
    }
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
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

function LetterReveal({
    letterText,
    letterDate,
    recipientName,
    senderName,
    theme,
    onTextRevealStart,
    onComplete,
    reducedMotion = false,
}: LetterRevealProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [textComplete, setTextComplete] = useState(false);

    const { customization } = theme;
    const showBorders = customization.show_borders;
    const showDropCap = customization.show_drop_cap;
    const showFlourishes = customization.show_flourishes;
    const signatureStyle = customization.signature_style;

    const firstLetter = letterText.trim()[0] || '';
    const restOfText = letterText.trim().slice(1);

    const handleTextComplete = () => {
        setTextComplete(true);
    };

    return (
        <motion.div
            className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-12"
            style={{
                background: `
                    radial-gradient(ellipse 80% 50% at 50% 100%, rgba(212, 175, 55, 0.06) 0%, rgba(212, 175, 55, 0.02) 40%, transparent 75%),
                    linear-gradient(180deg, ${theme.backgroundColor} 0%, ${adjustBrightness(theme.backgroundColor, -3)} 100%)
                `,
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Paper container */}
            <motion.div
                className="relative w-full max-w-lg"
                variants={itemVariants}
            >
                {/* Paper shadow layers */}
                <div
                    className="absolute -inset-1 rounded-sm opacity-50"
                    style={{
                        background: adjustBrightness(theme.paperColor, -20),
                        transform: 'rotate(0.5deg) translateY(4px)',
                    }}
                />
                <div
                    className="absolute -inset-0.5 rounded-sm opacity-30"
                    style={{
                        background: adjustBrightness(theme.paperColor, -15),
                        transform: 'rotate(-0.3deg) translateY(2px)',
                    }}
                />

                {/* Main paper */}
                <div
                    className="relative overflow-hidden rounded-sm shadow-2xl"
                    style={{
                        background: `linear-gradient(165deg, ${theme.paperColor} 0%, ${adjustBrightness(theme.paperColor, -5)} 100%)`,
                        boxShadow: `
                            0 25px 50px -12px rgba(0, 0, 0, 0.4),
                            0 0 0 1px rgba(139, 90, 43, 0.1),
                            inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `,
                    }}
                >
                    {/* Paper texture overlay */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-50"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23paper)'/%3E%3C/svg%3E")`,
                        }}
                    />

                    {/* Aged edges effect */}
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            boxShadow: `
                                inset 0 0 60px rgba(139, 90, 43, 0.08),
                                inset 0 0 20px rgba(139, 90, 43, 0.05)
                            `,
                        }}
                    />

                    {/* Ornate border */}
                    {showBorders && (
                        <div className="pointer-events-none absolute inset-4 sm:inset-6">
                            {/* Border frame */}
                            <div
                                className="absolute inset-0 rounded-sm"
                                style={{
                                    border: `1px solid ${theme.accentColor}30`,
                                    boxShadow: `inset 0 0 0 3px ${theme.paperColor}, inset 0 0 0 4px ${theme.accentColor}20`,
                                }}
                            />

                            {/* Corner flourishes */}
                            {showFlourishes && (
                                <>
                                    <svg className="absolute -left-1 -top-1 h-8 w-8" viewBox="0 0 32 32" fill="none">
                                        <path
                                            d="M4 28 Q4 4 28 4"
                                            stroke={theme.accentColor}
                                            strokeWidth="0.5"
                                            opacity="0.4"
                                            fill="none"
                                        />
                                        <path
                                            d="M8 24 Q8 8 24 8"
                                            stroke={theme.accentColor}
                                            strokeWidth="0.5"
                                            opacity="0.3"
                                            fill="none"
                                        />
                                        <circle cx="6" cy="6" r="1.5" fill={theme.accentColor} opacity="0.3" />
                                    </svg>
                                    <svg className="absolute -right-1 -top-1 h-8 w-8 rotate-90" viewBox="0 0 32 32" fill="none">
                                        <path
                                            d="M4 28 Q4 4 28 4"
                                            stroke={theme.accentColor}
                                            strokeWidth="0.5"
                                            opacity="0.4"
                                            fill="none"
                                        />
                                        <path
                                            d="M8 24 Q8 8 24 8"
                                            stroke={theme.accentColor}
                                            strokeWidth="0.5"
                                            opacity="0.3"
                                            fill="none"
                                        />
                                        <circle cx="6" cy="6" r="1.5" fill={theme.accentColor} opacity="0.3" />
                                    </svg>
                                    <svg className="absolute -bottom-1 -left-1 h-8 w-8 -rotate-90" viewBox="0 0 32 32" fill="none">
                                        <path
                                            d="M4 28 Q4 4 28 4"
                                            stroke={theme.accentColor}
                                            strokeWidth="0.5"
                                            opacity="0.4"
                                            fill="none"
                                        />
                                        <path
                                            d="M8 24 Q8 8 24 8"
                                            stroke={theme.accentColor}
                                            strokeWidth="0.5"
                                            opacity="0.3"
                                            fill="none"
                                        />
                                        <circle cx="6" cy="6" r="1.5" fill={theme.accentColor} opacity="0.3" />
                                    </svg>
                                    <svg className="absolute -bottom-1 -right-1 h-8 w-8 rotate-180" viewBox="0 0 32 32" fill="none">
                                        <path
                                            d="M4 28 Q4 4 28 4"
                                            stroke={theme.accentColor}
                                            strokeWidth="0.5"
                                            opacity="0.4"
                                            fill="none"
                                        />
                                        <path
                                            d="M8 24 Q8 8 24 8"
                                            stroke={theme.accentColor}
                                            strokeWidth="0.5"
                                            opacity="0.3"
                                            fill="none"
                                        />
                                        <circle cx="6" cy="6" r="1.5" fill={theme.accentColor} opacity="0.3" />
                                    </svg>
                                </>
                            )}
                        </div>
                    )}

                    {/* Letter content */}
                    <div ref={scrollContainerRef} className="relative max-h-[80dvh] overflow-y-auto p-6 scrollbar-hide sm:max-h-[75dvh] sm:p-10 md:max-h-[70dvh]">
                        {/* Date */}
                        <motion.p
                            variants={itemVariants}
                            className="mb-6 text-right text-sm italic"
                            style={{
                                fontFamily: theme.bodyFont,
                                color: `${theme.inkColor}99`,
                            }}
                        >
                            {formatDate(letterDate)}
                        </motion.p>

                        {/* Salutation */}
                        <motion.h2
                            variants={itemVariants}
                            className="mb-6 text-2xl sm:text-3xl"
                            style={{
                                fontFamily: theme.headingFont,
                                color: theme.inkColor,
                            }}
                        >
                            Dear {recipientName},
                        </motion.h2>

                        {/* Letter body with optional drop cap */}
                        <div className="relative mb-8">
                            {showDropCap && firstLetter && (
                                <motion.span
                                    variants={itemVariants}
                                    className="float-left mr-2 mt-1 leading-none"
                                    style={{
                                        fontFamily: theme.headingFont,
                                        fontSize: '3.5rem',
                                        color: theme.accentColor,
                                        textShadow: `
                                            0 2px 4px rgba(0, 0, 0, 0.1),
                                            0 0 20px ${theme.accentColor}30
                                        `,
                                    }}
                                >
                                    {firstLetter}
                                </motion.span>
                            )}

                            <TextReveal
                                animationType={theme.config.animations.text_reveal}
                                text={showDropCap ? restOfText : letterText}
                                theme={theme}
                                scrollContainerRef={scrollContainerRef}
                                onStart={onTextRevealStart}
                                onComplete={handleTextComplete}
                                reducedMotion={reducedMotion}
                            />
                        </div>

                        {/* Signature section */}
                        <AnimatePresence>
                            {textComplete && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="mt-8 text-right"
                                >
                                    <p
                                        className="mb-2 italic"
                                        style={{
                                            fontFamily: theme.bodyFont,
                                            color: theme.inkColor,
                                        }}
                                    >
                                        With all my love,
                                    </p>

                                    {signatureStyle === 'handwritten' && (
                                        <p
                                            className="text-3xl sm:text-4xl"
                                            style={{
                                                fontFamily: theme.signatureFont,
                                                color: theme.inkColor,
                                            }}
                                        >
                                            {senderName}
                                        </p>
                                    )}

                                    {signatureStyle === 'typed' && (
                                        <p
                                            className="text-lg tracking-wide"
                                            style={{
                                                fontFamily: theme.bodyFont,
                                                color: theme.inkColor,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {senderName}
                                        </p>
                                    )}

                                    {signatureStyle === 'initials' && (
                                        <div
                                            className="ml-auto flex h-12 w-12 items-center justify-center rounded-full"
                                            style={{
                                                background: `linear-gradient(135deg, ${theme.accentColor}20 0%, ${theme.accentColor}10 100%)`,
                                                border: `1px solid ${theme.accentColor}40`,
                                            }}
                                        >
                                            <span
                                                className="text-lg font-medium"
                                                style={{
                                                    fontFamily: theme.headingFont,
                                                    color: theme.accentColor,
                                                }}
                                            >
                                                {getInitials(senderName)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Decorative line under signature */}
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.6, delay: 0.5 }}
                                        className="ml-auto mt-3 h-px w-24 origin-right"
                                        style={{
                                            background: `linear-gradient(90deg, transparent 0%, ${theme.accentColor}40 100%)`,
                                        }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Continue button */}
                        <AnimatePresence>
                            {textComplete && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                    className="mt-10 flex justify-center"
                                >
                                    <motion.button
                                        onClick={onComplete}
                                        className="group relative px-8 py-3 text-sm uppercase tracking-[0.2em] transition-all duration-300"
                                        style={{
                                            fontFamily: 'Cormorant Garamond, Georgia, serif',
                                            color: theme.inkColor,
                                            background: 'transparent',
                                            border: `1px solid ${theme.accentColor}50`,
                                        }}
                                        whileHover={{
                                            scale: 1.02,
                                            borderColor: theme.accentColor,
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="relative z-10">Continue</span>
                                        <motion.div
                                            className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                                            style={{
                                                background: `linear-gradient(135deg, ${theme.accentColor}10 0%, ${theme.accentColor}05 100%)`,
                                            }}
                                        />
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default memo(LetterReveal);
