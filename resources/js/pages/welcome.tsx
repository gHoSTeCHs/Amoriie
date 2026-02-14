import { Head, Link } from '@inertiajs/react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
    ArrowRight,
    Heart,
    ImagePlus,
    Palette,
    Send,
    Sparkles,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import create from '@/routes/create';

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
        const generated: FloatingHeart[] = Array.from(
            { length: 20 },
            (_, i) => ({
                id: i,
                x: Math.random() * 100,
                delay: Math.random() * 5,
                duration: 8 + Math.random() * 12,
                size: 8 + Math.random() * 16,
                opacity: 0.1 + Math.random() * 0.3,
            }),
        );
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
            <div className="relative rounded-3xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-500 group-hover:border-rose-500/20 group-hover:bg-white/[0.04] sm:p-8">
                <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/10 p-3">
                    {icon}
                </div>
                <h3 className="mb-2 font-serif text-xl text-white">{title}</h3>
                <p className="leading-relaxed text-rose-100/60">
                    {description}
                </p>
            </div>
        </motion.div>
    );
}

function PolaroidPreview() {
    return (
        <div className="relative h-56 w-full">
            {/* Scattered polaroid stack with depth */}
            <motion.div
                className="absolute top-1/2 left-1/2 h-28 w-24 -translate-x-1/2 -translate-y-1/2"
                style={{ transformStyle: 'preserve-3d' }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                {/* Back polaroid */}
                <motion.div
                    className="absolute inset-0 rounded-sm bg-gradient-to-br from-rose-100 to-rose-50 p-1.5 shadow-xl"
                    style={{
                        rotate: -12,
                        transformOrigin: 'center center',
                    }}
                    animate={{ rotate: [-12, -10, -12] }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <div className="h-16 w-full rounded-sm bg-gradient-to-br from-rose-300/40 to-pink-200/40" />
                    <div className="mt-1.5 h-2 w-12 rounded-full bg-rose-200/60" />
                </motion.div>

                {/* Middle polaroid */}
                <motion.div
                    className="absolute inset-0 rounded-sm bg-gradient-to-br from-white to-rose-50 p-1.5 shadow-xl"
                    style={{
                        rotate: 6,
                        translateY: -4,
                        transformOrigin: 'center center',
                    }}
                    animate={{ rotate: [6, 8, 6] }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.5,
                    }}
                >
                    <div className="h-16 w-full rounded-sm bg-gradient-to-br from-pink-200/50 to-rose-300/40" />
                    <div className="mt-1.5 h-2 w-10 rounded-full bg-rose-200/60" />
                </motion.div>

                {/* Front polaroid */}
                <motion.div
                    className="absolute inset-0 rounded-sm bg-white p-1.5 shadow-2xl"
                    style={{
                        rotate: -3,
                        translateY: -8,
                        transformOrigin: 'center center',
                    }}
                    animate={{ rotate: [-3, -1, -3] }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.2,
                    }}
                >
                    <div className="relative h-16 w-full overflow-hidden rounded-sm bg-gradient-to-br from-rose-400 to-pink-500">
                        <Heart
                            className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-white/80"
                            fill="currentColor"
                        />
                    </div>
                    <div className="mt-1.5 h-2 w-14 rounded-full bg-rose-300/80" />
                </motion.div>
            </motion.div>

            {/* Decorative tape */}
            <div
                className="absolute top-6 left-1/2 h-4 w-10 -translate-x-1/2 -rotate-12 rounded-sm bg-rose-200/30"
                style={{ backdropFilter: 'blur(2px)' }}
            />
        </div>
    );
}

