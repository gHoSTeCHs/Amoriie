import {
    motion,
    useMotionValue,
    useTransform,
    AnimatePresence,
    type PanInfo,
} from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import type { ViewerTheme } from '@/types/viewer';
import type { PolaroidMemory } from '../schema';
import { PolaroidCard } from './PolaroidCard';

export type PolaroidStackProps = {
    memories: PolaroidMemory[];
    theme: ViewerTheme;
    onProgress?: (index: number) => void;
    onComplete: () => void;
};

const SWIPE_THRESHOLD = 50;
const VELOCITY_THRESHOLD = 500;

export function PolaroidStack({ memories, theme, onProgress, onComplete }: PolaroidStackProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

    const textColor = theme.isDarkBackground ? 'text-stone-200' : 'text-stone-700';
    const mutedTextColor = theme.isDarkBackground ? 'text-stone-400' : 'text-stone-500';

    function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
        const shouldSwipe =
            Math.abs(info.offset.x) > SWIPE_THRESHOLD ||
            Math.abs(info.velocity.x) > VELOCITY_THRESHOLD;

        if (shouldSwipe) {
            const direction = info.offset.x > 0 ? 'right' : 'left';
            navigate(direction);
        }
    }

    function navigate(direction: 'left' | 'right') {
        const isNext = direction === 'left';

        if (isNext && currentIndex === memories.length - 1) {
            onComplete();
            return;
        }

        if (!isNext && currentIndex === 0) {
            return;
        }

        setExitDirection(direction);

        const nextIndex = isNext ? currentIndex + 1 : currentIndex - 1;
        setCurrentIndex(nextIndex);
        onProgress?.(nextIndex);
    }

    function handleNext() {
        navigate('left');
    }

    function handlePrev() {
        navigate('right');
    }

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === memories.length - 1;

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-8">
            <div className="relative mb-8 h-[400px] w-full max-w-[300px]">
                {memories.slice(currentIndex, currentIndex + 3).map((memory, offset) => {
                    const isActive = offset === 0;

                    if (isActive) {
                        return (
                            <AnimatePresence key={memory.id} mode="popLayout">
                                <motion.div
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 touch-none"
                                    style={{
                                        x: isActive ? x : 0,
                                        rotate: isActive ? rotate : 0,
                                        opacity: isActive ? opacity : 1,
                                        zIndex: 10 - offset,
                                    }}
                                    drag={isActive ? 'x' : false}
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.8}
                                    onDragEnd={handleDragEnd}
                                    initial={{
                                        scale: 0.9,
                                        opacity: 0,
                                        x: exitDirection === 'left' ? 200 : -200,
                                    }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    exit={{
                                        scale: 0.9,
                                        opacity: 0,
                                        x: exitDirection === 'left' ? -200 : 200,
                                    }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                >
                                    <PolaroidCard
                                        memory={memory}
                                        theme={theme}
                                        isActive={isActive}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        );
                    }

                    return (
                        <motion.div
                            key={memory.id}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                            style={{
                                zIndex: 10 - offset,
                            }}
                            animate={{
                                scale: 1 - offset * 0.05,
                                y: offset * 10,
                                opacity: 1 - offset * 0.2,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 30,
                            }}
                        >
                            <PolaroidCard
                                memory={memory}
                                theme={theme}
                                isActive={false}
                                scale={1 - offset * 0.05}
                            />
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={handlePrev}
                    disabled={isFirst}
                    className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
                        isFirst
                            ? 'cursor-not-allowed opacity-30'
                            : `${textColor} hover:bg-black/10 active:scale-95`
                    }`}
                    aria-label="Previous memory"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>

                <div className="flex items-center gap-2">
                    {memories.map((_, index) => (
                        <motion.div
                            key={index}
                            className={`h-2 w-2 rounded-full transition-colors ${
                                index === currentIndex
                                    ? 'bg-rose-500'
                                    : index < currentIndex
                                      ? 'bg-rose-300'
                                      : theme.isDarkBackground
                                        ? 'bg-white/30'
                                        : 'bg-black/20'
                            }`}
                            animate={{
                                scale: index === currentIndex ? 1.2 : 1,
                            }}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${textColor} hover:bg-black/10 active:scale-95`}
                    aria-label={isLast ? 'Continue' : 'Next memory'}
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>

            <motion.p
                className={`mt-6 text-center text-sm ${mutedTextColor}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                {isLast ? 'Tap arrow to continue' : 'Swipe or tap arrows'}
            </motion.p>

            <motion.p
                className={`mt-2 text-center text-xs ${mutedTextColor} opacity-60`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1.2 }}
            >
                {currentIndex + 1} of {memories.length} memories
            </motion.p>
        </div>
    );
}
