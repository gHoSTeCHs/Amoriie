import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Bookmark,
    Check,
    Copy,
    ExternalLink,
    Heart,
    PlusCircle,
    Share2,
} from 'lucide-react';
import { useState } from 'react';

import { FloatingHearts } from '@/components/shared/FloatingHearts';
import { Button } from '@/components/ui/button';
import { useShare } from '@/hooks/use-share';
import { cn } from '@/lib/utils';
import create from '@/routes/create';

type Props = {
    valentine?: {
        slug: string;
        recipient_name: string;
        public_url: string;
        stats_url: string;
    };
    config?: {
        expires_in_days: number;
    };
    error?: string;
};

function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}

type SuccessContentProps = {
    valentine: NonNullable<Props['valentine']>;
    expiresInDays: number;
};

function SuccessContent({ valentine, expiresInDays }: SuccessContentProps) {
    const {
        copyLink,
        shareViaWhatsApp,
        shareViaNative,
        canShareNative,
        isCopied,
    } = useShare();

    const [isStatsCopied, setIsStatsCopied] = useState(false);

    const copyStatsLink = async () => {
        try {
            await navigator.clipboard.writeText(valentine.stats_url);
            setIsStatsCopied(true);
            setTimeout(() => setIsStatsCopied(false), 2000);
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = valentine.stats_url;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setIsStatsCopied(true);
            setTimeout(() => setIsStatsCopied(false), 2000);
        }
    };

    return (
        <>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: 0.2,
                }}
                className="relative mb-5 sm:mb-6"
            >
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
                    className="absolute inset-0 -m-6 rounded-full bg-rose-500/25 blur-2xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 p-5 shadow-lg shadow-rose-500/30 sm:p-6"
                >
                    <Heart className="size-10 fill-white text-white sm:size-12" />
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6 px-2 text-center sm:mb-8"
            >
                <h1
                    className="mb-2 text-2xl text-white sm:text-3xl"
                    style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 500,
                    }}
                >
                    Your Valentine is Live!
                </h1>
                <p className="text-sm text-rose-100/60 sm:text-base">
                    Share this special link with{' '}
                    <span className="font-medium text-rose-200/80">
                        {valentine.recipient_name}
                    </span>
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-5 w-full max-w-md sm:mb-6"
            >
                <div className="rounded-2xl border border-rose-500/15 bg-gradient-to-b from-rose-500/[0.04] to-white/[0.01] p-3 sm:p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs text-rose-200/50 sm:mb-3">
                        <ExternalLink className="size-3.5" />
                        Your special link
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-black/20 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
                        <span className="min-w-0 flex-1 truncate font-mono text-xs text-rose-200 sm:text-sm">
                            {valentine.public_url}
                        </span>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex w-full max-w-md flex-col gap-2.5 sm:gap-3"
            >
                <Button
                    onClick={() => copyLink(valentine.public_url)}
                    className={cn(
                        'min-h-[48px] w-full rounded-full text-sm font-semibold sm:min-h-[56px] sm:text-base',
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
                            <Check className="mr-2 size-4 sm:size-5" />
                            Copied to Clipboard!
                        </>
                    ) : (
                        <>
                            <Copy className="mr-2 size-4 sm:size-5" />
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
                    className="min-h-[48px] w-full gap-2 rounded-full bg-[#25D366] text-sm font-semibold text-white shadow-lg shadow-[#25D366]/25 hover:bg-[#22c35e] hover:shadow-xl sm:min-h-[56px] sm:text-base"
                >
                    <WhatsAppIcon className="size-4 sm:size-5" />
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
                        className="min-h-[48px] w-full gap-2 rounded-full border-white/20 bg-white/[0.02] text-sm font-semibold text-rose-50 hover:bg-white/[0.05] sm:min-h-[56px] sm:text-base"
                    >
                        <Share2 className="size-4 sm:size-5" />
                        More Sharing Options
                    </Button>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-6 flex w-full max-w-md flex-col gap-2.5 sm:mt-8 sm:gap-3"
            >
                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-xs text-rose-100/40">
                        More options
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="rounded-2xl border border-amber-400/15 bg-gradient-to-b from-amber-500/[0.03] to-transparent p-3 sm:p-4">
                    <div className="mb-2 flex items-center justify-between sm:mb-3">
                        <div className="flex items-center gap-2 text-xs text-amber-200/60">
                            <BarChart3 className="size-3.5" />
                            Stats dashboard
                        </div>
                        <div className="flex items-center gap-1">
                            <Bookmark className="size-3 text-amber-400/40" />
                            <span className="text-[10px] uppercase tracking-wide text-amber-200/35">
                                Save this
                            </span>
                        </div>
                    </div>

                    <div className="mb-3 flex items-center gap-2 rounded-xl bg-black/20 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
                        <span className="min-w-0 flex-1 truncate font-mono text-xs text-amber-100/70 sm:text-sm">
                            {valentine.stats_url}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={copyStatsLink}
                            className={cn(
                                'flex min-h-[40px] flex-1 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200',
                                isStatsCopied
                                    ? 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                                    : 'border border-amber-400/20 bg-amber-500/10 text-amber-200 hover:border-amber-400/30 hover:bg-amber-500/20',
                            )}
                        >
                            {isStatsCopied ? (
                                <>
                                    <Check className="size-3.5" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="size-3.5" />
                                    Copy Link
                                </>
                            )}
                        </button>
                        <Link
                            href={valentine.stats_url}
                            className="flex min-h-[40px] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-sm text-rose-100/50 transition-colors hover:bg-white/[0.04] hover:text-rose-100/70"
                        >
                            <ExternalLink className="size-3.5" />
                            View
                        </Link>
                    </div>

                    <p className="mt-2.5 text-center text-[11px] text-amber-200/30">
                        This link can't be recovered — save it somewhere safe
                    </p>
                </div>

                <Link
                    href={create.index.url()}
                    className={cn(
                        'flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3',
                        'text-sm text-rose-100/70 transition-colors',
                        'hover:border-rose-500/30 hover:bg-white/[0.04] hover:text-rose-100',
                    )}
                >
                    <PlusCircle className="size-4" />
                    Create Another Valentine
                </Link>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-6 text-center text-xs text-rose-100/40 sm:mt-8"
            >
                Your valentine will stay live for {expiresInDays} days
            </motion.p>
        </>
    );
}

