import { getTheme, type LoveLetterThemeId } from '../themes';

type SoundPriority = 'critical' | 'high' | 'normal';

interface PreloadableSound {
    url: string;
    priority: SoundPriority;
}

/**
 * Returns sound URLs for a theme in priority order.
 * Critical sounds (seal_break) load first, then high priority (envelope_open), then normal.
 */
export function getThemeSoundUrls(themeId: LoveLetterThemeId): PreloadableSound[] {
    const theme = getTheme(themeId);
    const sounds: PreloadableSound[] = [];

    if (theme.sounds.seal_break) {
        sounds.push({ url: theme.sounds.seal_break, priority: 'critical' });
    }

    return sounds;
}
