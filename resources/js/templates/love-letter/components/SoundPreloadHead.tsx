import { Head } from '@inertiajs/react';

import { getThemeSoundUrls } from '../lib/sound-preloader';
import type { LoveLetterThemeId } from '../schema';

interface SoundPreloadHeadProps {
    themeId: LoveLetterThemeId;
    enabled: boolean;
}

/**
 * Renders <link rel="preload"> tags for theme sounds via Inertia Head.
 * Browser starts fetching sounds before React fully loads the viewer.
 */
export function SoundPreloadHead({ themeId, enabled }: SoundPreloadHeadProps) {
    if (!enabled) {
        return null;
    }

    const sounds = getThemeSoundUrls(themeId);

    return (
        <Head>
            {sounds.map(({ url, priority }) => (
                <link
                    key={url}
                    rel="preload"
                    as="audio"
                    href={url}
                    {...(priority === 'critical' ? { fetchPriority: 'high' } : {})}
                />
            ))}
        </Head>
    );
}
