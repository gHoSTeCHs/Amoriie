import { Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import { HeartCrack, Home, Sparkles } from 'lucide-react';
import create from '@/routes/create';

import { ExpiredScreen } from '@/components/valentine/ExpiredScreen';
import { OgMeta } from '@/components/shared/OgMeta';
import { useTemplateModule } from '@/templates/registry';
import { SoundPreloadHead } from '@/templates/love-letter/components/SoundPreloadHead';
import type { LoveLetterCustomizations } from '@/templates/love-letter/schema';
import type { AnyTemplateCustomizations, TemplateId } from '@/types/customizations';

type ValentineData = {
    id: string;
    slug: string;
    recipient_name: string;
    template_id: TemplateId;
    customizations: AnyTemplateCustomizations;
};

type Props = {
    valentine?: ValentineData;
    error?: 'expired' | 'not_found' | string;
    recipient_name?: string;
    og_image_url?: string | null;
    og_title?: string;
    og_description?: string;
    public_url?: string;
};

function LoadingSpinner() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <div className="flex min-h-dvh items-center justify-center bg-[#0c0607]">
            {shouldReduceMotion ? (
                <div className="h-8 w-8 rounded-full border-2 border-rose-400 border-t-transparent" />
            ) : (
                <motion.div
                    className="h-8 w-8 rounded-full border-2 border-rose-400 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            )}
        </div>
    );
}

function TemplateLoadError({ templateId }: { templateId: string }) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#0c0607] px-6 py-12">
            <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 30%, rgba(159,18,57,0.15) 0%, transparent 60%)',
                }}
            />

            <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={
                    shouldReduceMotion
                        ? undefined
                        : { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
                }
                className="relative z-10 max-w-md text-center"
            >
                <div className="relative mx-auto mb-8 inline-flex">
                    <div className="relative rounded-full border border-rose-500/20 bg-gradient-to-br from-rose-950/60 to-rose-900/40 p-6 backdrop-blur-sm">
                        <HeartCrack
                            className="h-12 w-12 text-rose-400"
                            strokeWidth={1.5}
                            aria-hidden="true"
                        />
                    </div>
                </div>

                <h1
                    className="mb-4 text-3xl text-white md:text-4xl"
                    style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 500,
                    }}
                >
                    Unable to Load Valentine
                </h1>

                <p
                    className="mb-10 text-lg text-rose-100/70"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                    We couldn&apos;t load the template &quot;{templateId}&quot;. Please try again later.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/5 px-6 py-3 text-sm text-rose-100/80 transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-white"
                >
                    <Home className="h-4 w-4" />
                    Go Home
                </Link>
            </motion.div>
        </div>
    );
}

