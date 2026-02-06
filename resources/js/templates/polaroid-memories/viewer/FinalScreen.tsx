import { motion } from 'framer-motion';
import { Heart, HeartCrack } from 'lucide-react';

import type { ViewerTheme, ViewerResponse } from '@/types/viewer';
import type { PolaroidFinalMessage } from '../schema';

export type FinalScreenProps = {
    recipientName: string;
    senderName: string;
    finalMessage: PolaroidFinalMessage;
    theme: ViewerTheme;
    onResponse: (response: ViewerResponse) => void;
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
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

const heartVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 400,
            damping: 15,
        },
    },
};

export function FinalScreen({
    recipientName,
    senderName,
    finalMessage,
    theme,
    onResponse,
}: FinalScreenProps) {
    const textColor = theme.isDarkBackground ? 'text-stone-100' : 'text-stone-800';
    const mutedTextColor = theme.isDarkBackground ? 'text-stone-300' : 'text-stone-600';

    return (
        <motion.div
            className="flex min-h-dvh flex-col items-center justify-center px-6 py-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={heartVariants} className="mb-6">
                <Heart className="h-12 w-12 fill-rose-400 text-rose-400" />
            </motion.div>

            <motion.p
                variants={itemVariants}
                className={`mb-6 text-xl ${mutedTextColor}`}
                style={{ fontFamily: theme.fontFamily }}
            >
                Dear {recipientName},
            </motion.p>

            <motion.p
                variants={itemVariants}
                className={`mb-8 max-w-sm text-center text-lg leading-relaxed ${textColor}`}
                style={{ fontFamily: theme.fontFamily }}
            >
                {finalMessage.text}
            </motion.p>

            <motion.p
                variants={itemVariants}
                className={`mb-10 text-center text-2xl font-medium ${textColor}`}
                style={{ fontFamily: theme.fontFamily }}
            >
                {finalMessage.ask_text}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row">
                <motion.button
                    onClick={() => onResponse('yes')}
                    className="flex min-h-[52px] min-w-[140px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-3 text-lg font-medium text-white shadow-lg shadow-rose-500/25 transition-all hover:from-rose-600 hover:to-pink-600 hover:shadow-xl hover:shadow-rose-500/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Heart className="h-5 w-5 fill-current" />
                    <span>Yes!</span>
                </motion.button>

                <motion.button
                    onClick={() => onResponse('no')}
                    className={`flex min-h-[52px] min-w-[140px] items-center justify-center gap-2 rounded-full border-2 px-8 py-3 text-lg font-medium transition-all ${
                        theme.isDarkBackground
                            ? 'border-stone-400 text-stone-300 hover:bg-stone-800'
                            : 'border-stone-400 text-stone-600 hover:bg-stone-100'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <HeartCrack className="h-5 w-5" />
                    <span>No</span>
                </motion.button>
            </motion.div>

            <motion.p
                variants={itemVariants}
                className={`mt-12 text-base ${mutedTextColor}`}
                style={{ fontFamily: theme.fontFamily }}
            >
                With love, {senderName || 'Your admirer'}
            </motion.p>
        </motion.div>
    );
}
