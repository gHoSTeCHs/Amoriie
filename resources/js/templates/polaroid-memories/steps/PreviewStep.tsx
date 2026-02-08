import { motion } from 'framer-motion';
import { Eye, RotateCcw, Smartphone } from 'lucide-react';
import { useMemo, useState } from 'react';

import { usePolaroidCustomizations } from '../hooks/use-polaroid-customizations';
import { PolaroidViewer } from '../viewer/PolaroidViewer';

export function PreviewStep() {
    const { customizations } = usePolaroidCustomizations();
    const [key, setKey] = useState(0);

    const hasRequiredContent = useMemo(() => {
        const hasMemories = customizations.memories.some((m) => m.image);
        const hasRecipientName = Boolean(customizations.recipient_name?.trim());
        return hasMemories && hasRecipientName;
    }, [customizations]);

    function handleReset() {
        setKey((prev) => prev + 1);
    }

    if (!hasRequiredContent) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 px-4 text-center">
                <Eye className="h-10 w-10 text-rose-400/40" />
                <p className="text-rose-100/60">
                    Add at least one memory image and recipient name to preview
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-sm text-rose-100/60">
                    <Smartphone className="h-4 w-4" />
                    <span>Preview how your valentine will look</span>
                </div>
                <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-100 transition-all hover:border-rose-500/50 hover:bg-rose-500/20"
                >
                    <RotateCcw className="h-3 w-3" />
                    Restart
                </button>
            </div>

            <motion.div
                className="relative mx-auto aspect-[9/16] w-full max-w-[375px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="absolute inset-0 overflow-auto scrollbar-thin">
                    <PolaroidViewer
                        key={key}
                        customizations={customizations}
                        slug="preview"
                    />
                </div>

                <div className="pointer-events-none absolute inset-x-0 top-0 flex h-6 items-center justify-center rounded-t-3xl bg-black/20 backdrop-blur-sm">
                    <div className="h-1 w-20 rounded-full bg-white/30" />
                </div>
            </motion.div>

            <p className="text-center text-xs text-rose-100/40">
                Interact with the preview to see the full experience
            </p>
        </div>
    );
}