function NotFoundScreen() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#0c0607] px-6 py-12">
            <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 30%, rgba(159,18,57,0.15) 0%, transparent 60%)',
                }}
            />

            <div
                className="absolute top-1/3 left-1/4 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-900/20 blur-3xl"
                aria-hidden="true"
            />
            <div
                className="absolute right-1/4 bottom-1/4 h-48 w-48 translate-x-1/2 translate-y-1/2 rounded-full bg-pink-900/15 blur-3xl"
                aria-hidden="true"
            />

            <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={
                    shouldReduceMotion
                        ? undefined
                        : { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
                }
                className="relative z-10 max-w-md text-center"
            >
                <motion.div
                    initial={
                        shouldReduceMotion
                            ? undefined
                            : { scale: 0.8, opacity: 0 }
                    }
                    animate={
                        shouldReduceMotion
                            ? undefined
                            : { scale: 1, opacity: 1 }
                    }
                    transition={
                        shouldReduceMotion
                            ? undefined
                            : {
                                  delay: 0.2,
                                  duration: 0.6,
                                  type: 'spring' as const,
                                  stiffness: 200,
                              }
                    }
                    className="relative mx-auto mb-8 inline-flex"
                >
                    <div
                        className={`absolute inset-0 rounded-full bg-rose-500/20 blur-xl ${shouldReduceMotion ? '' : 'animate-pulse'}`}
                        aria-hidden="true"
                    />
                    <div className="relative rounded-full border border-rose-500/20 bg-gradient-to-br from-rose-950/60 to-rose-900/40 p-6 backdrop-blur-sm">
                        <HeartCrack
                            className="h-12 w-12 text-rose-400"
                            strokeWidth={1.5}
                            aria-hidden="true"
                        />
                    </div>
                    {!shouldReduceMotion && (
                        <motion.div
                            className="absolute -top-1 -right-1"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            aria-hidden="true"
                        >
                            <Sparkles className="h-5 w-5 text-rose-300/60" />
                        </motion.div>
                    )}
                </motion.div>

                <motion.h1
                    initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                    transition={shouldReduceMotion ? undefined : { delay: 0.3 }}
                    className="mb-4 text-3xl text-white md:text-4xl"
                    style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 500,
                    }}
                >
                    Valentine Not Found
                </motion.h1>

                <motion.p
                    initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                    transition={shouldReduceMotion ? undefined : { delay: 0.4 }}
                    className="mb-10 text-lg text-rose-100/70"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                    This surprise doesn't exist or the link may be incorrect
                </motion.p>

                <motion.div
                    initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                    transition={shouldReduceMotion ? undefined : { delay: 0.5 }}
                    className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                >
                    <Link
                        href={create.index.url()}
                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-7 py-3.5 font-medium text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-xl hover:shadow-rose-500/30"
                    >
                        <HeartCrack className="h-4 w-4" />
                        <span className="relative z-10">
                            Create Your Own Valentine
                        </span>
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100"
                            aria-hidden="true"
                        />
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/5 px-6 py-3 text-sm text-rose-100/80 transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-white"
                    >
                        <Home className="h-4 w-4" />
                        Go Home
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}

function DynamicTemplateViewer({ valentine }: { valentine: ValentineData }) {
    const { module, isLoading, error } = useTemplateModule(valentine.template_id);

    const soundPreloadElement =
        valentine.template_id === 'love-letter' ? (
            <SoundPreloadHead
                themeId={(valentine.customizations as LoveLetterCustomizations).theme_id}
                enabled={(valentine.customizations as LoveLetterCustomizations).customization?.sounds_enabled ?? true}
            />
        ) : null;

    if (isLoading) {
        return (
            <>
                {soundPreloadElement}
                <LoadingSpinner />
            </>
        );
    }

    if (error || !module) {
        return <TemplateLoadError templateId={valentine.template_id} />;
    }

    const ViewerComponent = module.Viewer;

    return (
        <>
            {soundPreloadElement}
            <ViewerComponent
                template={{} as never}
                customizations={valentine.customizations}
                slug={valentine.slug}
            />
        </>
    );
}

export default function ValentineShow({
    valentine,
    error,
    recipient_name,
    og_image_url,
    og_title,
    og_description,
    public_url,
}: Props) {
    if (error === 'expired') {
        return (
            <>
                <OgMeta
                    title={og_title ?? 'Valentine Expired — Amoriie'}
                    description={
                        og_description ??
                        'This valentine has expired. Create your own special valentine to share with someone you love.'
                    }
                    image={og_image_url}
                    url=""
                />
                <ExpiredScreen recipientName={recipient_name} />
            </>
        );
    }

    if (error || !valentine) {
        return (
            <>
                <OgMeta
                    title={og_title ?? 'Valentine Not Found — Amoriie'}
                    description={
                        og_description ??
                        'Create a beautiful, personalized valentine to share with someone special.'
                    }
                    image={og_image_url}
                    url=""
                />
                <NotFoundScreen />
            </>
        );
    }

    const pageTitle = (valentine.customizations as { title?: string }).title
        ? `${(valentine.customizations as { title?: string }).title} — Amoriie`
        : `A Surprise for ${valentine.recipient_name} — Amoriie`;

    const pageDescription = `${valentine.recipient_name}, someone has created a special valentine just for you. Tap to see your surprise!`;

    return (
        <>
            <OgMeta
                title={pageTitle}
                description={pageDescription}
                image={og_image_url}
                url={public_url ?? ''}
            />

            <DynamicTemplateViewer valentine={valentine} />
        </>
    );
}
