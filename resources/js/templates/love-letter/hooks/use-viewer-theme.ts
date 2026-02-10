import { useMemo } from 'react';

import type { LoveLetterThemeId, LoveLetterThemeCustomization, AnimationSpeed } from '../schema';
import { getTheme } from '../themes';
import type { LoveLetterViewerTheme } from '../viewer/types';

const GOOGLE_FONTS_BASE = 'https://fonts.googleapis.com/css2?family=';

function getFontUrl(fontName: string): string {
    const encodedName = fontName.replace(/\s+/g, '+');
    return `${GOOGLE_FONTS_BASE}${encodedName}:wght@400;500;600;700&display=swap`;
}

function isColorDark(hexColor: string): boolean {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
}

function getSpeedMultiplier(speed: AnimationSpeed, multipliers: { slow: number; normal: number; fast: number }): number {
    return multipliers[speed] ?? 1;
}

export function useViewerTheme(
    themeId: LoveLetterThemeId,
    customization: LoveLetterThemeCustomization
): LoveLetterViewerTheme {
    return useMemo(() => {
        const config = getTheme(themeId);

        return {
            config,
            customization,
            backgroundColor: config.palette.background,
            paperColor: customization.paper_color,
            inkColor: customization.ink_color,
            sealColor: customization.seal_color,
            accentColor: config.palette.accent[0],
            headingFont: customization.heading_font,
            bodyFont: customization.body_font,
            signatureFont: customization.signature_font || config.typography.signature_fonts[0],
            headingFontUrl: getFontUrl(customization.heading_font),
            bodyFontUrl: getFontUrl(customization.body_font),
            signatureFontUrl: getFontUrl(customization.signature_font || config.typography.signature_fonts[0]),
            isDarkBackground: isColorDark(config.palette.background),
            speedMultiplier: getSpeedMultiplier(customization.animation_speed, config.animations.speed_multipliers),
        };
    }, [
        themeId,
        customization.paper_color,
        customization.ink_color,
        customization.seal_color,
        customization.heading_font,
        customization.body_font,
        customization.signature_font,
        customization.animation_speed,
    ]);
}
