import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SlugStatus } from '@/types/publish';

type SlugInputProps = {
    value: string;
    onChange: (value: string) => void;
    onSuggestionSelect: (suggestion: string) => void;
    status: SlugStatus;
    normalizedSlug: string | null;
    suggestions: string[];
    errors: string[];
    disabled?: boolean;
    onRetry?: () => void;
    canRetry?: boolean;
};

const statusConfig: Record<SlugStatus, { icon: React.ReactNode; color: string }> = {
    idle: { icon: null, color: '' },
    checking: {
        icon: <Loader2 className="size-4 animate-spin" />,
        color: 'text-rose-400',
    },
    available: {
        icon: <Check className="size-4" />,
        color: 'text-emerald-400',
    },
    taken: {
        icon: <X className="size-4" />,
        color: 'text-rose-400',
    },
    invalid: {
        icon: <X className="size-4" />,
        color: 'text-rose-400',
    },
};

export function SlugInput({
    value,
    onChange,
    onSuggestionSelect,
    status,
    normalizedSlug,
    suggestions,
    errors,
    disabled = false,
    onRetry,
    canRetry = false,
}: SlugInputProps) {
    const { icon, color } = statusConfig[status];

    const inputId = 'slug-input';

    return (
        <div className="space-y-3">
            <label htmlFor={inputId} className="sr-only">
                Custom URL slug
            </label>
            <div
                className={cn(
                    'flex items-center rounded-xl border bg-white/[0.02] transition-all duration-200',
                    status === 'available' && 'border-emerald-500/50 ring-1 ring-emerald-500/20',
                    status === 'taken' && 'border-rose-500/50 ring-1 ring-rose-500/20',
                    status === 'invalid' && 'border-rose-500/50 ring-1 ring-rose-500/20',
                    status === 'checking' && 'border-rose-400/30',
                    status === 'idle' && 'border-white/10 focus-within:border-rose-500/50'
                )}
            >
                <span className="flex-shrink-0 pl-4 text-sm text-rose-100/50" aria-hidden="true">
                    amoriie.com/for/
                </span>
                <input
                    id={inputId}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="their-name"
                    disabled={disabled}
                    aria-invalid={status === 'invalid' || status === 'taken'}
                    aria-describedby={errors.length > 0 ? 'slug-errors' : undefined}
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck="false"
                    className={cn(
                        'flex-1 bg-transparent py-3 pr-3 text-rose-50 placeholder:text-rose-100/30',
                        'focus:outline-none disabled:opacity-50'
                    )}
                />
                <AnimatePresence mode="wait">
                    {icon && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={cn('flex-shrink-0 pr-4', color)}
                        >
                            {icon}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {normalizedSlug && normalizedSlug !== value && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xs text-rose-100/50"
                    >
                        Will be saved as: <span className="text-rose-300">{normalizedSlug}</span>
                    </motion.p>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {errors.length > 0 && (
                    <motion.div
                        id="slug-errors"
                        role="alert"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-2"
                    >
                        {errors.map((error, i) => (
                            <p key={i} className="text-sm text-rose-400">
                                {error}
                            </p>
                        ))}
                        {canRetry && onRetry && (
                            <button
                                type="button"
                                onClick={onRetry}
                                className="text-sm text-rose-300 underline hover:text-rose-200 transition-colors"
                            >
                                Try again
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="space-y-2"
                    >
                        <div className="flex items-center gap-2 text-sm text-rose-100/60">
                            <Sparkles className="size-3.5" />
                            <span>Try one of these instead:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((suggestion) => (
                                <motion.button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => onSuggestionSelect(suggestion)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={cn(
                                        'rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5',
                                        'text-sm text-rose-300 transition-colors',
                                        'hover:border-rose-500/50 hover:bg-rose-500/20'
                                    )}
                                >
                                    {suggestion}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
