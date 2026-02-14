import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Check, Loader2, Image, Music, RefreshCw } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import type { UploadItem } from '@/types/publish';

type UploadProgressModalProps = {
    isOpen: boolean;
    items: UploadItem[];
    hasMedia?: boolean;
    onRetry?: () => void;
    onClose: () => void;
};

function getItemIcon(type: UploadItem['type']) {
    return type === 'image' ? <Image className="size-4" /> : <Music className="size-4" />;
}

function getStatusIcon(status: UploadItem['status'], isProcessing: boolean) {
    if (isProcessing) {
        return <Loader2 className="size-4 animate-spin text-amber-400" />;
    }

    switch (status) {
        case 'pending':
            return <div className="size-4 rounded-full border-2 border-rose-100/30" />;
        case 'uploading':
            return <Loader2 className="size-4 animate-spin text-rose-400" />;
        case 'complete':
            return <Check className="size-4 text-emerald-400" />;
        case 'error':
            return <AlertCircle className="size-4 text-rose-400" />;
    }
}

type UploadProgressContentProps = {
    items: UploadItem[];
    hasMedia: boolean;
    hasErrors: boolean;
    isComplete: boolean;
    isProcessing: boolean;
    totalProgress: number;
    onRetry?: () => void;
    isMobile: boolean;
};

function UploadProgressHeader({ isComplete, hasErrors, hasMedia, isProcessing, isMobile }: { isComplete: boolean; hasErrors: boolean; hasMedia: boolean; isProcessing: boolean; isMobile: boolean }) {
    const HeaderWrapper = isMobile ? SheetHeader : DialogHeader;
    const Title = isMobile ? SheetTitle : DialogTitle;

    function getTitle() {
        if (isComplete) return hasMedia ? 'Upload Complete!' : 'Valentine Created!';
        if (hasErrors) return hasMedia ? 'Upload Failed' : 'Something Went Wrong';
        if (isProcessing) return 'Processing Your Valentine';
        if (!hasMedia) return 'Creating Your Valentine';
        return 'Uploading Your Valentine';
    }

    function getSubtitle() {
        if (isProcessing) return 'Almost there! Preparing your valentine...';
        if (!hasMedia) return 'Hang tight while we prepare your valentine...';
        return 'Please wait while we upload your photos and music...';
    }

    return (
        <HeaderWrapper className="mb-6 p-0">
            <Title className="text-center text-rose-50">{getTitle()}</Title>
            {!isComplete && !hasErrors && (
                <p className="text-center text-sm text-rose-100/60">{getSubtitle()}</p>
            )}
        </HeaderWrapper>
    );
}

function UploadProgressContent({
    items,
    hasMedia,
    hasErrors,
    isComplete,
    isProcessing,
    totalProgress,
    onRetry,
    isMobile,
}: UploadProgressContentProps) {
    return (
        <>
            <UploadProgressHeader isComplete={isComplete} hasErrors={hasErrors} hasMedia={hasMedia} isProcessing={isProcessing} isMobile={isMobile} />

            <div className="mb-6 space-y-4">
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                        className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${totalProgress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                <p className="text-center text-sm text-rose-100/60">{totalProgress}% complete</p>
            </div>

            <div className={cn(
                'space-y-3 overflow-y-auto scrollbar-minimal',
                isMobile ? 'max-h-[60vh]' : 'max-h-[50vh]'
            )}>
                <AnimatePresence>
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                'flex items-center gap-3 rounded-xl border p-3',
                                item.status === 'error'
                                    ? 'border-rose-500/30 bg-rose-500/10'
                                    : item.status === 'complete'
                                      ? 'border-emerald-500/30 bg-emerald-500/10'
                                      : item.status === 'uploading' && item.progress >= 100
                                        ? 'border-amber-500/30 bg-amber-500/10'
                                        : 'border-white/10 bg-white/[0.02]'
                            )}
                        >
                            <div className="text-rose-100/60">{getItemIcon(item.type)}</div>

                            <div className="flex-1 min-w-0">
                                <p className="truncate text-sm text-rose-50">{item.name}</p>
                                {item.status === 'uploading' && item.progress < 100 && (
                                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.progress}%` }}
                                            transition={{ duration: 0.3, ease: 'easeOut' }}
                                        />
                                    </div>
                                )}
                                {item.status === 'uploading' && item.progress >= 100 && (
                                    <p className="mt-1 text-xs text-amber-400/80">Processing...</p>
                                )}
                                {item.error && (
                                    <p className="mt-1 text-xs text-rose-400">{item.error}</p>
                                )}
                            </div>

                            <div className="flex-shrink-0">{getStatusIcon(item.status, item.status === 'uploading' && item.progress >= 100)}</div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {hasErrors && onRetry && (
                <div className="mt-6 flex justify-center">
                    <Button
                        onClick={onRetry}
                        className="min-h-[48px] gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-6 shadow-lg shadow-rose-500/25"
                    >
                        <RefreshCw className="size-4" />
                        Try Again
                    </Button>
                </div>
            )}
        </>
    );
}

export function UploadProgressModal({
    isOpen,
    items,
    hasMedia = true,
    onRetry,
    onClose,
}: UploadProgressModalProps) {
    const isMobile = useIsMobile();
    const hasErrors = items.some((item) => item.status === 'error');
    const isComplete = items.length > 0 && items.every((item) => item.status === 'complete');
    const isProcessing = items.length > 0 &&
        items.every((item) => item.progress >= 100) &&
        items.some((item) => item.status === 'uploading');
    const totalProgress =
        items.length > 0
            ? Math.round(items.reduce((acc, item) => acc + item.progress, 0) / items.length)
            : 0;

    const contentProps = {
        items,
        hasMedia,
        hasErrors,
        isComplete,
        isProcessing,
        totalProgress,
        onRetry,
        isMobile,
    };

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <SheetContent
                    side="bottom"
                    className="rounded-t-3xl border-white/10 bg-[#0c0607] px-6 pb-8 pt-6"
                >
                    <UploadProgressContent {...contentProps} />
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className={cn(
                    'max-w-md rounded-2xl border border-white/10',
                    'bg-[#0c0607] p-6',
                    '[&>button]:top-4 [&>button]:right-4 [&>button]:text-white/50 [&>button]:hover:text-white/80'
                )}
            >
                <UploadProgressContent {...contentProps} />
            </DialogContent>
        </Dialog>
    );
}
