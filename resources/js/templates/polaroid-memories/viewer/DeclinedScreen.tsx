import { motion } from 'framer-motion';
import { HeartCrack } from 'lucide-react';

import type { ViewerTheme } from '@/types/viewer';

export type DeclinedScreenProps = {
    theme: ViewerTheme;
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

export function DeclinedScreen({ theme }: DeclinedScreenProps) {
    const textColor = theme.isDarkBackground ? 'text-stone-100' : 'text-stone-800';
    const mutedTextColor = theme.isDarkBackground ? 'text-stone-300' : 'text-stone-600';

    return (
        <motion.div
            className="flex min-h-dvh flex-col items-center justify-center px-6 py-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className="mb-6">
                <HeartCrack className="h-12 w-12 text-stone-400" />
            </motion.div>

            <motion.p
                variants={itemVariants}
                className={`mb-4 text-center text-xl ${textColor}`}
                style={{ fontFamily: theme.fontFamily }}
            >
                Maybe next time...
            </motion.p>

            <motion.p
                variants={itemVariants}
                className={`text-center text-base ${mutedTextColor}`}
            >
                That's okay, thank you for being honest
            </motion.p>

            <motion.a
                variants={itemVariants}
                href="/"
                className={`mt-12 text-sm underline transition-colors ${mutedTextColor} hover:text-rose-500`}
            >
                Create Your Own Surprise
            </motion.a>
        </motion.div>
    );
}
