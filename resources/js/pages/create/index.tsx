import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles, Crown } from 'lucide-react';

import { builder } from '@/actions/App/Http/Controllers/ValentineController';
import type { Template } from '@/types/template';

type Props = {
    templates: Template[];
};

function TemplateCard({ template, index }: { template: Template; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            <Link
                href={builder.url(template.id)}
                className="group relative block overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-rose-500/30 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0607]"
            >
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-rose-500/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-rose-950/50 to-pink-950/30">
                        {template.thumbnail_url ? (
                            <img
                                src={template.thumbnail_url}
                                alt={template.name}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <Heart className="h-16 w-16 text-rose-500/30" />
                                </motion.div>
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0607] via-transparent to-transparent" />

                        {template.is_premium && (
                            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500/90 to-yellow-500/90 px-2.5 py-1 text-xs font-medium text-amber-950">
                                <Crown className="h-3 w-3" />
                                Premium
                            </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs text-rose-300">
                                <Sparkles className="h-3 w-3" />
                                {template.category === 'storybook' ? 'Storybook' : 'Interactive'}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 pt-2">
                        <h3
                            className="mb-1 text-lg text-white transition-colors group-hover:text-rose-100"
                            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
                        >
                            {template.name}
                        </h3>
                        {template.description && (
                            <p className="line-clamp-2 text-sm leading-relaxed text-rose-100/50">
                                {template.description}
                            </p>
                        )}
                    </div>
                </div>

                <motion.div
                    className="absolute inset-0 rounded-3xl ring-2 ring-rose-500/0 transition-all duration-300 group-hover:ring-rose-500/30"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
            </Link>
        </motion.div>
    );
}

export default function TemplateSelection({ templates }: Props) {
    return (
        <>
            <Head title="Choose Your Template — Amoriie">
                <meta name="description" content="Pick from beautifully crafted love letter templates to express your feelings. Each theme sets the perfect mood for your message." />
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

            <div className="relative min-h-screen bg-[#0c0607]">
                <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `radial-gradient(circle at 50% 0%, rgba(190,18,60,0.15) 0%, transparent 50%)`,
                    }}
                />

                <header className="relative z-10 border-b border-white/5">
                    <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
                        <Link
                            href="/"
                            className="group flex items-center gap-2 text-rose-100/60 transition-colors hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            <span className="text-sm">Back</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-rose-500" fill="currentColor" />
                            <span
                                className="text-lg tracking-wide text-white"
                                style={{ fontFamily: "'Italiana', serif" }}
                            >
                                Amoriie
                            </span>
                        </div>

                        <div className="w-16" />
                    </nav>
                </header>

                <main className="relative px-6 py-12">
                    <div className="mx-auto max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-10 text-center"
                        >
                            <h1
                                className="mb-3 text-3xl text-white md:text-4xl"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontWeight: 500,
                                }}
                            >
                                Choose Your Template
                            </h1>
                            <p className="mx-auto max-w-md text-rose-100/60">
                                Select a style that matches your feelings. Each template offers a
                                unique way to express your love.
                            </p>
                        </motion.div>

                        {templates.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 text-center"
                            >
                                <Heart className="mb-4 h-12 w-12 text-rose-500/30" />
                                <p className="text-rose-100/60">
                                    Templates are coming soon. Check back later!
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {templates.map((template, index) => (
                                    <TemplateCard
                                        key={template.id}
                                        template={template}
                                        index={index}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                <footer className="relative border-t border-white/5 px-6 py-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <p className="text-sm text-rose-100/40">
                            More templates are on the way!
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
