import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Image } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { PolaroidMemory } from '../schema';
import { POLAROID_LIMITS } from '../schema';
import { MemoryCard } from './MemoryCard';

type MemoryManagerProps = {
    memories: PolaroidMemory[];
    fontFamily: string;
    onAddMemory: () => void;
    onRemoveMemory: (id: string) => void;
    onUpdateMemory: (id: string, updates: Partial<PolaroidMemory>) => void;
};

export function MemoryManager({
    memories,
    fontFamily,
    onAddMemory,
    onRemoveMemory,
    onUpdateMemory,
}: MemoryManagerProps) {
    const memoriesWithImages = memories.filter((m) => m.image !== null).length;
    const canAddMore = memories.length < POLAROID_LIMITS.memories.max;
    const canDelete = memories.length > POLAROID_LIMITS.memories.min;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-rose-400" />
                    <h3 className="text-lg font-medium text-white">Your Memories</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-white/50">
                        {memoriesWithImages}/{memories.length} photos
                    </span>
                    <span
                        className={cn(
                            'rounded-full px-2 py-0.5 text-xs',
                            memoriesWithImages >= POLAROID_LIMITS.memories.min
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                        )}
                    >
                        {memoriesWithImages >= POLAROID_LIMITS.memories.min
                            ? 'Ready'
                            : `Need ${POLAROID_LIMITS.memories.min - memoriesWithImages} more`}
                    </span>
                </div>
            </div>

            <AnimatePresence mode="popLayout">
                {memories.map((memory, index) => (
                    <MemoryCard
                        key={memory.id}
                        memory={memory}
                        index={index}
                        canDelete={canDelete}
                        fontFamily={fontFamily}
                        onUpdate={(updates) => onUpdateMemory(memory.id, updates)}
                        onDelete={() => onRemoveMemory(memory.id)}
                    />
                ))}
            </AnimatePresence>

            {canAddMore && (
                <motion.button
                    type="button"
                    onClick={onAddMemory}
                    className={cn(
                        'flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/10 py-6',
                        'text-white/50 transition-all duration-300',
                        'hover:border-rose-500/30 hover:bg-rose-500/5 hover:text-rose-300'
                    )}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <Plus className="h-5 w-5" />
                    <span>Add another memory</span>
                    <span className="text-sm text-white/30">
                        ({memories.length}/{POLAROID_LIMITS.memories.max})
                    </span>
                </motion.button>
            )}

            {memoriesWithImages < POLAROID_LIMITS.memories.min && (
                <p className="text-center text-sm text-rose-300/60">
                    Add at least {POLAROID_LIMITS.memories.min} photos to continue
                </p>
            )}
        </div>
    );
}
