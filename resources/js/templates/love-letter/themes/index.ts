import type { LoveLetterThemeId } from '../schema';

export type EnvelopeAnimation = 'flip-3d' | 'slide-out' | 'unfold' | 'petal-scatter' | 'ribbon-untie';

export type TextRevealAnimation = 'typewriter' | 'ink-bleed' | 'fade-lines' | 'instant';

export type AmbientEffect = 'candle-flicker' | 'dust-particles' | 'gold-sparkle' | 'floating-petals' | 'bokeh';

export type BorderStyle = 'ornate' | 'floral' | 'simple' | 'none';

export type DropCapStyle = 'illuminated' | 'simple' | 'floral';

export type LetterTheme = {
    id: LoveLetterThemeId;
    name: string;
    description: string;
    preview_image: string;

    palette: {
        paper: string[];
        ink: string[];
        seal: string[];
        accent: string[];
        background: string;
    };

    typography: {
        heading_fonts: string[];
        body_fonts: string[];
        signature_fonts: string[];
    };

    textures: {
        paper: string;
        background: string;
        overlay?: string;
    };

    animations: {
        envelope_open: EnvelopeAnimation;
        text_reveal: TextRevealAnimation;
        speed_multipliers: {
            slow: number;
            normal: number;
            fast: number;
        };
    };

    ambient: {
        effects: AmbientEffect[];
        particle_color?: string;
    };

    sounds: {
        enabled_by_default: boolean;
        envelope_open: string;
        seal_break?: string;
        text_reveal?: string;
        ambient?: string;
    };

    decorations: {
        borders: BorderStyle;
        drop_cap: boolean;
        drop_cap_style?: DropCapStyle;
        flourishes: boolean;
        watermark?: string;
    };
};

import { midnightCandlelightTheme } from './midnight-candlelight';
import { vintageTelegramTheme } from './vintage-telegram';
import { royalEleganceTheme } from './royal-elegance';
import { gardenRomanceTheme } from './garden-romance';
import { modernMinimalTheme } from './modern-minimal';
import { parisianCafeTheme } from './parisian-cafe';

const THEME_REGISTRY: Record<LoveLetterThemeId, LetterTheme> = {
    'midnight-candlelight': midnightCandlelightTheme,
    'vintage-telegram': vintageTelegramTheme,
    'royal-elegance': royalEleganceTheme,
    'garden-romance': gardenRomanceTheme,
    'modern-minimal': modernMinimalTheme,
    'parisian-cafe': parisianCafeTheme,
};

export function getTheme(id: LoveLetterThemeId): LetterTheme {
    return THEME_REGISTRY[id];
}

export function getAllThemes(): LetterTheme[] {
    return Object.values(THEME_REGISTRY);
}

export function getThemeIds(): LoveLetterThemeId[] {
    return Object.keys(THEME_REGISTRY) as LoveLetterThemeId[];
}

export function isValidThemeId(id: string): id is LoveLetterThemeId {
    return id in THEME_REGISTRY;
}

export type { LoveLetterThemeId };
