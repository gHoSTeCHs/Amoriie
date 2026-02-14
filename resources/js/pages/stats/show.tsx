import { Head, Link, router } from '@inertiajs/react';
import create from '@/routes/create';
import { motion } from 'framer-motion';
import {
    Heart,
    HeartCrack,
    Copy,
    Check,
    ExternalLink,
    PlusCircle,
    Share2,
    Eye,
    Clock,
    TrendingUp,
    RefreshCw,
    Loader2,
} from 'lucide-react';
import { Fragment, useState } from 'react';

import { FloatingHearts } from '@/components/shared/FloatingHearts';
import { Button } from '@/components/ui/button';
import { useShare } from '@/hooks/use-share';
import { cn } from '@/lib/utils';

type ValentineStats = {
    view_count: number;
    unique_view_count: number;
    first_viewed_at: string | null;
    total_time_spent_seconds: number;
    last_section_reached: string | null;
    furthest_progress: number;
    completed: boolean;
    response: 'yes' | 'no' | null;
    responded_at: string | null;
};

type Props = {
    valentine: {
        id: string;
        slug: string;
        template_id: string;
        recipient_name: string;
        sender_name: string;
        public_url: string;
        stats: ValentineStats;
        created_at: string;
        expires_at: string | null;
        is_expired: boolean;
    };
};

function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}

type ResponseStatus = 'yes' | 'no' | 'waiting' | 'not_viewed';

function getResponseStatus(stats: ValentineStats): ResponseStatus {
    if (stats.response === 'yes') return 'yes';
    if (stats.response === 'no') return 'no';
    if (stats.view_count === 0) return 'not_viewed';
    return 'waiting';
}

type ResponseCardConfig = {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    bgClass: string;
    borderClass: string;
    iconBgClass: string;
    glowColor?: string;
};

function getResponseCardConfig(status: ResponseStatus): ResponseCardConfig {
    switch (status) {
        case 'yes':
            return {
                icon: <Heart className="size-8 fill-white text-white" />,
                title: 'They Said Yes!',
                subtitle: 'Your valentine accepted your love',
                bgClass: 'bg-gradient-to-br from-emerald-500/20 to-green-500/10',
                borderClass: 'border-emerald-500/30',
                iconBgClass: 'bg-gradient-to-br from-emerald-500 to-green-500 shadow-emerald-500/30',
                glowColor: 'rgba(16, 185, 129, 0.3)',
            };
        case 'no':
            return {
                icon: <HeartCrack className="size-8 text-white" />,
                title: 'They Declined',
                subtitle: "Sometimes it's not meant to be",
                bgClass: 'bg-gradient-to-br from-slate-500/20 to-slate-600/10',
                borderClass: 'border-slate-500/30',
                iconBgClass: 'bg-gradient-to-br from-slate-500 to-slate-600 shadow-slate-500/30',
            };
        case 'waiting':
            return {
                icon: <Clock className="size-8 text-white" />,
                title: 'Waiting for Response',
                subtitle: "They've viewed it, but haven't responded yet",
                bgClass: 'bg-gradient-to-br from-amber-500/20 to-orange-500/10',
                borderClass: 'border-amber-500/30',
                iconBgClass: 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/30',
            };
        case 'not_viewed':
            return {
                icon: <Eye className="size-8 text-white" />,
                title: 'Not Viewed Yet',
                subtitle: "They haven't opened your valentine yet",
                bgClass: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/10',
                borderClass: 'border-blue-500/30',
                iconBgClass: 'bg-gradient-to-br from-blue-500 to-indigo-500 shadow-blue-500/30',
            };
    }
}

