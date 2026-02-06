import { motion } from 'framer-motion';
import { Music, Sparkles } from 'lucide-react';

import type { ViewerTheme } from '@/types/viewer';

export type IntroScreenProps = {
    title: string;
    recipientName: string;
    hasAudio: boolean;
    theme: ViewerTheme;
    onStart: () => void;
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
        transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
};

export function IntroScreen({ title, recipientName, hasAudio, theme, onStart }: IntroScreenProps) {
    const textColor = theme.isDarkBackground ? 'text-stone-100' : 'text-stone-800';
    const mutedTextColor = theme.isDarkBackground ? 'text-stone-300' : 'text-stone-600';

    return (
        <motion.div
            className="flex min-h-dvh flex-col items-center justify-center px-6 py-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className="mb-8">
                <Sparkles className="h-10 w-10 text-rose-400" />
            </motion.div>

            {title && (
                <motion.h1
                    variants={itemVariants}
                    className={`mb-4 text-center text-3xl ${textColor}`}
                    style={{ fontFamily: theme.fontFamily }}
                >
                    {title}
                </motion.h1>
            )}

            <motion.p
                variants={itemVariants}
                className={`mb-2 text-center text-lg ${mutedTextColor}`}
            >
                Hey <span className="font-medium" style={{ fontFamily: theme.fontFamily }}>{recipientName}</span>,
            </motion.p>

            <motion.p
                variants={itemVariants}
                className={`mb-12 text-center text-lg ${mutedTextColor}`}
            >
                someone has a surprise for you
            </motion.p>

            <motion.button
                variants={itemVariants}
                onClick={onStart}
                className="flex min-h-[48px] items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-3 text-lg font-medium text-white shadow-lg shadow-rose-500/25 transition-all hover:from-rose-600 hover:to-pink-600 hover:shadow-xl hover:shadow-rose-500/30 active:scale-[0.98]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {hasAudio && <Music className="h-5 w-5" />}
                <span>{hasAudio ? 'Tap to begin with sound' : 'Tap to begin'}</span>
            </motion.button>

            {hasAudio && (
                <motion.p
                    variants={itemVariants}
                    className={`mt-4 text-center text-sm ${mutedTextColor} opacity-70`}
                >
                    Best experienced with sound on
                </motion.p>
            )}
        </motion.div>
    );
}
