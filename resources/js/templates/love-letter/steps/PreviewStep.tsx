import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, RotateCcw, Smartphone } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useLoveLetterCustomizations } from '../hooks/use-love-letter-customizations';
import { LOVE_LETTER_LIMITS } from '../schema';
import LoveLetterViewer from '../viewer/LoveLetterViewer';

export function PreviewStep() {
    const { customizations } = useLoveLetterCustomizations();
    const [key, setKey] = useState(0);

    const hasRequiredContent = useMemo(() => {
        const hasRecipientName = Boolean(customizations.recipient_name?.trim());
        const hasSenderName = Boolean(customizations.sender_name?.trim());
        const hasEnoughText = customizations.letter_text.trim().length >= LOVE_LETTER_LIMITS.letter_text.min;
        return hasRecipientName && hasSenderName && hasEnoughText;
    }, [customizations.recipient_name, customizations.sender_name, customizations.letter_text]);

    function handleRestart() {
        setKey((prev) => prev + 1);
    }

    if (!hasRequiredContent) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 px-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 ring-1 ring-rose-500/20">
                    <Eye className="h-8 w-8 text-rose-400/50" />
                </div>
                <div className="space-y-2">
                    <p className="font-serif text-base text-stone-300">
                        Complete your letter to preview
                    </p>
                    <p className="font-serif text-sm text-stone-500">
                        Add recipient name, your name, and write at least {LOVE_LETTER_LIMITS.letter_text.min} characters
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-sm text-stone-400">
                    <Smartphone className="h-4 w-4" />
                    <span className="font-serif tracking-wide">Preview how your letter will look</span>
                </div>
                <button
                    type="button"
                    onClick={handleRestart}
                    className={cn(
                        'flex items-center gap-1.5 rounded-full px-3 py-1.5',
                        'border border-rose-500/30 bg-rose-500/10',
                        'font-serif text-xs tracking-wide text-rose-200',
                        'transition-all duration-300',
                        'hover:border-rose-500/50 hover:bg-rose-500/20'
                    )}
                >
                    <RotateCcw className="h-3 w-3" />
                    Restart
                </button>
            </div>

            <motion.div
                className="relative mx-auto aspect-[9/16] w-full max-w-[375px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-black shadow-2xl shadow-black/50"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-7 items-center justify-center rounded-t-[2.5rem] bg-gradient-to-b from-black/40 to-transparent">
                    <div className="h-1 w-20 rounded-full bg-white/20" />
                </div>

                <div className="absolute inset-0 overflow-hidden">
                    <LoveLetterViewer
                        key={key}
                        customizations={customizations}
                        slug="preview"
                    />
                </div>

                <div className="pointer-events-none absolute bottom-2 left-1/2 z-10 h-1 w-28 -translate-x-1/2 rounded-full bg-white/10" />
            </motion.div>

            <p className="text-center font-serif text-xs tracking-wide text-stone-500">
                Tap and interact with the preview to experience the full journey
            </p>
        </div>
    );
}
