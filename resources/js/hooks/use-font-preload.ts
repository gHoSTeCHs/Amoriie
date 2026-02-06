import { useEffect, useState } from 'react';

export type UseFontPreloadOptions = {
    fontUrl: string | null;
    fontFamily: string;
    timeout?: number;
};

export type UseFontPreloadReturn = {
    isLoaded: boolean;
    error: Error | null;
};

export function useFontPreload(options: UseFontPreloadOptions): UseFontPreloadReturn {
    const { fontUrl, fontFamily, timeout = 3000 } = options;

    const [isLoaded, setIsLoaded] = useState(!fontUrl);
    const [error] = useState<Error | null>(null);

    useEffect(() => {
        if (!fontUrl) {
            return;
        }

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

                setIsLoaded(true);
            } catch {
                setIsLoaded(true);
            }
        };

        const timeoutId = setTimeout(() => {
            setIsLoaded(true);
        }, timeout);

        checkFont();

        return () => {
            clearTimeout(timeoutId);
        };
    }, [fontUrl, fontFamily, timeout]);

    return { isLoaded, error };
}
