import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useRef, useEffect } from 'react';

import type { BuilderStep } from '@/lib/constants';
import { BUILDER_STEPS, getStepIndex } from '@/lib/constants';
import { cn } from '@/lib/utils';

type StepIndicatorProps = {
    currentStep: BuilderStep;
    onStepClick?: (step: BuilderStep) => void;
};

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const currentIndex = getStepIndex(currentStep);

    useEffect(() => {
        if (scrollRef.current) {
            const activeElement = scrollRef.current.querySelector('[data-active="true"]');
            if (activeElement) {
                activeElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                });
            }
        }
    }, [currentStep]);

    return (
        <div className="relative w-full overflow-hidden">
            <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#0c0607] to-transparent"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#0c0607] to-transparent"
                aria-hidden="true"
            />

            <div
                ref={scrollRef}
                className="scrollbar-hide flex gap-1 overflow-x-auto px-4 py-3 sm:justify-center sm:gap-2"
            >
                {BUILDER_STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isFuture = index > currentIndex;
                    const isClickable = isCompleted && onStepClick;

                    return (
                        <motion.button
                            key={step.id}
                            data-active={isCurrent}
                            onClick={() => isClickable && onStepClick(step.id)}
                            disabled={!isClickable}
                            className={cn(
                                'group relative flex min-w-[72px] flex-col items-center gap-2 rounded-2xl px-3 py-3 transition-all duration-300',
                                isClickable && 'cursor-pointer',
                                !isClickable && 'cursor-default',
                                isCurrent && 'bg-rose-500/10',
                                isCompleted && 'hover:bg-rose-500/5'
                            )}
                            initial={false}
                            animate={{
                                scale: isCurrent ? 1 : 0.95,
                                opacity: isFuture ? 0.4 : 1,
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="relative">
                                {isCurrent && (
                                    <motion.div
                                        className="absolute -inset-1 rounded-full bg-rose-500/30 blur-md"
                                        animate={{
                                            opacity: [0.5, 0.8, 0.5],
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                    />
                                )}

                                <motion.div
                                    className={cn(
                                        'relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                                        isCurrent &&
                                            'border-rose-500 bg-gradient-to-br from-rose-500/20 to-pink-500/10 shadow-lg shadow-rose-500/20',
                                        isCompleted &&
                                            'border-rose-400/50 bg-rose-500/10 group-hover:border-rose-400 group-hover:bg-rose-500/20',
                                        isFuture && 'border-white/10 bg-white/[0.02]'
                                    )}
                                    whileHover={isClickable ? { scale: 1.05 } : undefined}
                                    whileTap={isClickable ? { scale: 0.95 } : undefined}
                                >
                                    {isCompleted ? (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 200,
                                                damping: 15,
                                            }}
                                        >
                                            <Check className="h-5 w-5 text-rose-400" strokeWidth={2.5} />
                                        </motion.div>
                                    ) : (
                                        <Icon
                                            className={cn(
                                                'h-5 w-5 transition-colors duration-300',
                                                isCurrent && 'text-rose-400',
                                                isFuture && 'text-white/30'
                                            )}
                                        />
                                    )}
                                </motion.div>
                            </div>

                            <div className="flex flex-col items-center gap-0.5">
                                <span
                                    className={cn(
                                        'text-xs font-medium transition-colors duration-300',
                                        isCurrent && 'text-white',
                                        isCompleted && 'text-rose-100/80 group-hover:text-white',
                                        isFuture && 'text-white/30'
                                    )}
                                >
                                    {step.label}
                                </span>
                                <span
                                    className={cn(
                                        'hidden text-[10px] leading-tight sm:block',
                                        isCurrent && 'text-rose-100/60',
                                        isCompleted && 'text-rose-100/40',
                                        isFuture && 'text-white/20'
                                    )}
                                >
                                    {step.description}
                                </span>
                            </div>

                            {index < BUILDER_STEPS.length - 1 && (
                                <div
                                    className={cn(
                                        'absolute -right-1 top-[26px] h-0.5 w-2 transition-colors duration-300 sm:-right-2 sm:w-4',
                                        index < currentIndex
                                            ? 'bg-gradient-to-r from-rose-500/60 to-rose-500/30'
                                            : 'bg-white/10'
                                    )}
                                    aria-hidden="true"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
