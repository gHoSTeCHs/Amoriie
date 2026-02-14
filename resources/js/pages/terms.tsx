import { Head, Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import {
    Heart,
    ScrollText,
    FileText,
    UserCog,
    Pen,
    ShieldAlert,
    Clock,
    AlertTriangle,
    Gavel,
    ArrowLeft,
} from 'lucide-react';
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

export default function Terms() {
    return (
        <>
            <Head title="Terms of Service — Amoriie">
                <meta name="description" content="Terms of service for using Amoriie. Understand our guidelines for creating and sharing personalized valentines." />
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
                            <ScrollText className="size-5 text-rose-400/60" />
                            <span className="text-sm tracking-widest text-rose-400/60 uppercase">
                                Legal
                            </span>
                        </div>
                        <h1
                            className="mb-4 text-4xl text-white sm:text-5xl md:text-6xl"
                            style={{ fontFamily: "'Italiana', serif" }}
                        >
                            Terms of Service
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
                                By using Amoriie, you agree to these terms. They're written to be
                                fair, clear, and human-readable — because we believe legal documents
                                shouldn't require a law degree to understand.
                            </p>
                        </div>
                    </Section>

                    <Divider />

                    <Section>
                        <SectionHeading icon={FileText} title="What Amoriie Is" />
                        <div className="space-y-4 text-[15px] leading-relaxed text-rose-100/60 sm:text-base">
                            <p>
                                Amoriie is a platform for creating and sharing beautiful, personalized
                                valentines. You craft a message, customize its appearance, and share a
                                unique link with someone special.
                            </p>
                            <p>
                                We provide the canvas and the tools. The words and feelings — those
                                are entirely yours.
                            </p>
                        </div>
                    </Section>

                    <Divider />

                    <Section>
                        <SectionHeading icon={UserCog} title="Your Account" />
                        <div className="space-y-4 text-[15px] leading-relaxed text-rose-100/60 sm:text-base">
                            <p>
                                You can create valentines without an account. If you choose to register,
                                you're responsible for keeping your login credentials secure.
                            </p>
                            <p>
                                Please use accurate information when creating an account. One human,
                                one account — automated or bulk account creation isn't permitted.
                            </p>
                        </div>
                    </Section>

                    <Divider />

                    <Section>
                        <SectionHeading icon={Pen} title="Creating Valentines" />
                        <div className="space-y-4 text-[15px] leading-relaxed text-rose-100/60 sm:text-base">
                            <p>
                                When you create a valentine, you retain full ownership of your content —
                                your words, your images, your audio. By publishing a valentine, you
                                grant Amoriie a limited license to host, display, and deliver your
                                content to the intended recipient.
                            </p>
                            <p>
                                This license exists solely to make the service work. We won't use your
                                love letters in marketing, sell them, or share them with anyone other
                                than the person you send them to.
                            </p>
                            <div className="rounded-xl border border-rose-500/10 bg-rose-500/[0.02] px-5 py-4">
                                <p
                                    className="text-base text-rose-200/70 italic sm:text-lg"
                                    style={{ fontFamily: "'Dancing Script', cursive" }}
                                >
                                    "Your love letters belong to you. We're just the courier."
                                </p>
                            </div>
                        </div>
                    </Section>

                    <Divider />

                    <Section>
                        <SectionHeading icon={ShieldAlert} title="What's Not Allowed" />
                        <div className="space-y-4 text-[15px] leading-relaxed text-rose-100/60 sm:text-base">
                            <p>
                                Amoriie is built for love and kindness. The following are strictly
                                prohibited:
                            </p>
                            <ul className="ml-1 space-y-2.5">
                                {[
                                    { label: 'Harassment or threats', detail: 'Don\'t use Amoriie to intimidate, stalk, or harass anyone' },
                                    { label: 'Explicit or illegal content', detail: 'No pornographic, violent, or unlawful material' },
                                    { label: 'Spam or bulk messaging', detail: 'Valentines are personal — mass-sending defeats the purpose' },
                                    { label: 'Impersonation', detail: 'Don\'t pretend to be someone you\'re not' },
                                    { label: 'Malicious links or code', detail: 'Don\'t embed harmful content in your valentines' },
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
                            <p>
                                We reserve the right to remove any content that violates these
                                guidelines and to suspend accounts responsible for repeated violations.
                            </p>
                        </div>
                    </Section>

                    <Divider />

                    <Section>
                        <SectionHeading icon={Clock} title="Valentine Lifecycle" />
                        <div className="space-y-4 text-[15px] leading-relaxed text-rose-100/60 sm:text-base">
                            <div className="rounded-2xl border border-rose-500/15 bg-gradient-to-br from-rose-500/[0.04] to-pink-500/[0.02] p-6 sm:p-8">
                                <p
                                    className="mb-3 text-lg text-rose-100/90 sm:text-xl"
                                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
                                >
                                    Every valentine has a 90-day lifespan.
                                </p>
                                <p className="text-rose-100/60">
                                    After 90 days, your valentine and all associated data — content,
                                    media, statistics — are permanently and automatically deleted. This
                                    cannot be undone.
                                </p>
                            </div>
                            <p>
                                While your valentine is live, anyone with the unique link can view it.
                                Engagement statistics (views, opens) are available on your private
                                stats dashboard. Only you can see these stats.
                            </p>
                        </div>
                    </Section>

                    <Divider />

                    <Section>
                        <SectionHeading icon={AlertTriangle} title="Limitations" />
                        <div className="space-y-4 text-[15px] leading-relaxed text-rose-100/60 sm:text-base">
                            <p>
                                Amoriie is provided "as is." While we strive for reliability, we can't
                                guarantee uninterrupted service or that your valentine will produce
                                the romantic outcome you're hoping for.
                            </p>
                            <p>
                                We are not responsible for how recipients respond to your valentines.
                                We provide the medium — the message and its reception are between
                                you and your special someone.
                            </p>
                            <p>
                                Our total liability to you for any claims arising from your use of
                                Amoriie is limited to the amount you've paid us — which, since the
                                service is free, keeps things simple.
                            </p>
                        </div>
                    </Section>

                    <Divider />

                    <Section>
                        <SectionHeading icon={Gavel} title="Termination & Enforcement" />
                        <div className="space-y-4 text-[15px] leading-relaxed text-rose-100/60 sm:text-base">
                            <p>
                                We may suspend or terminate access to Amoriie if you violate these
                                terms. You can also delete your account at any time — no questions
                                asked.
                            </p>
                            <p>
                                If we need to remove your content due to a violation, we'll try to
                                notify you first — unless the content poses an immediate risk to
                                others.
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
                                Changes to These Terms
                            </h2>
                            <p>
                                We may update these terms from time to time. Continued use of Amoriie
                                after changes constitutes acceptance of the updated terms. For
                                significant changes, we'll provide clear notice.
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
                                Governing Law
                            </h2>
                            <p>
                                These terms are governed by applicable law. Any disputes will be
                                resolved through good-faith negotiation first — because that's the
                                Amoriie way.
                            </p>
                        </div>
                    </Section>

                    <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/5 pt-10 sm:mt-20 sm:flex-row sm:justify-between sm:pt-12">
                        <Link
                            href="/privacy"
                            className="text-sm text-rose-100/50 transition-colors hover:text-rose-100"
                        >
                            Read our Privacy Policy →
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