function ErrorContent() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-2 text-center"
        >
            <div className="mb-5 inline-flex items-center justify-center rounded-full bg-rose-500/20 p-5 sm:mb-6 sm:p-6">
                <Heart className="size-10 text-rose-400 sm:size-12" />
            </div>

            <h1
                className="mb-2 text-xl text-white sm:text-2xl"
                style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 500,
                }}
            >
                Valentine Not Found
            </h1>
            <p className="mb-6 text-sm text-rose-100/60 sm:mb-8 sm:text-base">
                This valentine doesn't exist or may have been removed.
            </p>

            <Link
                href={create.index.url()}
                className={cn(
                    'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 py-3 sm:px-8 sm:py-4',
                    'bg-gradient-to-r from-rose-500 to-pink-500',
                    'text-sm font-semibold text-white sm:text-base',
                    'shadow-lg shadow-rose-500/25',
                    'transition-all hover:shadow-xl hover:shadow-rose-500/30',
                )}
            >
                <PlusCircle className="size-4 sm:size-5" />
                Create a Valentine
            </Link>
        </motion.div>
    );
}

export default function Success({ valentine, config, error }: Props) {
    const expiresInDays = config?.expires_in_days ?? 90;

    return (
        <>
            <Head title="Valentine Published! — Amoriie">
                <meta name="description" content="Your valentine has been published and is ready to share. Send the link to your special someone." />
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

            <div className="relative flex min-h-dvh flex-col items-center overflow-hidden bg-[#0c0607] px-4 pt-20 pb-8 sm:justify-center sm:px-6 sm:pt-24 sm:pb-12">
                <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 50% 25%, rgba(190,18,60,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(251,113,133,0.08) 0%, transparent 40%)',
                    }}
                />

                <FloatingHearts count={15} />

                <header className="fixed top-0 right-0 left-0 z-20 border-b border-white/5 bg-[#0c0607]/80 backdrop-blur-sm">
                    <nav className="mx-auto flex max-w-4xl items-center justify-center px-4 py-3 sm:px-6 sm:py-4">
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

                <main className="relative z-10 flex w-full max-w-md flex-col items-center">
                    {valentine && !error ? (
                        <SuccessContent
                            valentine={valentine}
                            expiresInDays={expiresInDays}
                        />
                    ) : (
                        <ErrorContent />
                    )}
                </main>
            </div>
        </>
    );
}
