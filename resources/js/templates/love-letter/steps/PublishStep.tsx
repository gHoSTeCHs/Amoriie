import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Heart, Mail, Bell } from 'lucide-react';
import { router } from '@inertiajs/react';

import { SlugInput } from '@/components/shared/SlugInput';
import { UploadProgressModal } from '@/components/shared/UploadProgressModal';
import { StepValidationAlert } from '@/components/shared/StepValidationAlert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useSlugCheck } from '@/hooks/use-slug-check';
import { usePublish } from '@/hooks/use-publish';
import { VALENTINE_CONFIG } from '@/lib/constraints';
import { useBuilderTemplateId, useBuilderStore } from '@/stores/builder-store';
import { cn } from '@/lib/utils';

import { useLoveLetterCustomizations } from '../hooks/use-love-letter-customizations';
import { useLoveLetterValidation } from '../hooks/use-love-letter-validation';

export function PublishStep() {
    const templateId = useBuilderTemplateId();
    const { customizations } = useLoveLetterCustomizations();
    const validation = useLoveLetterValidation('publish');
    const resetBuilder = useBuilderStore((state) => state.reset);

    const { state: slugState, checkSlug, selectSuggestion } = useSlugCheck();
    const { isPublishing, uploadItems, result, publish, resetPublish } = usePublish();

    const [email, setEmail] = useState('');
    const [notifyOnResponse, setNotifyOnResponse] = useState(false);

    useEffect(() => {
        if (customizations.recipient_name && !slugState.slug) {
            const suggestedSlug = customizations.recipient_name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            if (suggestedSlug.length >= 2) {
                checkSlug(suggestedSlug);
            }
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps -- Intentional one-time mount effect */
    }, []);

    useEffect(() => {
        if (result?.success && result.valentine) {
            resetBuilder();
            router.visit(`/create/success/${result.valentine.slug}`);
        }
    }, [result, resetBuilder]);

    const canPublish =
        validation.isValid &&
        slugState.status === 'available' &&
        slugState.normalizedSlug &&
        !isPublishing;

    async function handlePublish() {
        if (!canPublish || !templateId || !slugState.normalizedSlug) return;

        await publish({
            templateId,
            slug: slugState.normalizedSlug,
            customizations,
            creatorEmail: email || undefined,
            notifyOnResponse,
        });
    }

    function handleRetry() {
        resetPublish();
        handlePublish();
    }

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 p-4 ring-1 ring-rose-500/30">
                    <Send className="h-8 w-8 text-rose-400" />
                </div>
                <h2 className="font-serif text-xl tracking-wide text-white">
                    Send Your Letter
                </h2>
                <p className="mt-2 font-serif text-sm text-stone-400">
                    Choose a memorable URL and send your love into the world
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/20">
                        <Heart className="h-3.5 w-3.5 text-rose-400" />
                    </div>
                    <span className="font-serif text-sm tracking-wide text-stone-300">
                        Choose your special link
                    </span>
                </div>

                <SlugInput
                    value={slugState.slug}
                    onChange={checkSlug}
                    onSuggestionSelect={selectSuggestion}
                    status={slugState.status}
                    normalizedSlug={slugState.normalizedSlug}
                    suggestions={slugState.suggestions}
                    errors={slugState.errors}
                    disabled={isPublishing}
                />

                {slugState.status === 'available' && slugState.normalizedSlug && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 font-serif text-sm text-emerald-400"
                    >
                        <Heart className="h-3.5 w-3.5 fill-emerald-400" />
                        Perfect! This link is available
                    </motion.p>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
            >
                <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20">
                        <Mail className="h-3.5 w-3.5 text-violet-400" />
                    </div>
                    <span className="font-serif text-sm tracking-wide text-stone-300">
                        Get notified (optional)
                    </span>
                </div>

                <div
                    className={cn(
                        'rounded-xl border border-white/10 bg-white/[0.02] p-4',
                        'transition-colors duration-300 focus-within:border-rose-500/30'
                    )}
                >
                    <label htmlFor="creator-email" className="sr-only">
                        Your email address
                    </label>
                    <input
                        id="creator-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        disabled={isPublishing}
                        aria-describedby="email-hint"
                        className={cn(
                            'w-full bg-transparent font-serif text-white placeholder:text-stone-500',
                            'focus:outline-none disabled:opacity-50'
                        )}
                    />
                    <p id="email-hint" className="sr-only">
                        Optional. Used for notifications when your valentine responds.
                    </p>
                </div>

                <label htmlFor="notify-on-response" className="flex cursor-pointer items-start gap-3">
                    <Checkbox
                        id="notify-on-response"
                        checked={notifyOnResponse}
                        onCheckedChange={(checked) => setNotifyOnResponse(checked === true)}
                        disabled={isPublishing || !email}
                        className="mt-0.5 border-rose-500/50 data-[state=checked]:border-rose-500 data-[state=checked]:bg-rose-500"
                    />
                    <div className="flex-1">
                        <div className="flex items-center gap-2 font-serif text-sm text-white">
                            <Bell className="h-3.5 w-3.5" aria-hidden="true" />
                            Notify me when they respond
                        </div>
                        <p className="mt-0.5 font-serif text-xs text-stone-500">
                            We'll send you an email when your valentine says yes (or no)
                        </p>
                    </div>
                </label>
            </motion.div>

            <StepValidationAlert errors={validation.errors} warnings={validation.warnings} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Button
                    onClick={handlePublish}
                    disabled={!canPublish}
                    className={cn(
                        'min-h-[56px] w-full rounded-full font-serif text-lg tracking-wide',
                        'bg-gradient-to-r from-rose-500 to-pink-500',
                        'shadow-lg shadow-rose-500/25',
                        'transition-all duration-300',
                        'hover:shadow-xl hover:shadow-rose-500/30',
                        'disabled:opacity-50 disabled:shadow-none'
                    )}
                >
                    <Send className="mr-2 h-5 w-5" />
                    Publish & Share
                </Button>

                <p className="mt-4 text-center font-serif text-xs text-stone-500">
                    Your letter will be live for {VALENTINE_CONFIG.EXPIRATION_DAYS} days. You can track
                    views and responses from your personal stats link.
                </p>
            </motion.div>

            <UploadProgressModal
                isOpen={isPublishing || (result !== null && !result.success)}
                items={uploadItems}
                hasMedia={uploadItems.some(item => item.name !== 'Creating Valentine')}
                onRetry={handleRetry}
                onClose={() => !isPublishing && resetPublish()}
            />
        </div>
    );
}
