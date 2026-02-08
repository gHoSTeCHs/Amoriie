import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';

import type { ViewerTheme } from '@/types/viewer';
import { CELEBRATION_COLORS } from '../palettes';
import type { PolaroidYesResponse } from '../schema';

export type CelebrationScreenProps = {
    yesResponse?: PolaroidYesResponse | null;
    theme: ViewerTheme;
};

const DEFAULT_YES_RESPONSE: PolaroidYesResponse = {
    message: "You've made me the happiest person!",
    reveal_photo: null,
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.5,
        },
    },
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 200,
            damping: 20,
            delay: 1,
        },
    },
};

/**
 * Heart entrance animation uses bouncier spring (400/15)
 * for playful celebration effect, intentionally different
 * from standard 300/30 used elsewhere.
 */
function fireConfetti() {
    const colors = [...CELEBRATION_COLORS.confetti];

    confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors,
        startVelocity: 45,
    });

    confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        colors,
        startVelocity: 45,
    });

    setTimeout(() => {
        confetti({
            particleCount: 50,
            spread: 100,
            origin: { x: 0.5, y: 0.5 },
            colors,
            startVelocity: 30,
        });
    }, 300);
}

export function CelebrationScreen({ yesResponse, theme }: CelebrationScreenProps) {
    const safeResponse = yesResponse ?? DEFAULT_YES_RESPONSE;
    const hasFireRef = useRef(false);
    const textColor = theme.isDarkBackground ? 'text-stone-100' : 'text-stone-800';
    const mutedTextColor = theme.isDarkBackground ? 'text-stone-300' : 'text-stone-600';

    useEffect(() => {
        if (hasFireRef.current) return;
        hasFireRef.current = true;
        fireConfetti();
    }, []);

    return (
        <motion.div
            className="flex min-h-dvh flex-col items-center justify-center px-6 py-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="mb-6 flex items-center gap-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 15,
                    delay: 0.2,
                }}
            >
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                    }}
                >
                    <Heart className="h-8 w-8 fill-rose-400 text-rose-400" />
                </motion.div>
                <Sparkles className="h-6 w-6 text-amber-400" />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, -10, 10, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                        delay: 0.2,
                    }}
                >
                    <Heart className="h-8 w-8 fill-rose-400 text-rose-400" />
                </motion.div>
            </motion.div>

            <motion.p
                variants={itemVariants}
                className={`mb-8 max-w-sm text-center text-xl leading-relaxed ${textColor}`}
                style={{ fontFamily: theme.fontFamily }}
            >
                {safeResponse.message}
            </motion.p>

            {safeResponse.reveal_photo && (
                <motion.div
                    variants={imageVariants}
                    className="mb-8 overflow-hidden rounded-2xl shadow-xl"
                >
                    <img
                        src={safeResponse.reveal_photo}
                        alt="Reveal"
                        className="max-h-[300px] max-w-full object-contain"
                    />
                </motion.div>
            )}

            <motion.a
                variants={itemVariants}
                href="/"
                className={`mt-8 text-sm underline transition-colors ${mutedTextColor} hover:text-rose-500`}
            >
                Create Your Own Surprise
            </motion.a>
        </motion.div>
    );
}
