import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';
import { useState } from 'react';

import type { ViewerTheme } from '@/types/viewer';
import type { PolaroidMemory } from '../schema';

export type PolaroidCardProps = {
    memory: PolaroidMemory;
    theme: ViewerTheme;
    isActive?: boolean;
    scale?: number;
    zIndex?: number;
    className?: string;
};

export function PolaroidCard({
    memory,
    theme,
    isActive = true,
    scale = 1,
    zIndex = 0,
    className = '',
}: PolaroidCardProps) {
    const [imageError, setImageError] = useState(false);
    const rotationDeg = memory.rotation ?? 0;



    return (
        <motion.div
            className={`relative aspect-[3/4] w-full max-w-[280px] ${theme.polaroidShadowClass} ${className}`}
            style={{
                backgroundColor: theme.polaroidBorderColor,
                rotate: `${rotationDeg}deg`,
                scale,
                zIndex,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
                opacity: isActive ? 1 : 0.7,
                scale: isActive ? 1 : scale,
            }}
            transition={{
                type: 'spring' as const,
                stiffness: 300,
                damping: 30,
            }}
        >
            <div className={`relative ${theme.polaroidTextureClass}`}>
                <div className="p-3 pb-0">
                    <div className="relative aspect-square overflow-hidden bg-stone-200">
                        {memory.image && !imageError ? (
                            <img
                                src={memory.image}
                                alt={memory.caption || 'Memory'}
                                className="h-full w-full object-cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-stone-100 to-stone-200">
                                <ImageOff className="h-8 w-8 text-stone-400" />
                                <span className="text-xs text-stone-400">
                                    {imageError ? 'Failed to load' : 'No image'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-3 pt-3 pb-4">
                    {memory.caption && (
                        <p
                            className="text-center text-base leading-relaxed text-stone-700"
                            style={{ fontFamily: theme.fontFamily }}
                        >
                            {memory.caption}
                        </p>
                    )}

                    {memory.date && (
                        <p className="mt-1 text-center text-xs text-stone-400">
                            {memory.date}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
