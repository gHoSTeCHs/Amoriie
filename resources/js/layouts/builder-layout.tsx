import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';

import { BuilderNavigation } from '@/components/builder/builder-navigation';
import { StepIndicator } from '@/components/builder/step-indicator';
import type { BuilderStep } from '@/lib/constants';

type BuilderLayoutProps = {
    children: React.ReactNode;
    currentStep: BuilderStep;
    onStepClick?: (step: BuilderStep) => void;
    showNavigation?: boolean;
    onBack?: () => void;
    onContinue?: () => void;
    canContinue?: boolean;
    isLoading?: boolean;
    title?: string;
};

export default function BuilderLayout({
    children,
    currentStep,
    onStepClick,
    showNavigation = true,
    onBack,
    onContinue,
    canContinue = true,
    isLoading = false,
    title = 'Create Your Valentine',
}: BuilderLayoutProps) {
    return (
        <>
            <Head title={title}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Italiana&family=Dancing+Script:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="relative flex min-h-screen flex-col bg-[#0c0607]">
                <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0c0607]/95 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-rose-100/60 transition-colors hover:text-white"
                        >
                            <Heart className="h-5 w-5 text-rose-500" fill="currentColor" />
                            <span
                                className="text-lg tracking-wide text-white"
                                style={{ fontFamily: "'Italiana', serif" }}
                            >
                                Amoriie
                            </span>
                        </Link>

                        <Link
                            href="/"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-rose-100/60 transition-all hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </Link>
                    </div>

                    <StepIndicator currentStep={currentStep} onStepClick={onStepClick} />
                </header>

                <motion.main
                    className="flex-1 pb-24"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="mx-auto max-w-lg px-4 py-6">{children}</div>
                </motion.main>

                {showNavigation && onBack && onContinue && (
                    <BuilderNavigation
                        currentStep={currentStep}
                        onBack={onBack}
                        onContinue={onContinue}
                        canContinue={canContinue}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </>
    );
}