function EnvelopePreview() {
    return (
        <div className="relative h-56 w-full">
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                {/* Envelope body */}
                <div className="relative h-24 w-32 rounded-lg bg-gradient-to-br from-rose-100 via-rose-50 to-white shadow-xl">
                    {/* Envelope texture */}
                    <div
                        className="absolute inset-0 rounded-lg opacity-30"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='none'/%3E%3Cpath d='M0 10h20M10 0v20' stroke='%23be123c' stroke-width='0.3' opacity='0.3'/%3E%3C/svg%3E")`,
                        }}
                    />

                    {/* Inner flap shadow */}
                    <div className="absolute inset-x-0 top-0 h-12 rounded-t-lg bg-gradient-to-b from-rose-200/30 to-transparent" />

                    {/* Decorative border */}
                    <div className="absolute inset-2 rounded border border-rose-300/30" />

                    {/* Wax seal */}
                    <motion.div
                        className="absolute -bottom-3 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full bg-gradient-to-br from-rose-600 to-rose-800 shadow-lg"
                        animate={{
                            boxShadow: [
                                '0 4px 15px rgba(190, 18, 60, 0.4)',
                                '0 4px 25px rgba(190, 18, 60, 0.6)',
                                '0 4px 15px rgba(190, 18, 60, 0.4)',
                            ],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <Heart
                            className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-rose-200"
                            fill="currentColor"
                        />
                    </motion.div>
                </div>

                {/* Top flap */}
                <motion.div
                    className="absolute -top-6 left-1/2 h-12 w-28 origin-bottom -translate-x-1/2"
                    style={{
                        clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                        background:
                            'linear-gradient(to bottom right, #fce7f3, #fff1f2)',
                    }}
                    animate={{ rotateX: [0, 5, 0] }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {/* Letter peeking out */}
                <motion.div
                    className="absolute -top-2 left-1/2 h-6 w-24 -translate-x-1/2 rounded-t bg-white shadow-sm"
                    animate={{ y: [0, -2, 0] }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1,
                    }}
                >
                    <div className="mx-2 mt-2 space-y-1">
                        <div className="h-0.5 w-16 rounded-full bg-rose-200/60" />
                        <div className="h-0.5 w-12 rounded-full bg-rose-200/40" />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

function TemplateShowcase() {
    const templates = [
        {
            id: 'polaroid-memories',
            title: 'Polaroid Memories',
            description: 'Nostalgic & playful',
            thumbnail: '/images/templates/polaroid-memories.png',
            features: [
                '4 beautiful backgrounds',
                '3 unique frame styles',
                'Photo gallery reveal',
                'Music backdrop',
            ],
            gradient: 'from-pink-500/20 to-rose-500/10',
            accentColor: 'pink',
        },
        {
            id: 'love-letter',
            title: 'Love Letter',
            description: 'Classic & romantic',
            thumbnail: '/images/templates/love-letter.png',
            features: [
                '6 themed experiences',
                'Envelope animations',
                'Letter reveal effects',
                'Elegant typography',
            ],
            gradient: 'from-rose-500/20 to-pink-500/10',
            accentColor: 'rose',
        },
    ];

    return (
        <section className="relative px-6 py-24 lg:px-8">
            {/* Decorative background glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/2 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/5 blur-3xl" />
                <div className="absolute top-1/2 right-1/4 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/5 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-6xl">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mb-4 inline-block text-sm tracking-[0.2em] text-rose-400/80 uppercase"
                    >
                        Express Your Love
                    </motion.span>
                    <h2
                        className="mb-4 text-3xl text-white md:text-4xl lg:text-5xl"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: 500,
                        }}
                    >
                        Choose Your Style
                    </h2>
                    <p className="mx-auto max-w-xl text-lg text-rose-100/60">
                        Two beautiful ways to express your love
                    </p>
                </motion.div>

                {/* Template cards */}
                <div className="grid gap-8 md:grid-cols-2">
                    {templates.map((template, index) => (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="group relative"
                        >
                            {/* Hover glow effect */}
                            <div
                                className={`absolute -inset-px rounded-3xl bg-gradient-to-b ${template.gradient} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100`}
                            />

                            {/* Card */}
                            <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 group-hover:border-rose-500/20 group-hover:bg-white/[0.04]">
                                {/* Preview area */}
                                <div className="relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                                    <motion.img
                                        src={template.thumbnail}
                                        alt={template.title}
                                        className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-5 sm:p-8">
                                    <div className="mb-4">
                                        <h3
                                            className="mb-1 text-2xl text-white"
                                            style={{
                                                fontFamily:
                                                    "'Cormorant Garamond', serif",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {template.title}
                                        </h3>
                                        <p
                                            className="text-rose-300/70"
                                            style={{
                                                fontFamily:
                                                    "'Dancing Script', cursive",
                                            }}
                                        >
                                            {template.description}
                                        </p>
                                    </div>

                                    {/* Features */}
                                    <ul className="mb-6 space-y-2.5">
                                        {template.features.map((feature, i) => (
                                            <motion.li
                                                key={`${template.id}-feature-${i}`}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    delay: 0.3 + i * 0.1,
                                                }}
                                                className="flex items-center gap-3 text-sm text-rose-100/70"
                                            >
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/10">
                                                    <Heart
                                                        className="h-2.5 w-2.5 text-rose-400"
                                                        fill="currentColor"
                                                    />
                                                </span>
                                                {feature}
                                            </motion.li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    <Link
                                        href={create.builder.url(template.id)}
                                        className="group/btn relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-rose-500/30 bg-rose-500/10 px-6 py-3.5 text-sm font-medium text-rose-100 transition-all duration-300 hover:border-rose-500/50 hover:bg-rose-500/20"
                                    >
                                        <span>Choose This</span>
                                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Decorative connector */}
                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                        className="hidden h-32 w-px bg-gradient-to-b from-transparent via-rose-500/20 to-transparent md:block"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </div>
            </div>
        </section>
    );
}

function HowItWorks() {
    const steps = [
        {
            number: '01',
            icon: Palette,
            title: 'Choose & Customize',
            description:
                'Pick your template and personalize the theme to match your style',
        },
        {
            number: '02',
            icon: ImagePlus,
            title: 'Add Your Content',
            description:
                'Upload photos, write your heartfelt message, and add your song',
        },
        {
            number: '03',
            icon: Send,
            title: 'Share & Delight',
            description:
                'Send your unique link and watch their reaction unfold',
        },
    ];

    return (
        <section className="relative overflow-hidden px-6 py-24 lg:px-8">
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-rose-500/20 to-transparent" />
                <div className="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-rose-500/20 to-transparent" />
            </div>

            <div className="relative mx-auto max-w-6xl">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20 text-center"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mb-4 inline-block text-sm tracking-[0.2em] text-rose-400/80 uppercase"
                    >
                        Simple & Magical
                    </motion.span>
                    <h2
                        className="mb-4 text-3xl text-white md:text-4xl lg:text-5xl"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: 500,
                        }}
                    >
                        How It Works
                    </h2>
                    <p className="mx-auto max-w-xl text-lg text-rose-100/60">
                        Create something unforgettable in minutes
                    </p>
                </motion.div>

                {/* Steps container */}
                <div className="relative">
                    {/* Connecting line - desktop only */}
                    <div className="absolute top-10 right-0 left-0 hidden md:block">
                        <svg
                            className="mx-auto h-8 w-full max-w-4xl"
                            viewBox="0 0 900 32"
                            fill="none"
                            preserveAspectRatio="none"
                        >
                            <motion.path
                                d="M150 16 C240 16, 260 16, 450 16 C640 16, 660 16, 750 16"
                                stroke="url(#lineGradient)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeDasharray="8 8"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 1.5,
                                    delay: 0.5,
                                    ease: 'easeInOut',
                                }}
                            />
                            <defs>
                                <linearGradient
                                    id="lineGradient"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="0%"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="rgba(244, 63, 94, 0.3)"
                                    />
                                    <stop
                                        offset="50%"
                                        stopColor="rgba(236, 72, 153, 0.5)"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="rgba(244, 63, 94, 0.3)"
                                    />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* Steps grid */}
                    <div className="grid gap-8 md:grid-cols-3 md:gap-12">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.2,
                                }}
                                className="group relative text-center"
                            >
                                {/* Step number - decorative background */}
                                <motion.div
                                    className="absolute -top-16 left-1/2 -translate-x-1/2 select-none md:-top-20"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.2 + 0.3,
                                    }}
                                >
                                    <span
                                        className="text-7xl text-rose-500/[0.08] md:text-8xl"
                                        style={{
                                            fontFamily:
                                                "'Dancing Script', cursive",
                                        }}
                                    >
                                        {step.number}
                                    </span>
                                </motion.div>

                                {/* Icon container */}
                                <motion.div
                                    className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 400,
                                    }}
                                >
                                    {/* Outer glow ring */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/10 blur-md transition-all duration-500 group-hover:from-rose-500/30 group-hover:to-pink-500/20" />

                                    {/* Icon circle */}
                                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-pink-500/5 backdrop-blur-sm transition-all duration-500 group-hover:border-rose-500/50 group-hover:from-rose-500/20 group-hover:to-pink-500/10">
                                        <step.icon className="h-7 w-7 text-rose-400 transition-colors duration-300 group-hover:text-rose-300" />
                                    </div>

                                    {/* Animated ring */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full border border-rose-500/20"
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 0, 0.5],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            delay: index * 0.5,
                                            ease: 'easeInOut',
                                        }}
                                    />
                                </motion.div>

                                {/* Content */}
                                <h3
                                    className="mb-3 text-xl text-white md:text-2xl"
                                    style={{
                                        fontFamily:
                                            "'Cormorant Garamond', serif",
                                        fontWeight: 500,
                                    }}
                                >
                                    {step.title}
                                </h3>
                                <p className="mx-auto max-w-xs leading-relaxed text-rose-100/60">
                                    {step.description}
                                </p>

                                {/* Mobile connector - smooth flow */}
                                {index < steps.length - 1 && (
                                    <div className="mx-auto mt-6 h-16 w-px bg-gradient-to-b from-rose-500/40 via-rose-500/20 to-rose-500/40 md:hidden" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
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
                            <feGaussianBlur
                                stdDeviation="2"
                                result="coloredBlur"
                            />
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

export default function Welcome({ ogImageUrl, appUrl }: { ogImageUrl: string; appUrl: string }) {
    const title = 'Amoriie — Create Beautiful Love Letters & Valentines';
    const description = 'Create beautiful, personalized love letters and valentines for your special someone. Choose from stunning themes, add music, and share your feelings.';

    return (
        <>
            <Head title={title}>
                <meta name="description" content={description} />

                <meta property="og:type" content="website" />
                <meta property="og:url" content={appUrl} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={ogImageUrl} />
                <meta property="og:site_name" content="Amoriie" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={appUrl} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={ogImageUrl} />

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

                <GlowingOrb className="top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2" />
                <GlowingOrb className="right-1/4 bottom-1/4 h-80 w-80 translate-x-1/2 translate-y-1/2" />

                <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(190,18,60,0.1) 0%, transparent 50%)`,
                    }}
                />

                <header className="relative z-10">
                    <nav className="mx-auto flex max-w-7xl items-center justify-center px-6 py-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Link href="/" className="flex items-center gap-2">
                                <Heart
                                    className="h-6 w-6 text-rose-500"
                                    fill="currentColor"
                                />
                                <span
                                    className="text-2xl tracking-wide text-white"
                                    style={{ fontFamily: "'Italiana', serif" }}
                                >
                                    Amoriie
                                </span>
                            </Link>
                        </motion.div>
                    </nav>
                </header>

                <main>
                    <section className="relative px-6 pt-12 pb-24 lg:px-8 lg:pt-20">
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
                                                fontFamily:
                                                    "'Cormorant Garamond', serif",
                                                fontWeight: 500,
                                            }}
                                        >
                                            Tell them how you
                                        </span>
                                        <span
                                            className="mt-2 block bg-gradient-to-r from-rose-400 via-pink-400 to-rose-300 bg-clip-text text-4xl text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
                                            style={{
                                                fontFamily:
                                                    "'Dancing Script', cursive",
                                                fontWeight: 600,
                                            }}
                                        >
                                            truly feel
                                        </span>
                                    </h1>

                                    <p
                                        className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-rose-100/70 sm:text-lg lg:mx-0"
                                        style={{
                                            fontFamily:
                                                "'Cormorant Garamond', serif",
                                        }}
                                    >
                                        Create a personalized, immersive
                                        Valentine&apos;s experience for your
                                        special someone. Add photos, music,
                                        heartfelt messages — and watch their
                                        reaction unfold.
                                    </p>

                                    <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                                        <Link
                                            href={create.index.url()}
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

                    {/* Template Showcase Section */}
                    <TemplateShowcase />

                    {/* How It Works Section */}
                    <HowItWorks />

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
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-4 inline-block text-sm tracking-[0.2em] text-rose-400/80 uppercase"
                                >
                                    Features
                                </motion.span>
                                <h2
                                    className="mb-4 text-3xl text-white md:text-4xl"
                                    style={{
                                        fontFamily:
                                            "'Cormorant Garamond', serif",
                                        fontWeight: 500,
                                    }}
                                >
                                    What Makes It Special
                                </h2>
                                <p className="mx-auto max-w-2xl text-rose-100/60">
                                    Every detail crafted to make your message
                                    unforgettable
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
                                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    }
                                    title="Beautiful Animations"
                                    description="Envelope openings, letter reveals, and photo transitions that bring your message to life with cinematic flair."
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
                                    title="Your Soundtrack"
                                    description="Add a song that means something to both of you. It plays throughout their journey, setting the perfect mood."
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
                                    title="Handwritten Typography"
                                    description="Elegant fonts that feel personal and intimate. Your words will look like they came straight from your heart."
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
                                    title="Multiple Themes"
                                    description="From romantic and classic to playful and modern. Pick a style that captures your unique relationship."
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
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    }
                                    title="See Their Reaction"
                                    description="Get notified the moment they open your valentine. Watch their journey unfold and see their heartfelt response."
                                    delay={0.4}
                                />
                                <FeatureCard
                                    icon={
                                        <Heart className="h-6 w-6 text-rose-400" />
                                    }
                                    title="The Big Question"
                                    description="End with the moment that matters most: Will you be my Valentine? See their answer and celebrate together."
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
                                className="relative overflow-hidden rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-950/50 to-pink-950/30 p-6 text-center backdrop-blur-sm sm:p-8 md:p-12"
                            >
                                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl" />
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
                                            fontFamily:
                                                "'Cormorant Garamond', serif",
                                            fontWeight: 500,
                                        }}
                                    >
                                        Ready to confess your feelings?
                                    </h2>
                                    <p className="mx-auto mb-8 max-w-lg text-rose-100/70">
                                        Don&apos;t let another moment pass.
                                        Create something beautiful that tells
                                        them exactly how you feel.
                                    </p>

                                    <Link
                                        href={create.index.url()}
                                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-xl hover:shadow-rose-500/30 sm:px-8 sm:py-4 sm:text-lg"
                                    >
                                        <span className="relative z-10">
                                            Start Creating Now
                                        </span>
                                        <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
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
                                <Link
                                    href="/privacy"
                                    className="transition-colors hover:text-rose-100"
                                >
                                    Privacy
                                </Link>
                                <Link
                                    href="/terms"
                                    className="transition-colors hover:text-rose-100"
                                >
                                    Terms
                                </Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
