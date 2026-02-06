import { motion } from 'framer-motion';
import { Trash2, RotateCcw, Calendar } from 'lucide-react';
import { useState } from 'react';

import { ImageUploader } from '@/components/shared/ImageUploader';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { PolaroidMemory } from '../schema';
import { POLAROID_LIMITS } from '../schema';

type MemoryCardProps = {
    memory: PolaroidMemory;
    index: number;
    canDelete: boolean;
    fontFamily: string;
    onUpdate: (updates: Partial<PolaroidMemory>) => void;
    onDelete: () => void;
};

export function MemoryCard({
    memory,
    index,
    canDelete,
    fontFamily,
    onUpdate,
    onDelete,
}: MemoryCardProps) {
    const [showRotation, setShowRotation] = useState(false);

    function handleImageUpload(file: File) {
        const previewUrl = URL.createObjectURL(file);
        onUpdate({
            image: previewUrl,
            image_file: file,
        });
    }

    function handleImageRemove() {
        if (memory.image && memory.image.startsWith('blob:')) {
            URL.revokeObjectURL(memory.image);
        }
        onUpdate({
            image: null,
            image_file: undefined,
        });
    }

    function handleCaptionChange(e: React.ChangeEvent<HTMLInputElement>) {
        onUpdate({ caption: e.target.value.slice(0, POLAROID_LIMITS.caption.max) });
    }

    function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        onUpdate({ date: e.target.value || undefined });
    }

    function handleRotationChange(value: number[]) {
        onUpdate({ rotation: value[0] });
    }

    function handleResetRotation() {
        onUpdate({ rotation: 0 });
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, height: 0 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
        >
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                <span className="text-sm font-medium text-white/80">
                    Memory #{index + 1}
                </span>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowRotation(!showRotation)}
                        className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-full transition-all',
                            showRotation
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
                        )}
                        aria-label="Adjust rotation"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </button>

                    {canDelete && (
                        <button
                            type="button"
                            onClick={onDelete}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 transition-all hover:bg-rose-500/20 hover:text-rose-400"
                            aria-label="Delete memory"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div
                    className="mx-auto max-w-[200px]"
                    style={{
                        transform: `rotate(${memory.rotation}deg)`,
                        transition: 'transform 0.3s ease',
                    }}
                >
                    <div className="relative overflow-hidden rounded-sm bg-white p-2 pb-10 shadow-lg">
                        <ImageUploader
                            onUpload={handleImageUpload}
                            onRemove={handleImageRemove}
                            currentImage={memory.image || undefined}
                            aspectRatio={1}
                            maxSizeMb={10}
                            showCrop={true}
                            placeholder="Add photo"
                            className="[&_.aspect-square]:aspect-square [&_img]:aspect-square"
                        />

                        {memory.caption && (
                            <div
                                className="absolute inset-x-2 bottom-2 truncate text-center text-xs text-gray-600"
                                style={{ fontFamily }}
                            >
                                {memory.caption}
                            </div>
                        )}
                    </div>
                </div>

                {showRotation && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-white/50">Rotation</span>
                            <button
                                type="button"
                                onClick={handleResetRotation}
                                className="text-xs text-rose-400 hover:text-rose-300"
                            >
                                Reset
                            </button>
                        </div>
                        <Slider
                            value={[memory.rotation]}
                            onValueChange={handleRotationChange}
                            min={POLAROID_LIMITS.rotation.min}
                            max={POLAROID_LIMITS.rotation.max}
                            step={1}
                        />
                        <div className="flex justify-between text-xs text-white/30">
                            <span>{POLAROID_LIMITS.rotation.min}°</span>
                            <span className="text-white/50">{memory.rotation}°</span>
                            <span>{POLAROID_LIMITS.rotation.max}°</span>
                        </div>
                    </motion.div>
                )}

                <div className="space-y-3">
                    <div>
                        <Input
                            type="text"
                            value={memory.caption}
                            onChange={handleCaptionChange}
                            placeholder="Add a caption..."
                            maxLength={POLAROID_LIMITS.caption.max}
                            className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:border-rose-500/50 focus-visible:ring-rose-500/20"
                        />
                        <div className="mt-1 flex justify-end">
                            <span className="text-xs text-white/30">
                                {memory.caption.length}/{POLAROID_LIMITS.caption.max}
                            </span>
                        </div>
                    </div>

                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <Input
                            type="text"
                            value={memory.date || ''}
                            onChange={handleDateChange}
                            placeholder="When was this? (optional)"
                            className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/30 focus-visible:border-rose-500/50 focus-visible:ring-rose-500/20"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