function formatTimeSpent(seconds: number): string {
    if (seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(isoString: string): string {
    return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

function getSectionLabel(section: string | null): string {
    if (!section) return 'Not started';
    const labels: Record<string, string> = {
        intro: 'Introduction',
        memories: 'Memories',
        final: 'Final Message',
        celebration: 'Celebration',
        declined: 'Declined',
    };
    return labels[section] || section;
}

type JourneyStep = {
    label: string;
    completed: boolean;
};

function JourneyProgress({ stats }: { stats: ValentineStats }) {
    const steps: JourneyStep[] = [
        { label: 'Sent', completed: true },
        { label: 'Viewed', completed: stats.view_count > 0 },
        {
            label: 'Explored',
            completed:
                (stats.last_section_reached !== null &&
                    stats.last_section_reached !== 'intro') ||
                stats.furthest_progress >= 50,
        },
        { label: 'Responded', completed: stats.response !== null },
    ];

    return (
        <div className="flex w-full items-center px-2">
            {steps.map((step, i) => (
                <Fragment key={step.label}>
                    {i > 0 && (
                        <div
                            className={cn(
                                'h-px flex-1 transition-colors',
                                step.completed
                                    ? 'bg-rose-500/40'
                                    : 'bg-white/10',
                            )}
                        />
                    )}
                    <div className="flex flex-col items-center gap-1.5">
                        <div
                            className={cn(
                                'flex size-7 items-center justify-center rounded-full transition-colors',
                                step.completed
                                    ? 'border border-rose-500/40 bg-rose-500/20'
                                    : 'border border-white/10 bg-white/[0.03]',
                            )}
                        >
                            {step.completed ? (
                                <Check className="size-3 text-rose-300" />
                            ) : (
                                <span className="size-1.5 rounded-full bg-white/20" />
                            )}
                        </div>
                        <span
                            className={cn(
                                'text-[10px] tracking-wide',
                                step.completed
                                    ? 'text-rose-200/60'
                                    : 'text-white/25',
                            )}
                        >
                            {step.label}
                        </span>
                    </div>
                </Fragment>
            ))}
        </div>
    );
}

type StatCardProps = {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    subValue?: string;
    delay: number;
    accentColor?: string;
};

function StatCard({
    icon,
    label,
    value,
    subValue,
    delay,
    accentColor,
}: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-4"
        >
            {accentColor && (
                <div
                    className="absolute left-0 right-0 top-0 h-px"
                    style={{ background: accentColor }}
                />
            )}
            <div className="mb-2 flex items-center gap-2 text-rose-100/50">
                {icon}
                <span className="text-xs">{label}</span>
            </div>
            <div className="text-2xl font-semibold text-white">{value}</div>
            {subValue && (
                <div className="mt-1 text-xs text-rose-100/40">{subValue}</div>
            )}
        </motion.div>
    );
}

function StatsContent({ valentine }: Props) {
    const {
        copyLink,
        shareViaWhatsApp,
        shareViaNative,
        canShareNative,
        isCopied,
    } = useShare();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const responseStatus = getResponseStatus(valentine.stats);
    const cardConfig = getResponseCardConfig(responseStatus);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => setIsRefreshing(false),
        });
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 text-center"
            >
                <p
                    className="mb-1 text-xs uppercase tracking-[0.2em] text-rose-300/40"
                    style={{ fontFamily: "'Italiana', serif" }}
                >
                    Stats
                </p>
                <h1
                    className="mb-2 text-3xl text-white"
                    style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 500,
                    }}
                >
                    {valentine.recipient_name}
                </h1>
                <p className="text-sm text-rose-100/50">
                    Track how your valentine is doing
                </p>
                <div className="mx-auto mt-3 h-px w-12 bg-rose-500/20" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    delay: 0.3,
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                }}
                className={cn(
                    'mb-6 w-full max-w-md rounded-2xl border p-6',
                    cardConfig.bgClass,
                    cardConfig.borderClass,
                )}
            >
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                        {cardConfig.glowColor && (
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.3, 0.1, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                className="absolute inset-0 -m-4 rounded-full blur-2xl"
                                style={{
                                    backgroundColor: cardConfig.glowColor,
                                }}
                            />
                        )}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                delay: 0.4,
                                type: 'spring',
                                stiffness: 300,
                                damping: 20,
                            }}
                            className={cn(
                                'relative inline-flex items-center justify-center rounded-full p-4 shadow-lg',
                                cardConfig.iconBgClass,
                            )}
                        >
                            {responseStatus === 'yes' ? (
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                >
                                    {cardConfig.icon}
                                </motion.div>
                            ) : (
                                cardConfig.icon
                            )}
                        </motion.div>
                    </div>
                    <h2
                        className="mb-1 text-2xl text-white"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: 500,
                        }}
                    >
                        {cardConfig.title}
                    </h2>
                    <p className="text-sm text-rose-100/60">
                        {cardConfig.subtitle}
                    </p>
                    {valentine.stats.responded_at && (
                        <p className="mt-2 text-xs text-rose-100/40">
                            Responded{' '}
                            {formatDate(valentine.stats.responded_at)}
                        </p>
                    )}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mb-6 w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-5"
            >
                <p className="mb-4 text-center text-[10px] uppercase tracking-[0.15em] text-rose-100/30">
                    Journey
                </p>
                <JourneyProgress stats={valentine.stats} />
            </motion.div>

            <div className="mb-6 grid w-full max-w-md grid-cols-2 gap-3">
                <StatCard
                    icon={<Eye className="size-4" />}
                    label="Total Views"
                    value={valentine.stats.view_count}
                    subValue={`${valentine.stats.unique_view_count} unique`}
                    delay={0.5}
                    accentColor="rgba(96, 165, 250, 0.5)"
                />
                <StatCard
                    icon={<Clock className="size-4" />}
                    label="Time Spent"
                    value={formatTimeSpent(
                        valentine.stats.total_time_spent_seconds,
                    )}
                    subValue={
                        valentine.stats.first_viewed_at
                            ? `First viewed ${formatDate(valentine.stats.first_viewed_at)}`
                            : 'Not viewed yet'
                    }
                    delay={0.55}
                    accentColor="rgba(251, 191, 36, 0.5)"
                />
                <StatCard
                    icon={<TrendingUp className="size-4" />}
                    label="Progress"
                    value={getSectionLabel(
                        valentine.stats.last_section_reached,
                    )}
                    subValue={
                        valentine.stats.completed ? 'Completed' : 'In progress'
                    }
                    delay={0.6}
                    accentColor="rgba(251, 113, 133, 0.5)"
                />
                <StatCard
                    icon={<Heart className="size-4" />}
                    label="Response"
                    value={
                        valentine.stats.response
                            ? valentine.stats.response === 'yes'
                                ? 'Yes'
                                : 'No'
                            : 'Pending'
                    }
                    subValue={
                        valentine.stats.response
                            ? 'Final answer'
                            : 'Waiting...'
                    }
                    delay={0.65}
                    accentColor="rgba(52, 211, 153, 0.5)"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-6 w-full max-w-md"
            >
                <div className="rounded-2xl border border-rose-500/15 bg-gradient-to-b from-rose-500/[0.04] to-white/[0.01] p-4">
                    <div className="mb-3 flex items-center gap-2 text-xs text-rose-200/50">
                        <ExternalLink className="size-3.5" />
                        Share link
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-black/20 px-4 py-3">
                        <span className="flex-1 truncate font-mono text-sm text-rose-200">
                            {valentine.public_url}
                        </span>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
                className="flex w-full max-w-md flex-col gap-3"
            >
                <Button
                    onClick={() => copyLink(valentine.public_url)}
                    className={cn(
                        'min-h-[56px] w-full rounded-full text-base font-semibold',
                        'bg-gradient-to-r from-rose-500 to-pink-500',
                        'shadow-lg shadow-rose-500/25',
                        'transition-all duration-200',
                        'hover:shadow-xl hover:shadow-rose-500/30',
                        isCopied &&
                            'from-emerald-500 to-emerald-600 shadow-emerald-500/25',
                    )}
                >
                    {isCopied ? (
                        <>
                            <Check className="mr-2 size-5" />
                            Copied to Clipboard!
                        </>
                    ) : (
                        <>
                            <Copy className="mr-2 size-5" />
                            Copy Link
                        </>
                    )}
                </Button>

                <Button
                    onClick={() =>
                        shareViaWhatsApp({
                            url: valentine.public_url,
                            recipientName: valentine.recipient_name,
                        })
                    }
                    className="min-h-[56px] w-full gap-2 rounded-full bg-[#25D366] text-base font-semibold text-white shadow-lg shadow-[#25D366]/25 hover:bg-[#22c35e] hover:shadow-xl"
                >
                    <WhatsAppIcon className="size-5" />
                    Share via WhatsApp
                </Button>

                {canShareNative && (
                    <Button
                        onClick={() =>
                            shareViaNative({
                                url: valentine.public_url,
                                recipientName: valentine.recipient_name,
                            })
                        }
                        variant="outline"
                        className="min-h-[56px] w-full gap-2 rounded-full border-white/20 bg-white/[0.02] text-base font-semibold text-rose-50 hover:bg-white/[0.05]"
                    >
                        <Share2 className="size-5" />
                        More Sharing Options
                    </Button>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                className="mt-8 flex w-full max-w-md flex-col gap-3"
            >
                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-xs text-rose-100/40">Actions</span>
                    <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Link
                        href={valentine.public_url}
                        className={cn(
                            'flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3',
                            'text-sm text-rose-100/70 transition-colors',
                            'hover:border-rose-500/30 hover:bg-white/[0.04] hover:text-rose-100',
                        )}
                    >
                        <ExternalLink className="size-4" />
                        View Valentine
                    </Link>

                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className={cn(
                            'flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3',
                            'text-sm text-rose-100/70 transition-colors',
                            'hover:border-rose-500/30 hover:bg-white/[0.04] hover:text-rose-100',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                        )}
                    >
                        {isRefreshing ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <RefreshCw className="size-4" />
                        )}
                        Refresh Stats
                    </button>
                </div>

                <Link
                    href={create.index.url()}
                    className={cn(
                        'flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3',
                        'text-sm text-rose-100/70 transition-colors',
                        'hover:border-rose-500/30 hover:bg-white/[0.04] hover:text-rose-100',
                    )}
                >
                    <PlusCircle className="size-4" />
                    Create Another Valentine
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.95 }}
                className="mt-8 text-center"
            >
                {valentine.is_expired ? (
                    <p className="text-xs text-rose-400/60">
                        This valentine has expired
                    </p>
                ) : valentine.expires_at ? (
                    <p className="text-xs text-rose-100/40">
                        Expires {formatDate(valentine.expires_at)}
                    </p>
                ) : null}
                <p className="mt-1 text-xs text-rose-100/30">
                    Created {formatDate(valentine.created_at)} by{' '}
                    {valentine.sender_name}
                </p>
            </motion.div>
        </>
    );
}

export default function StatsShow({ valentine }: Props) {
    return (
        <>
            <Head title={`Stats for ${valentine.recipient_name} — Amoriie`}>
                <meta name="description" content="Track your valentine's journey — see views, engagement, and your recipient's response." />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Italiana&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0c0607] px-6 py-12">
                <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 50% 25%, rgba(190,18,60,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(251,113,133,0.08) 0%, transparent 40%)',
                    }}
                />

                <FloatingHearts count={15} />

                <header className="absolute left-0 right-0 top-0 z-10 border-b border-white/5 bg-[#0c0607]/80 backdrop-blur-sm">
                    <nav className="mx-auto flex max-w-4xl items-center justify-center px-6 py-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Heart className="size-5 fill-rose-500 text-rose-500" />
                            <span
                                className="text-lg tracking-wide text-white"
                                style={{ fontFamily: "'Italiana', serif" }}
                            >
                                Amoriie
                            </span>
                        </Link>
                    </nav>
                </header>

                <main className="relative z-10 flex flex-col items-center pt-16">
                    <StatsContent valentine={valentine} />
                </main>
            </div>
        </>
    );
}
