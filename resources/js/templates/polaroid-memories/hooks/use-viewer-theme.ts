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

export function useViewerTheme(theme: PolaroidTheme): ViewerTheme {
    return useMemo(() => {
        const background = getBackgroundById(theme.background) ?? POLAROID_BACKGROUNDS[0];
        const polaroidStyle = getPolaroidStyleById(theme.polaroid_style) ?? POLAROID_STYLES[0];
        const font = getFontById(theme.handwriting_font) ?? HANDWRITING_FONTS[0];

        return {
            backgroundClass: background.cssClass,
            fontFamily: font.fontFamily,
            fontUrl: font.googleFontUrl,
            polaroidBorderColor: polaroidStyle.borderColor,
            polaroidShadowClass: polaroidStyle.shadowClass,
            polaroidTextureClass: polaroidStyle.textureClass,
            isDarkBackground: DARK_BACKGROUNDS.includes(background.id),
        };
    }, [theme.background, theme.polaroid_style, theme.handwriting_font]);
}
