import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Suspense, lazy } from 'react';

import type { PolaroidCustomizations } from '@/templates/polaroid-memories/schema';

type ValentineData = {
    id: string;
    slug: string;
    recipient_name: string;
    template_id: string;
    customizations: PolaroidCustomizations;
};

type Props = {
    valentine?: ValentineData;
    error?: string;
};

const PolaroidViewer = lazy(() =>
    import('@/templates/polaroid-memories/viewer/PolaroidViewer').then((mod) => ({
        default: mod.PolaroidViewer,
    }))
);

function LoadingSpinner() {
    return (
        <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-rose-100">
            <motion.div
                className="h-8 w-8 rounded-full border-2 border-rose-400 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    );
}

function NotFoundScreen() {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-rose-100 px-6 py-12">
            <Head title="Not Found — Amoriie" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <p className="mb-4 text-6xl">💔</p>
                <h1 className="mb-2 text-2xl font-medium text-stone-800">
                    Valentine Not Found
                </h1>
                <p className="mb-8 text-stone-600">
                    This surprise doesn't exist or may have expired.
                </p>
                <a
                    href="/"
                    className="inline-block rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-3 font-medium text-white shadow-lg shadow-rose-500/25 transition-all hover:from-rose-600 hover:to-pink-600"
                >
                    Create Your Own
                </a>
            </motion.div>
        </div>
    );
}

export default function ValentineShow({ valentine, error }: Props) {
    if (error || !valentine) {
        return <NotFoundScreen />;
    }

    const pageTitle = valentine.customizations.title
        ? `${valentine.customizations.title} — Amoriie`
        : `A Surprise for ${valentine.recipient_name} — Amoriie`;

    return (
        <>
            <Head title={pageTitle} />

            <Suspense fallback={<LoadingSpinner />}>
                <PolaroidViewer
                    customizations={valentine.customizations}
                    slug={valentine.slug}
                />
            </Suspense>
        </>
    );
}
