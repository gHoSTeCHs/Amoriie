import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

import LoveLetterViewer from '@/templates/love-letter/viewer/LoveLetterViewer';
import type { LoveLetterCustomizations, AnimationSpeed, LoveLetterThemeId } from '@/templates/love-letter/schema';
import { getAllThemes, getTheme } from '@/templates/love-letter/themes';

const sampleLetter = `From the moment I first saw you, I knew there was something special about the way you smiled. It wasn't just a smile—it was warmth, kindness, and a little mischief all wrapped into one.

Every day with you feels like a gift I never knew I needed. The way you laugh at my terrible jokes, the way you know exactly when I need a hug, and the way you make even the most ordinary moments feel extraordinary.

I've written and rewritten this letter a hundred times, trying to find the perfect words. But the truth is, no words could ever fully capture what you mean to me. You are my favorite hello and my hardest goodbye. You are my best friend, my confidant, and the love of my life.

Thank you for choosing me. Thank you for loving me. Thank you for being you.

Forever and always yours.`;

function buildCustomizations(
    themeId: LoveLetterThemeId,
    animationSpeed: AnimationSpeed,
    soundsEnabled: boolean
): LoveLetterCustomizations {
    const theme = getTheme(themeId);

    return {
        recipient_name: 'My Dearest Love',
        sender_name: 'Your Secret Admirer',
        letter_date: '2024-02-14',
        letter_text: sampleLetter,
        theme_id: themeId,
        customization: {
            paper_color: theme.palette.paper[0],
            ink_color: theme.palette.ink[0],
            seal_color: theme.palette.seal[0],
            heading_font: theme.typography.heading_fonts[0],
            body_font: theme.typography.body_fonts[0],
            signature_font: theme.typography.signature_fonts[0],
            signature_style: 'handwritten',
            animation_speed: animationSpeed,
            sounds_enabled: soundsEnabled,
            show_borders: theme.decorations.borders !== 'none',
            show_drop_cap: theme.decorations.drop_cap,
            show_flourishes: theme.decorations.flourishes,
        },
        audio: {
            background_music: null,
        },
        final_message: {
            text: 'I have something important to ask you...',
            ask_text: 'Will you be my Valentine?',
        },
        yes_response: {
            message: "You've made me the happiest person in the world! I can't wait to celebrate with you.",
        },
    };
}

const themeVisuals: Record<LoveLetterThemeId, { gradient: string; accent: string; icon: string }> = {
    'midnight-candlelight': {
        gradient: 'from-amber-900/40 via-orange-950/30 to-red-950/40',
        accent: '#f59e0b',
        icon: '🕯️',
    },
    'vintage-telegram': {
        gradient: 'from-stone-800/40 via-amber-950/30 to-stone-900/40',
        accent: '#a8a29e',
        icon: '📜',
    },
    'royal-elegance': {
        gradient: 'from-yellow-900/30 via-amber-900/20 to-yellow-950/30',
        accent: '#fbbf24',
        icon: '👑',
    },
    'garden-romance': {
        gradient: 'from-rose-900/30 via-pink-950/20 to-green-950/30',
        accent: '#fb7185',
        icon: '🌹',
    },
    'modern-minimal': {
        gradient: 'from-neutral-800/40 via-zinc-900/30 to-neutral-900/40',
        accent: '#e5e5e5',
        icon: '◯',
    },
    'parisian-cafe': {
        gradient: 'from-rose-900/30 via-pink-900/20 to-amber-950/30',
        accent: '#f9a8d4',
        icon: '☕',
    },
};

type ThemeCardProps = {
    theme: ReturnType<typeof getTheme>;
    isSelected: boolean;
    onSelect: () => void;
    index: number;
};

