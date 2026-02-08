import { useCallback, useState } from 'react';

type ShareData = {
    url: string;
    recipientName: string;
    title?: string;
};

type UseShareReturn = {
    copyLink: (url: string) => Promise<boolean>;
    shareViaWhatsApp: (data: ShareData) => void;
    shareViaNative: (data: ShareData) => Promise<boolean>;
    canShareNative: boolean;
    isCopied: boolean;
};

const COPY_FEEDBACK_DURATION = 2000;

export function useShare(): UseShareReturn {
    const [isCopied, setIsCopied] = useState(false);

    const canShareNative =
        typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function';

    const copyLink = useCallback(async (url: string): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), COPY_FEEDBACK_DURATION);
            return true;
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = url;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), COPY_FEEDBACK_DURATION);
                return true;
            } catch {
                return false;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    }, []);

    const shareViaWhatsApp = useCallback((data: ShareData) => {
        const message = `💕 I made something special for ${data.recipientName}!\n\n${data.url}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }, []);

    const shareViaNative = useCallback(
        async (data: ShareData): Promise<boolean> => {
            if (!canShareNative) {
                return false;
            }

            try {
                await navigator.share({
                    title: data.title || `A Valentine for ${data.recipientName}`,
                    text: `💕 I made something special for ${data.recipientName}!`,
                    url: data.url,
                });
                return true;
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    return false;
                }
                return false;
            }
        },
        [canShareNative]
    );

    return {
        copyLink,
        shareViaWhatsApp,
        shareViaNative,
        canShareNative,
        isCopied,
    };
}
