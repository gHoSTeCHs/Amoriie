import { useEffect, useState } from 'react';

export type UseFontPreloadOptions = {
    fontUrl: string | null;
    fontFamily: string;
    timeout?: number;
};

export type UseFontPreloadReturn = {
    isLoaded: boolean;
    loadTime: number | null;
    timedOut: boolean;
};

export function useFontPreload(options: UseFontPreloadOptions): UseFontPreloadReturn {
    const { fontUrl, fontFamily, timeout = 3000 } = options;

    const [isLoaded, setIsLoaded] = useState(!fontUrl);
    const [loadTime, setLoadTime] = useState<number | null>(null);
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        if (!fontUrl) {
            return;
        }

        const startTime = performance.now();
        let didTimeout = false;

        const linkId = `font-preload-${fontFamily.replace(/[^a-z0-9]/gi, '-')}`;
        let link = document.getElementById(linkId) as HTMLLinkElement | null;

        if (!link) {
            link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = fontUrl;
            document.head.appendChild(link);
        }

        const baseFontFamily = fontFamily.replace(/['"]/g, '').split(',')[0].trim();

        const checkFont = async () => {
            try {
                const fontCheck = new FontFace(baseFontFamily, `local('${baseFontFamily}')`);
                await Promise.race([
                    document.fonts.load(`16px ${baseFontFamily}`),
                    fontCheck.load().catch(() => null),
                ]);

                if (!didTimeout) {
                    setLoadTime(performance.now() - startTime);
                    setIsLoaded(true);
                }
            } catch {
                if (!didTimeout) {
                    setIsLoaded(true);
                }
            }
        };

        const timeoutId = setTimeout(() => {
            didTimeout = true;
            setTimedOut(true);
            setIsLoaded(true);
        }, timeout);

        checkFont();

        return () => {
            clearTimeout(timeoutId);
        };
    }, [fontUrl, fontFamily, timeout]);

    return { isLoaded, loadTime, timedOut };
}