function ThemeCard({ theme, isSelected, onSelect, index }: ThemeCardProps) {
    const visuals = themeVisuals[theme.id];

    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
            onClick={onSelect}
            className="group relative text-left"
        >
            <div
                className={`
                    relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-500
                    ${isSelected
                        ? 'border-rose-400/50 shadow-2xl shadow-rose-500/20'
                        : 'border-white/[0.06] hover:border-white/[0.12]'
                    }
                `}
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${visuals.gradient} opacity-60`} />

                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent" />

                <div className="relative p-5">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl" role="img" aria-hidden="true">
                                {visuals.icon}
                            </span>
                            <div>
                                <h3
                                    className="font-serif text-lg tracking-wide text-white/90"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    {theme.name}
                                </h3>
                                <p className="mt-0.5 text-xs text-white/40">{theme.description}</p>
                            </div>
                        </div>

                        <div
                            className={`
                                flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300
                                ${isSelected
                                    ? 'border-rose-400 bg-rose-400'
                                    : 'border-white/20 group-hover:border-white/40'
                                }
                            `}
                        >
                            {isSelected && (
                                <motion.svg
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="h-3 w-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </motion.svg>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                        <span
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide"
                            style={{ backgroundColor: `${visuals.accent}20`, color: visuals.accent }}
                        >
                            <span className="opacity-60">ENV</span>
                            {theme.animations.envelope_open}
                        </span>
                        <span
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide"
                            style={{ backgroundColor: `${visuals.accent}20`, color: visuals.accent }}
                        >
                            <span className="opacity-60">TXT</span>
                            {theme.animations.text_reveal}
                        </span>
                        {theme.ambient.effects.length > 0 && (
                            <span
                                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide"
                                style={{ backgroundColor: `${visuals.accent}20`, color: visuals.accent }}
                            >
                                <span className="opacity-60">FX</span>
                                {theme.ambient.effects.length}
                            </span>
                        )}
                    </div>
                </div>

                <div
                    className={`
                        absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500
                        ${isSelected ? 'opacity-100' : 'group-hover:opacity-50'}
                    `}
                    style={{
                        boxShadow: `inset 0 0 30px ${visuals.accent}15`,
                    }}
                />
            </div>
        </motion.button>
    );
}

export default function LoveLetterViewerPreview() {
    const [isPreviewActive, setIsPreviewActive] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<LoveLetterThemeId>('midnight-candlelight');
    const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>('normal');
    const [soundsEnabled, setSoundsEnabled] = useState(false);
    const [previewKey, setPreviewKey] = useState(0);

    const themes = getAllThemes();
    const currentTheme = getTheme(selectedTheme);
    const visuals = themeVisuals[selectedTheme];

    const handleStartPreview = () => {
        setPreviewKey((k) => k + 1);
        setIsPreviewActive(true);
    };

    const handleReset = () => {
        setIsPreviewActive(false);
    };

    return (
        <>
            <Head title="Love Letter Viewer Test" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Outfit:wght@300;400;500&display=swap');
            `}</style>

            <AnimatePresence mode="wait">
                {isPreviewActive ? (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="relative min-h-screen"
                    >
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                            onClick={handleReset}
                            className="fixed left-5 top-5 z-50 flex items-center gap-2.5 rounded-full border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white/80 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-black/80 hover:text-white"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span style={{ fontFamily: "'Outfit', sans-serif" }}>Back</span>
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                            className="fixed right-5 top-5 z-50 flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-4 py-2 backdrop-blur-xl"
                        >
                            <span className="text-lg">{visuals.icon}</span>
                            <div className="flex items-center gap-2 text-xs" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                <span className="text-white/60">{currentTheme.name}</span>
                                <span className="text-white/30">•</span>
                                <span className="text-white/40">{animationSpeed}</span>
                                <span className="text-white/30">•</span>
                                <span className={soundsEnabled ? 'text-rose-400' : 'text-white/40'}>
                                    {soundsEnabled ? '🔊' : '🔇'}
                                </span>
                            </div>
                        </motion.div>

                        <LoveLetterViewer
                            key={previewKey}
                            customizations={buildCustomizations(selectedTheme, animationSpeed, soundsEnabled)}
                            slug="test-preview"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="config"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="relative min-h-screen overflow-hidden"
                        style={{ backgroundColor: '#0c0607' }}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/20 via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-950/10 via-transparent to-transparent" />

                        <div
                            className="absolute inset-0 opacity-[0.015]"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                            }}
                        />

                        <div className="relative z-10 px-6 py-12 sm:px-8 lg:px-12">
                            <div className="mx-auto max-w-6xl">
                                <motion.header
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                                    className="mb-16 text-center"
                                >
                                    <p
                                        className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-rose-400/70"
                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                    >
                                        Developer Preview
                                    </p>
                                    <h1
                                        className="text-4xl tracking-wide text-white/90 sm:text-5xl"
                                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                                    >
                                        Love Letter Viewer
                                    </h1>
                                    <p
                                        className="mx-auto mt-4 max-w-md text-sm text-white/40"
                                        style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}
                                    >
                                        Select a theme and configure animation settings to test the viewer experience
                                    </p>
                                </motion.header>

                                <div className="grid gap-12 lg:grid-cols-[1fr,340px]">
                                    <section>
                                        <motion.h2
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="mb-6 text-[10px] font-medium uppercase tracking-[0.25em] text-white/30"
                                            style={{ fontFamily: "'Outfit', sans-serif" }}
                                        >
                                            Theme Selection
                                        </motion.h2>
                                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                            {themes.map((theme, index) => (
                                                <ThemeCard
                                                    key={theme.id}
                                                    theme={theme}
                                                    isSelected={selectedTheme === theme.id}
                                                    onSelect={() => setSelectedTheme(theme.id)}
                                                    index={index}
                                                />
                                            ))}
                                        </div>
                                    </section>

                                    <aside className="space-y-8">
                                        <motion.section
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4, duration: 0.5 }}
                                        >
                                            <h2
                                                className="mb-4 text-[10px] font-medium uppercase tracking-[0.25em] text-white/30"
                                                style={{ fontFamily: "'Outfit', sans-serif" }}
                                            >
                                                Animation Speed
                                            </h2>
                                            <div className="flex rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
                                                {(['slow', 'normal', 'fast'] as const).map((speed) => (
                                                    <button
                                                        key={speed}
                                                        onClick={() => setAnimationSpeed(speed)}
                                                        className={`
                                                            relative flex-1 rounded-lg py-2.5 text-xs font-medium capitalize transition-all duration-300
                                                            ${animationSpeed === speed
                                                                ? 'text-white'
                                                                : 'text-white/40 hover:text-white/60'
                                                            }
                                                        `}
                                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                                    >
                                                        {animationSpeed === speed && (
                                                            <motion.div
                                                                layoutId="speed-indicator"
                                                                className="absolute inset-0 rounded-lg bg-gradient-to-br from-rose-500/20 to-rose-600/10 shadow-inner"
                                                                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                                                            />
                                                        )}
                                                        <span className="relative z-10">{speed}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.section>

                                        <motion.section
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5, duration: 0.5 }}
                                        >
                                            <h2
                                                className="mb-4 text-[10px] font-medium uppercase tracking-[0.25em] text-white/30"
                                                style={{ fontFamily: "'Outfit', sans-serif" }}
                                            >
                                                Sound
                                            </h2>
                                            <button
                                                onClick={() => setSoundsEnabled(!soundsEnabled)}
                                                className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 transition-all hover:border-white/[0.1]"
                                            >
                                                <span
                                                    className="text-xs text-white/60"
                                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                                >
                                                    {soundsEnabled ? 'Sounds Enabled' : 'Sounds Disabled'}
                                                </span>
                                                <div
                                                    className={`
                                                        relative h-6 w-11 rounded-full transition-colors duration-300
                                                        ${soundsEnabled ? 'bg-rose-500/80' : 'bg-white/10'}
                                                    `}
                                                >
                                                    <motion.div
                                                        animate={{ x: soundsEnabled ? 20 : 2 }}
                                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                        className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
                                                    />
                                                </div>
                                            </button>
                                        </motion.section>

                                        <motion.section
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6, duration: 0.5 }}
                                            className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-5"
                                        >
                                            <div className="mb-4 flex items-center gap-3">
                                                <span className="text-xl">{visuals.icon}</span>
                                                <h2
                                                    className="text-sm font-medium text-white/80"
                                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                                >
                                                    {currentTheme.name}
                                                </h2>
                                            </div>

                                            <div
                                                className="space-y-2.5 text-xs"
                                                style={{ fontFamily: "'Outfit', sans-serif" }}
                                            >
                                                {[
                                                    ['Envelope', currentTheme.animations.envelope_open],
                                                    ['Text Reveal', currentTheme.animations.text_reveal],
                                                    ['Effects', currentTheme.ambient.effects.length > 0 ? currentTheme.ambient.effects.join(', ') : '—'],
                                                    ['Borders', currentTheme.decorations.borders],
                                                    ['Drop Cap', currentTheme.decorations.drop_cap ? currentTheme.decorations.drop_cap_style : '—'],
                                                ].map(([label, value]) => (
                                                    <div key={label} className="flex items-center justify-between">
                                                        <span className="text-white/30">{label}</span>
                                                        <span className="font-mono text-[11px] text-white/60">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.section>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7, duration: 0.5 }}
                                        >
                                            <button
                                                onClick={handleStartPreview}
                                                className="group relative w-full overflow-hidden rounded-2xl p-[1px]"
                                            >
                                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

                                                <div className="relative flex items-center justify-center gap-3 rounded-[15px] bg-[#0c0607]/80 px-8 py-4 backdrop-blur-sm transition-colors group-hover:bg-[#0c0607]/60">
                                                    <svg
                                                        className="h-5 w-5 text-rose-400 transition-transform duration-300 group-hover:scale-110"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span
                                                        className="text-sm font-medium tracking-wide text-white"
                                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                                    >
                                                        Launch Preview
                                                    </span>
                                                </div>
                                            </button>
                                        </motion.div>
                                    </aside>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
