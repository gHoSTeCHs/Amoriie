import { Head, Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { Heart, Shield, Database, Clock, Cookie, UserCheck, ArrowLeft } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

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
        const generated: FloatingHeart[] = Array.from({ length: 8 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 8,
            duration: 12 + Math.random() * 16,
            size: 8 + Math.random() * 12,
            opacity: 0.06 + Math.random() * 0.14,
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
                        x: [0, Math.sin(heart.id) * 30],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: heart.duration,
                        delay: heart.delay,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    ♥
                </motion.div>
            ))}
        </div>
    );
}

function Section({
    children,
    className = '',
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function SectionHeading({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
    return (
        <div className="mb-5 flex items-center gap-3 sm:mb-6">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/5 sm:size-10">
                <Icon className="size-4 text-rose-400 sm:size-[18px]" />
            </div>
            <h2
                className="text-xl text-rose-50 sm:text-2xl"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
            >
                {title}
            </h2>
        </div>
    );
}

function Divider() {
    return <div className="my-10 h-px bg-gradient-to-r from-transparent via-rose-500/10 to-transparent sm:my-14" />;
}

export default function Privacy() {
    return (
        <>
            <Head title="Privacy Policy — Amoriie">
                <meta name="description" content="Learn how Amoriie handles your data. We collect minimal information and never share your personal love letters." />
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

            <div className="relative min-h-dvh overflow-hidden bg-[#0c0607]">
                <FloatingHearts />

                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundImage:
                            'radial-gradient(ellipse at 50% 0%, rgba(190,18,60,0.08) 0%, transparent 60%)',
                    }}
                />

                <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/5 bg-[#0c0607]/80 backdrop-blur-md">
                    <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3.5 sm:px-8 sm:py-4">
                        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                            <Heart className="size-5 fill-rose-500 text-rose-500" />
                            <span
                                className="text-lg tracking-wide text-white"
                                style={{ fontFamily: "'Italiana', serif" }}
                            >
                                Amoriie
                            </span>
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-1.5 text-sm text-rose-100/50 transition-colors hover:text-rose-100"
                        >
                            <ArrowLeft className="size-3.5" />
                            Home
                        </Link>
                    </nav>
                </header>

                <main className="relative z-10 mx-auto max-w-3xl px-6 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-24">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-12 sm:mb-16"
                    >
                        <div className="mb-4 flex items-center gap-2.5">
                            <Shield className="size-5 text-rose-400/60" />
                            <span className="text-sm tracking-widest text-rose-400/60 uppercase">
                                Your Privacy
                            </span>
                        </div>
                        <h1
                            className="mb-4 text-4xl text-white sm:text-5xl md:text-6xl"
                            style={{ fontFamily: "'Italiana', serif" }}
                        >
                            Privacy Policy
                        </h1>
                        <p className="text-sm text-rose-100/40 sm:text-base">
                            Last updated — February 2026
                        </p>
                    </motion.div>

                    <Section>
                        <div className="rounded-2xl border border-rose-500/10 bg-rose-500/[0.03] p-6 sm:p-8">
                            <p
                                className="text-lg leading-relaxed text-rose-100/80 sm:text-xl"
                                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                            >
                                At Amoriie, love letters deserve privacy. We built this platform to help
                                you express your deepest feelings — not to harvest your data. Here's
                                exactly what we do with your information, explained simply and honestly.
                            </p>
                        </div>
                    </Section>

                    <Divider />

                    <Section>
                        <SectionHeading icon={Database} title="What We Collect" />
                        <div className="space-y-4 text-[15px] leading-relaxed text-rose-100/60 sm:text-base">
                            <p>
                                We only collect what's necessary to make your valentines come alive.
                                Nothing more.
                            </p>
                            <ul className="ml-1 space-y-2.5">
                                {[
                                    { label: 'Account information', detail: 'Your name and email when you register' },
                                    { label: 'Valentine content', detail: 'The messages, recipient names, and customization choices you make' },
                                    { label: 'Uploaded media', detail: 'Images and audio clips you add to your valentines' },
                                    { label: 'Basic engagement stats', detail: 'Page views and open rates, shown only on your private stats dashboard' },
                                ].map((item) => (
                                    <li key={item.label} className="flex items-start gap-3">
                                        <span className="mt-2 block size-1.5 shrink-0 rounded-full bg-rose-500/40" />
                                        <span>
                                            <span className="font-medium text-rose-100/80">{item.label}</span>
                                            {' — '}
                                            {item.detail}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Section>

                    <Divider />

                    <Section>
                        <SectionHeading icon={Heart} title="How We Use It" />
                        <div className="space-y-4 text-[15px] leading-relaxed text-rose-100/60 sm:text-base">
                            <p>
                                Your data serves one purpose: bringing your valentines to life and showing
                                you how they're received.
                            </p>
                            <p>
                                We use your information to create and deliver your valentines, to display
                                engagement statistics on your private dashboard, and to improve the
                                platform experience.
                            </p>
                            <div className="rounded-xl border border-rose-500/10 bg-rose-500/[0.02] px-5 py-4">
                                <p
                                    className="text-base text-rose-200/70 italic sm:text-lg"
                                    style={{ fontFamily: "'Dancing Script', cursive" }}
                                >
                                    "We don't sell your data. We don't run ads. We don't build advertising
                                    profiles. Your love letters are yours alone."
                                </p>
                            </div>
                        </div>
                    </Section>

                    <Divider />

                    <Section>
                        <SectionHeading icon={Shield} title="Your Data is Safe" />
                        <div className="space-y-4 text-[15px] leading-relaxed text-rose-100/60 sm:text-base">
                            <p>
                                Your data is stored securely using industry-standard encryption and
                                trusted infrastructure. Every connection to Amoriie is encrypted,
                                and we take the security of your words seriously.
                            </p>
                        </div>
                    </Section>

                    <Divider />

                    <Section>
                        <SectionHeading icon={Clock} title="The 90-Day Promise" />
                        <div className="space-y-4 text-[15px] leading-relaxed text-rose-100/60 sm:text-base">
                            <div className="rounded-2xl border border-rose-500/15 bg-gradient-to-br from-rose-500/[0.04] to-pink-500/[0.02] p-6 sm:p-8">
                                <p
                                    className="mb-3 text-lg text-rose-100/90 sm:text-xl"
                                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
                                >
                                    Your valentines automatically expire after 90 days.
                                </p>
                                <p className="text-rose-100/60">
                                    When a valentine expires, it's permanently deleted. Media files are
                                    removed from storage. Stats data is purged. Nothing lingers.
                                </p>
                            </div>
                            <p>
                                This is by design. A valentine is meant to be a moment — a beautiful,
                                fleeting gesture of love. We believe some things are more precious
                                precisely because they don't last forever.
                            </p>
                        </div>
                    </Section>

                    <Divider />

                    <Section>
                        <SectionHeading icon={Cookie} title="Cookies" />
                        <div className="space-y-4 text-[15px] leading-relaxed text-rose-100/60 sm:text-base">
                            <p>
                                We use only essential cookies — the bare minimum needed to keep you
                                logged in and your session secure.
                            </p>
                            <p>
                                No tracking cookies. No third-party cookies. No cookie consent banners
                                that follow you around, because there's nothing to consent to beyond
                                the basics.
                            </p>
                        </div>
                    </Section>

                    <Divider />

                    <Section>
                        <SectionHeading icon={UserCheck} title="Your Rights" />
                        <div className="space-y-4 text-[15px] leading-relaxed text-rose-100/60 sm:text-base">
                            <p>Your data, your rules. You can always:</p>
                            <ul className="ml-1 space-y-2.5">
                                {[
                                    'Delete any of your valentines at any time',
                                    'Delete your account and all associated data',
                                    'Request a full copy of your data',
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <span className="mt-2 block size-1.5 shrink-0 rounded-full bg-rose-500/40" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p>
                                All requests are honored promptly. No hoops, no waiting periods, no
                                dark patterns designed to keep your data hostage.
                            </p>
                        </div>
                    </Section>

                    <Divider />

                    <Section>
                        <div className="space-y-4 text-[15px] leading-relaxed text-rose-100/60 sm:text-base">
                            <h2
                                className="mb-3 text-xl text-rose-50 sm:text-2xl"
                                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
                            >
                                Children's Privacy
                            </h2>
                            <p>
                                Amoriie is intended for users aged 13 and older. We do not knowingly
                                collect personal information from children under 13. If we discover
                                that a child under 13 has provided us with personal data, we will
                                delete it immediately.
                            </p>
                        </div>
                    </Section>

                    <Divider />

                    <Section>
                        <div className="space-y-4 text-[15px] leading-relaxed text-rose-100/60 sm:text-base">
                            <h2
                                className="mb-3 text-xl text-rose-50 sm:text-2xl"
                                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
                            >
                                Changes to This Policy
                            </h2>
                            <p>
                                If our privacy practices change, we'll update this page. For significant
                                changes, we'll make sure you know — transparency isn't optional for us,
                                it's fundamental.
                            </p>
                        </div>
                    </Section>

                    <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/5 pt-10 sm:mt-20 sm:flex-row sm:justify-between sm:pt-12">
                        <Link
                            href="/terms"
                            className="text-sm text-rose-100/50 transition-colors hover:text-rose-100"
                        >
                            Read our Terms of Service →
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-1.5 text-sm text-rose-100/40 transition-colors hover:text-rose-100"
                        >
                            <Heart className="size-3.5 fill-rose-500/40 text-rose-500/40" />
                            Back to Amoriie
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}
