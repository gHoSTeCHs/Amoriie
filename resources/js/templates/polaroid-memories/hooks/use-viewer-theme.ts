import { useMemo } from 'react';

import type { ViewerTheme } from '@/types/viewer';
import {
    getBackgroundById,
    getFontById,
    getPolaroidStyleById,
    POLAROID_BACKGROUNDS,
    POLAROID_STYLES,
    HANDWRITING_FONTS,
} from '../palettes';
import type { PolaroidTheme } from '../schema';

const DARK_BACKGROUNDS = ['cork-board', 'midnight-blue'];

const DEFAULT_THEME: PolaroidTheme = {
    background: 'cork-board',
    polaroid_style: 'classic',
    handwriting_font: 'dancing-script',
};

export function useViewerTheme(theme?: Partial<PolaroidTheme> | null): ViewerTheme {
    const safeTheme = theme ?? DEFAULT_THEME;

    return useMemo(() => {
        const background = getBackgroundById(safeTheme.background ?? DEFAULT_THEME.background) ?? POLAROID_BACKGROUNDS[0];
        const polaroidStyle = getPolaroidStyleById(safeTheme.polaroid_style ?? DEFAULT_THEME.polaroid_style) ?? POLAROID_STYLES[0];
        const font = getFontById(safeTheme.handwriting_font ?? DEFAULT_THEME.handwriting_font) ?? HANDWRITING_FONTS[0];

        return {
            backgroundClass: background.cssClass,
            fontFamily: font.fontFamily,
            fontUrl: font.googleFontUrl,
            polaroidBorderColor: polaroidStyle.borderColor,
            polaroidShadowClass: polaroidStyle.shadowClass,
            polaroidTextureClass: polaroidStyle.textureClass,
            isDarkBackground: DARK_BACKGROUNDS.includes(background.id),
        };
    }, [safeTheme.background, safeTheme.polaroid_style, safeTheme.handwriting_font]);
}
