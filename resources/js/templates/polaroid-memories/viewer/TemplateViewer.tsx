import { motion } from 'framer-motion';

import { isPolaroidCustomizations } from '@/lib/validators/polaroid-customizations';
import type { TemplateViewerProps } from '../../registry';
import { PolaroidViewer } from './PolaroidViewer';

function InvalidCustomizationsError() {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-rose-100 px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <p className="mb-4 text-6xl">⚠️</p>
                <h1 className="mb-2 text-xl font-medium text-stone-800">
                    Unable to Load Valentine
                </h1>
                <p className="mb-8 text-stone-600">
                    The valentine data appears to be corrupted.
                </p>
                <a
                    href="/"
                    className="inline-block rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-3 font-medium text-white shadow-lg shadow-rose-500/25 transition-all hover:from-rose-600 hover:to-pink-600"
                >
                    Go Home
                </a>
            </motion.div>
        </div>
    );
}

export function TemplateViewer({ customizations, slug = 'viewer' }: TemplateViewerProps) {
    if (!isPolaroidCustomizations(customizations)) {
        return <InvalidCustomizationsError />;
    }

    return <PolaroidViewer customizations={customizations} slug={slug} />;
}
