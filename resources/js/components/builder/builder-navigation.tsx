import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Eye, Send } from 'lucide-react';

import { Spinner } from '@/components/ui/spinner';
import type { BuilderStep } from '@/lib/constants';
import { getStepIndex, STEP_ORDER } from '@/lib/constants';
import { cn } from '@/lib/utils';

type BuilderNavigationProps = {
    currentStep: BuilderStep;
    onBack: () => void;
    onContinue: () => void;
    canContinue?: boolean;
    isLoading?: boolean;
};

export function BuilderNavigation({
    currentStep,
    onBack,
    onContinue,
    canContinue = true,
    isLoading = false,
}: BuilderNavigationProps) {
    const currentIndex = getStepIndex(currentStep);
    const isFirstStep = currentIndex === 0;
    const isPreviewStep = currentStep === 'preview';
    const isPublishStep = currentStep === 'publish';
    const isLastStep = currentIndex === STEP_ORDER.length - 1;

    const getContinueLabel = () => {
        if (isPublishStep) return 'Publish';
        if (isPreviewStep) return 'Continue';
        return 'Continue';
    };

    const getContinueIcon = () => {
        if (isPublishStep) return Send;
        if (isPreviewStep) return Eye;
        return ArrowRight;
    };

    const ContinueIcon = getContinueIcon();

    return (
        <div className="fixed inset-x-0 bottom-0 z-50">
            <div className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-[#0c0607] to-transparent" />

            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="border-t border-white/5 bg-[#0c0607]/95 backdrop-blur-xl"
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
                <div className="mx-auto flex max-w-lg items-center justify-between gap-4 px-4 py-4">
                    <motion.button
                        onClick={onBack}
                        disabled={isFirstStep}
                        className={cn(
                            'group flex h-12 items-center gap-2 rounded-full border px-5 transition-all duration-300',
                            isFirstStep
                                ? 'pointer-events-none border-transparent bg-transparent opacity-0'
                                : 'border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50 hover:bg-rose-500/20'
                        )}
                        whileHover={!isFirstStep ? { scale: 1.02 } : undefined}
                        whileTap={!isFirstStep ? { scale: 0.98 } : undefined}
                    >
                        <ArrowLeft
                            className={cn(
                                'h-4 w-4 transition-transform duration-300',
                                !isFirstStep && 'group-hover:-translate-x-0.5',
                                isFirstStep ? 'text-white/20' : 'text-rose-100'
                            )}
                        />
                        <span
                            className={cn(
                                'text-sm font-medium',
                                isFirstStep ? 'text-white/20' : 'text-rose-100'
                            )}
                        >
                            Back
                        </span>
                    </motion.button>

                    <motion.button
                        onClick={onContinue}
                        disabled={!canContinue || isLoading || isLastStep}
                        className={cn(
                            'group relative flex h-12 items-center gap-2 overflow-hidden rounded-full px-6 text-sm font-medium transition-all duration-300',
                            canContinue && !isLoading && !isLastStep
                                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30'
                                : 'bg-white/5 text-white/30'
                        )}
                        whileHover={
                            canContinue && !isLoading && !isLastStep ? { scale: 1.02 } : undefined
                        }
                        whileTap={
                            canContinue && !isLoading && !isLastStep ? { scale: 0.98 } : undefined
                        }
                    >
                        {canContinue && !isLoading && !isLastStep && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            />
                        )}

                        <span className="relative z-10">{getContinueLabel()}</span>

                        {isLoading ? (
                            <Spinner className="relative z-10 h-4 w-4 text-current" />
                        ) : (
                            <ContinueIcon
                                className={cn(
                                    'relative z-10 h-4 w-4 transition-transform duration-300',
                                    canContinue &&
                                        !isLastStep &&
                                        'group-hover:translate-x-0.5'
                                )}
                            />
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
