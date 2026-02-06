import { useCallback, useEffect, useRef } from 'react';

export type ViewerSection = 'intro' | 'memories' | 'final' | 'celebration' | 'declined';

export type UseValentineProgressOptions = {
    slug: string;
    enabled?: boolean;
};

export type UseValentineProgressReturn = {
    trackProgress: (section: ViewerSection, memoryIndex?: number) => void;
    trackResponse: (response: 'yes' | 'no') => Promise<void>;
};

function getFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('fingerprint', 2, 2);
    }

    const data = [
        navigator.userAgent,
        navigator.language,
        screen.width,
        screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL(),
    ].join('|');

    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return Math.abs(hash).toString(36);
}

export function useValentineProgress(options: UseValentineProgressOptions): UseValentineProgressReturn {
    const { slug, enabled = true } = options;

    const hasRecordedView = useRef(false);
    const fingerprint = useRef<string | null>(null);

    useEffect(() => {
        if (!enabled || hasRecordedView.current) return;

        fingerprint.current = getFingerprint();

        fetch(`/api/valentines/${slug}/view`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
            },
            body: JSON.stringify({
                fingerprint: fingerprint.current,
            }),
        }).catch(() => {
            /** Silently fail - analytics are not critical */
        });

        hasRecordedView.current = true;
    }, [slug, enabled]);

    const trackProgress = useCallback((section: ViewerSection, memoryIndex?: number) => {
        if (!enabled) return;

        fetch(`/api/valentines/${slug}/progress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
            },
            body: JSON.stringify({
                section,
                memory_index: memoryIndex,
                fingerprint: fingerprint.current,
            }),
        }).catch(() => {
            /** Silently fail */
        });
    }, [slug, enabled]);

    const trackResponse = useCallback(async (response: 'yes' | 'no') => {
        if (!enabled) return;

        try {
            await fetch(`/api/valentines/${slug}/respond`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    response,
                    fingerprint: fingerprint.current,
                }),
            });
        } catch {
            /** Silently fail */
        }
    }, [slug, enabled]);

    return {
        trackProgress,
        trackResponse,
    };
}
