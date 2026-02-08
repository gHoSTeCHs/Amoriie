import { Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export type ErrorFallbackProps = {
    error?: Error | null;
    onRetry?: () => void;
    showDetails?: boolean;
};

export function ErrorFallback({ error, onRetry, showDetails = false }: ErrorFallbackProps) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center bg-[#0c0607] px-6 py-12">
            <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 50%, rgba(159,18,57,0.1) 0%, transparent 60%)',
                }}
            />

            <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? undefined : { duration: 0.5 }}
                className="relative z-10 max-w-md text-center"
            >
                <motion.div
                    initial={shouldReduceMotion ? undefined : { scale: 0.8 }}
                    animate={shouldReduceMotion ? undefined : { scale: 1 }}
                    transition={shouldReduceMotion ? undefined : { delay: 0.1, type: 'spring' as const, stiffness: 200 }}
                    className="mx-auto mb-6 inline-flex rounded-full border border-rose-500/20 bg-rose-950/40 p-5 backdrop-blur-sm"
                >
                    <AlertTriangle className="h-10 w-10 text-rose-400" strokeWidth={1.5} aria-hidden="true" />
                </motion.div>

                <h2
                    className="mb-3 text-2xl text-white"
                    style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 500,
                    }}
                >
                    Something went wrong
                </h2>

                <p className="mb-6 text-rose-100/60">
                    We encountered an unexpected error. Please try again or return home.
                </p>

                {showDetails && error && (
                    <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
                        animate={shouldReduceMotion ? {} : { opacity: 1, height: 'auto' }}
                        className="mb-6 overflow-hidden rounded-xl border border-rose-500/10 bg-rose-950/30 p-4 text-left"
                    >
                        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-rose-400/60">
                            Error Details
                        </p>
                        <code className="block whitespace-pre-wrap text-xs text-rose-100/50">
                            {error.message}
                        </code>
                    </motion.div>
                )}

                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-3 font-medium text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-xl hover:shadow-rose-500/30"
                        >
                            <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180" />
                            <span className="relative z-10">Try Again</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                    )}

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/5 px-5 py-3 text-sm text-rose-100/80 transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-white"
                    >
                        <Home className="h-4 w-4" />
                        Go Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
