import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, HeartCrack } from 'lucide-react';

import type { ViewerTheme, ViewerResponse } from '@/types/viewer';
import { useNoButtonBehavior } from '@/hooks/use-no-button-behavior';
import type { PolaroidFinalMessage } from '../schema';

export type FinalScreenProps = {
    recipientName: string;
    senderName: string;
    finalMessage?: PolaroidFinalMessage | null;
    theme: ViewerTheme;
    onResponse: (response: ViewerResponse) => void;
};

const DEFAULT_FINAL_MESSAGE: PolaroidFinalMessage = {
    text: '',
    ask_text: 'Will you be my Valentine?',
    no_button_behavior: 'plead',
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
    const safeMessage = finalMessage ?? DEFAULT_FINAL_MESSAGE;
    const textColor = theme.isDarkBackground ? 'text-stone-100' : 'text-stone-800';
    const mutedTextColor = theme.isDarkBackground ? 'text-stone-300' : 'text-stone-600';

    const buttonsContainerRef = useRef<HTMLDivElement>(null);
    const {
        noButtonText,
        noButtonPosition,
        yesButtonScale,
        noButtonScale,
        showGracefulDecline,
        handleNoClick,
    } = useNoButtonBehavior(safeMessage.no_button_behavior ?? 'plead', () => onResponse('no'), buttonsContainerRef);

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

            {safeMessage.text && (
                <motion.p
                    variants={itemVariants}
                    className={`mb-8 max-w-sm text-center text-lg leading-relaxed ${textColor}`}
                    style={{ fontFamily: theme.fontFamily }}
                >
                    {safeMessage.text}
                </motion.p>
            )}

            <motion.p
                variants={itemVariants}
                className={`mb-10 text-center text-2xl font-medium ${textColor}`}
                style={{ fontFamily: theme.fontFamily }}
            >
                {safeMessage.ask_text}
            </motion.p>

            <motion.div
                variants={itemVariants}
                ref={buttonsContainerRef}
                className="relative flex flex-col items-center gap-4 sm:flex-row"
                style={{ minHeight: safeMessage.no_button_behavior === 'dodge' ? 160 : undefined }}
            >
                <motion.button
                    onClick={() => onResponse('yes')}
                    className="flex min-h-[52px] min-w-[140px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-3 text-lg font-medium text-white shadow-lg shadow-rose-500/25 transition-all hover:from-rose-600 hover:to-pink-600 hover:shadow-xl hover:shadow-rose-500/30"
                    animate={{ scale: yesButtonScale }}
                    whileHover={{ scale: yesButtonScale * 1.02 }}
                    whileTap={{ scale: yesButtonScale * 0.98 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <Heart className="h-5 w-5 fill-current" />
                    <span>Yes!</span>
                </motion.button>

                <motion.button
                    onClick={handleNoClick}
                    className={`flex min-h-[52px] min-w-[140px] items-center justify-center gap-2 rounded-full border-2 px-8 py-3 text-lg font-medium transition-all ${
                        theme.isDarkBackground
                            ? 'border-stone-400 text-stone-300 hover:bg-stone-800'
                            : 'border-stone-400 text-stone-600 hover:bg-stone-100'
                    }`}
                    style={noButtonPosition ? { position: 'absolute' as const, left: noButtonPosition.x, top: noButtonPosition.y } : undefined}
                    animate={{ scale: noButtonScale }}
                    whileHover={{ scale: noButtonScale * 1.02 }}
                    whileTap={{ scale: noButtonScale * 0.98 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <HeartCrack className="h-5 w-5" />
                    <span>{noButtonText}</span>
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
                        className={`mt-2 text-sm ${mutedTextColor} opacity-60 transition-opacity hover:opacity-80`}
                        style={{ fontFamily: theme.fontFamily }}
                    >
                        I respect your answer
                    </motion.button>
                )}
            </AnimatePresence>

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
