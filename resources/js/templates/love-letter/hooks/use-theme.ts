import { useCallback, useMemo } from 'react';
import type { LoveLetterThemeId, SignatureStyle, AnimationSpeed } from '../schema';
import { getTheme, type LetterTheme } from '../themes';
import { useLoveLetterCustomizations } from './use-love-letter-customizations';

export type PaletteType = 'paper' | 'ink' | 'seal' | 'accent';
export type FontType = 'heading' | 'body' | 'signature';

export function useTheme() {
    const { customizations, setThemeId, setCustomization } = useLoveLetterCustomizations();

    const selectedTheme = useMemo((): LetterTheme => {
        return getTheme(customizations.theme_id);
    }, [customizations.theme_id]);

    const changeTheme = useCallback(
        (themeId: LoveLetterThemeId) => {
            const newTheme = getTheme(themeId);

            setThemeId(themeId);

            setCustomization({
                paper_color: newTheme.palette.paper[0],
                ink_color: newTheme.palette.ink[0],
                seal_color: newTheme.palette.seal[0],
                heading_font: newTheme.typography.heading_fonts[0],
                body_font: newTheme.typography.body_fonts[0],
                signature_font: newTheme.typography.signature_fonts[0],
                sounds_enabled: newTheme.sounds.enabled_by_default,
                show_borders: newTheme.decorations.borders !== 'none',
                show_drop_cap: newTheme.decorations.drop_cap,
                show_flourishes: newTheme.decorations.flourishes,
            });
        },
        [setThemeId, setCustomization]
    );

    const getAvailableColors = useCallback(
        (type: PaletteType): string[] => {
            return selectedTheme.palette[type];
        },
        [selectedTheme]
    );

    const getAvailableFonts = useCallback(
        (type: FontType): string[] => {
            switch (type) {
                case 'heading':
                    return selectedTheme.typography.heading_fonts;
                case 'body':
                    return selectedTheme.typography.body_fonts;
                case 'signature':
                    return selectedTheme.typography.signature_fonts;
            }
        },
        [selectedTheme]
    );

    const setPaperColor = useCallback(
        (color: string) => {
            setCustomization({ paper_color: color });
        },
        [setCustomization]
    );

    const setInkColor = useCallback(
        (color: string) => {
            setCustomization({ ink_color: color });
        },
        [setCustomization]
    );

    const setSealColor = useCallback(
        (color: string) => {
            setCustomization({ seal_color: color });
        },
        [setCustomization]
    );

    const setHeadingFont = useCallback(
        (font: string) => {
            setCustomization({ heading_font: font });
        },
        [setCustomization]
    );

    const setBodyFont = useCallback(
        (font: string) => {
            setCustomization({ body_font: font });
        },
        [setCustomization]
    );

    const setSignatureFont = useCallback(
        (font: string) => {
            setCustomization({ signature_font: font });
        },
        [setCustomization]
    );

    const setSignatureStyle = useCallback(
        (style: SignatureStyle) => {
            setCustomization({ signature_style: style });
        },
        [setCustomization]
    );

    const setAnimationSpeed = useCallback(
        (speed: AnimationSpeed) => {
            setCustomization({ animation_speed: speed });
        },
        [setCustomization]
    );

    const toggleSounds = useCallback(
        (enabled: boolean) => {
            setCustomization({ sounds_enabled: enabled });
        },
        [setCustomization]
    );

    const toggleBorders = useCallback(
        (show: boolean) => {
            setCustomization({ show_borders: show });
        },
        [setCustomization]
    );

    const toggleDropCap = useCallback(
        (show: boolean) => {
            setCustomization({ show_drop_cap: show });
        },
        [setCustomization]
    );

    const toggleFlourishes = useCallback(
        (show: boolean) => {
            setCustomization({ show_flourishes: show });
        },
        [setCustomization]
    );

    return {
        theme: selectedTheme,
        themeId: customizations.theme_id,
        themeCustomization: customizations.customization,

        changeTheme,
        getAvailableColors,
        getAvailableFonts,

        setPaperColor,
        setInkColor,
        setSealColor,
        setHeadingFont,
        setBodyFont,
        setSignatureFont,
        setSignatureStyle,
        setAnimationSpeed,
        toggleSounds,
        toggleBorders,
        toggleDropCap,
        toggleFlourishes,
    };
}
