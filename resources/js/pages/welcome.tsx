import { Head, Link } from '@inertiajs/react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface FloatingHeart {
    id: number;
    x: number;
    delay: number;
    duration: number;
    size: number;
    opacity: number;
}

function FloatingHearts() {
    const [hearts, setHearts] = useState<FloatingHeart[]>([]);

    useEffect(() => {
        const generated: FloatingHeart[] = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 8 + Math.random() * 12,
            size: 8 + Math.random() * 16,
            opacity: 0.1 + Math.random() * 0.3,
        }));
        setHearts(generated);
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    className="absolute text-rose-500/30"
                    style={{
                        left: `${heart.x}%`,
                        bottom: '-20px',
                        fontSize: heart.size,
                        opacity: heart.opacity,
                    }}
                    animate={{
                        y: [0, -window.innerHeight - 100],
                        x: [0, Math.sin(heart.id) * 50],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: heart.duration,
                        delay: heart.delay,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    <Heart fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
}

function GlowingOrb({ className }: { className?: string }) {
    return (
        <div
            className={`absolute rounded-full blur-3xl ${className}`}
            style={{
                background:
                    'radial-gradient(circle, rgba(190,18,60,0.4) 0%, rgba(159,18,57,0.2) 50%, transparent 70%)',
            }}
        />
    );
}

function FeatureCard({
    icon,
    title,
    description,
    delay,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className="group relative"
        >
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-rose-500/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-500 group-hover:border-rose-500/20 group-hover:bg-white/[0.04]">
                <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/10 p-3">
                    {icon}
                </div>
                <h3 className="mb-2 font-serif text-xl text-white">{title}</h3>
                <p className="leading-relaxed text-rose-100/60">{description}</p>
            </div>
        </motion.div>
    );
}

function InteractiveHeart() {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const rotateX = useTransform(ySpring, [-0.5, 0.5], ['15deg', '-15deg']);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ['-15deg', '15deg']);

    function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((event.clientX - centerX) / rect.width);
        y.set((event.clientY - centerY) / rect.height);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="relative cursor-pointer"
        >
            <motion.div
                animate={{
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="relative"
            >
                <svg
                    viewBox="0 0 100 100"
                    className="h-64 w-64 drop-shadow-[0_0_60px_rgba(244,63,94,0.5)] md:h-80 md:w-80"
                >
                    <defs>
                        <linearGradient
                            id="heartGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                        >
                            <stop offset="0%" stopColor="#f43f5e" />
                            <stop offset="50%" stopColor="#be123c" />
                            <stop offset="100%" stopColor="#9f1239" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <path
                        d="M50 88.9C47.5 88.9 45.1 88 43.3 86.4C25.2 70.2 10 54.9 10 38.6C10 24.5 21.3 13.2 35.4 13.2C42.3 13.2 48.8 16 53.5 20.7L50 24.2L46.5 20.7C51.2 16 57.7 13.2 64.6 13.2C78.7 13.2 90 24.5 90 38.6C90 54.9 74.8 70.2 56.7 86.4C54.9 88 52.5 88.9 50 88.9Z"
                        fill="url(#heartGradient)"
                        filter="url(#glow)"
                    />
                </svg>
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <Sparkles className="h-8 w-8 text-rose-200" />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

export default function Welcome() {
    return (
        <>
            <Head title="Amoriie — Confess Your Feelings">
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

            <div className="relative min-h-screen overflow-hidden bg-[#0c0607]">
                <FloatingHearts />

                <GlowingOrb className="left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2" />
                <GlowingOrb className="bottom-1/4 right-1/4 h-80 w-80 translate-x-1/2 translate-y-1/2" />

                <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(190,18,60,0.1) 0%, transparent 50%)`,
                    }}
                />

                <header className="relative z-10">
                    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Link href="/" className="flex items-center gap-2">
                                <Heart className="h-6 w-6 text-rose-500" fill="currentColor" />
                                <span
                                    className="text-2xl tracking-wide text-white"
                                    style={{ fontFamily: "'Italiana', serif" }}
                                >
                                    Amoriie
                                </span>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center gap-4"
                        >
                            <Link
                                href="/login"
                                className="px-4 py-2 text-sm text-rose-100/80 transition-colors hover:text-white"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-full border border-rose-500/30 bg-rose-500/10 px-5 py-2 text-sm text-rose-100 transition-all hover:border-rose-500/50 hover:bg-rose-500/20"
                            >
                                Get Started
                            </Link>
                        </motion.div>
                    </nav>
                </header>

                <main>
                    <section className="relative px-6 pb-24 pt-12 lg:px-8 lg:pt-20">
                        <div className="mx-auto max-w-7xl">
                            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="text-center lg:text-left"
                                >
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-1.5 text-sm text-rose-300"
                                    >
                                        <Sparkles className="h-4 w-4" />
                                        Valentine&apos;s Season 2026
                                    </motion.p>

                                    <h1 className="mb-6">
                                        <span
                                            className="block text-4xl leading-tight text-white md:text-5xl lg:text-6xl"
                                            style={{
                                                fontFamily: "'Cormorant Garamond', serif",
                                                fontWeight: 500,
                                            }}
                                        >
                                            Tell them how you
                                        </span>
                                        <span
                                            className="mt-2 block bg-gradient-to-r from-rose-400 via-pink-400 to-rose-300 bg-clip-text text-5xl text-transparent md:text-6xl lg:text-7xl"
                                            style={{
                                                fontFamily: "'Dancing Script', cursive",
                                                fontWeight: 600,
                                            }}
                                        >
                                            truly feel
                                        </span>
                                    </h1>

                                    <p
                                        className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-rose-100/70 lg:mx-0"
                                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                    >
                                        Create a personalized, immersive Valentine&apos;s
                                        experience for your special someone. Add photos, music,
                                        heartfelt messages — and watch their reaction unfold.
                                    </p>

                                    <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                                        <Link
                                            href="/create"
                                            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-8 py-4 text-lg font-medium text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-xl hover:shadow-rose-500/30"
                                        >
                                            <span className="relative z-10">
                                                Create Your Valentine
                                            </span>
                                            <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
                                        </Link>
                                        <span className="text-sm text-rose-100/50">
                                            Free to create • No account required
                                        </span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1, delay: 0.4 }}
                                    className="relative flex justify-center"
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-72 w-72 rounded-full bg-rose-500/10 blur-3xl md:h-96 md:w-96" />
                                    </div>
                                    <InteractiveHeart />
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    <section className="relative px-6 py-24 lg:px-8">
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    'linear-gradient(180deg, transparent 0%, rgba(159,18,57,0.05) 50%, transparent 100%)',
                            }}
                        />

                        <div className="relative mx-auto max-w-7xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-16 text-center"
                            >
                                <h2
                                    className="mb-4 text-3xl text-white md:text-4xl"
                                    style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontWeight: 500,
                                    }}
                                >
                                    More than just a card
                                </h2>
                                <p className="mx-auto max-w-2xl text-rose-100/60">
                                    Create an unforgettable experience that captures your emotions
                                    and delivers them in a way words alone never could.
                                </p>
                            </motion.div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <FeatureCard
                                    icon={
                                        <svg
                                            className="h-6 w-6 text-rose-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    }
                                    title="Polaroid Memories"
                                    description="Upload your favorite photos and arrange them like cherished polaroids, each one revealing a special moment you've shared."
                                    delay={0}
                                />
                                <FeatureCard
                                    icon={
                                        <svg
                                            className="h-6 w-6 text-rose-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                            />
                                        </svg>
                                    }
                                    title="Your Song"
                                    description="Add a song that means something to both of you. It plays as they explore your valentine, setting the perfect mood."
                                    delay={0.1}
                                />
                                <FeatureCard
                                    icon={
                                        <svg
                                            className="h-6 w-6 text-rose-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                            />
                                        </svg>
                                    }
                                    title="Heartfelt Words"
                                    description="Write your message in beautiful handwritten-style fonts. Express what's in your heart with the perfect typography."
                                    delay={0.2}
                                />
                                <FeatureCard
                                    icon={
                                        <svg
                                            className="h-6 w-6 text-rose-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                            />
                                        </svg>
                                    }
                                    title="Custom Themes"
                                    description="Choose colors and styles that match your relationship. From romantic reds to playful pinks, make it uniquely yours."
                                    delay={0.3}
                                />
                                <FeatureCard
                                    icon={
                                        <svg
                                            className="h-6 w-6 text-rose-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                    }
                                    title="See Their Reaction"
                                    description="Get notified when they view your valentine. Track how long they spend on each section and see their response."
                                    delay={0.4}
                                />
                                <FeatureCard
                                    icon={
                                        <Heart className="h-6 w-6 text-rose-400" />
                                    }
                                    title="The Big Question"
                                    description="End with the moment that matters: Will you be my Valentine? See their answer and celebrate together."
                                    delay={0.5}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="relative px-6 py-24 lg:px-8">
                        <div className="mx-auto max-w-4xl">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative overflow-hidden rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-950/50 to-pink-950/30 p-12 text-center backdrop-blur-sm"
                            >
                                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl" />
                                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />

                                <div className="relative">
                                    <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                        className="mb-6 inline-block"
                                    >
                                        <Heart
                                            className="h-16 w-16 text-rose-500"
                                            fill="currentColor"
                                        />
                                    </motion.div>

                                    <h2
                                        className="mb-4 text-3xl text-white md:text-4xl"
                                        style={{
                                            fontFamily: "'Cormorant Garamond', serif",
                                            fontWeight: 500,
                                        }}
                                    >
                                        Ready to confess your feelings?
                                    </h2>
                                    <p className="mx-auto mb-8 max-w-lg text-rose-100/70">
                                        Don&apos;t let another moment pass. Create something
                                        beautiful that tells them exactly how you feel.
                                    </p>

                                    <Link
                                        href="/create"
                                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-medium text-rose-900 transition-all hover:bg-rose-50"
                                    >
                                        <span>Start Creating Now</span>
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                </main>

                <footer className="relative border-t border-white/5 px-6 py-12">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                            <div className="flex items-center gap-2">
                                <Heart
                                    className="h-5 w-5 text-rose-500"
                                    fill="currentColor"
                                />
                                <span
                                    className="text-xl text-white"
                                    style={{ fontFamily: "'Italiana', serif" }}
                                >
                                    Amoriie
                                </span>
                            </div>

                            <p className="text-sm text-rose-100/40">
                                Made with love for lovers everywhere
                            </p>

                            <div className="flex gap-6 text-sm text-rose-100/60">
                                <a
                                    href="#"
                                    className="transition-colors hover:text-rose-100"
                                >
                                    Privacy
                                </a>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-rose-100"
                                >
                                    Terms
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
