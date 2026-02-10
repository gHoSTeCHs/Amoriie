import type { LetterTheme } from './index';

export const midnightCandlelightTheme: LetterTheme = {
    id: 'midnight-candlelight',
    name: 'Midnight Candlelight',
    description: 'Intimate warmth of a letter written by candlelight on a dark winter evening',
    preview_image: '/images/themes/love-letter/midnight-candlelight-preview.jpg',

    palette: {
        paper: ['#f5f0e1', '#efe8d5', '#e8dcc4', '#ddd0b3', '#d4c4a0'],
        ink: ['#2d1810', '#3d2418', '#4a2c1c', '#1a0f0a', '#5c3a28'],
        seal: ['#8b0000', '#a52a2a', '#722f37', '#660000', '#b22222'],
        accent: ['#d4af37', '#c9a227', '#b8960f', '#e5c158', '#f0d77b'],
        background: '#1a1210',
    },

    typography: {
        heading_fonts: ['Pinyon Script', 'Great Vibes'],
        body_fonts: ['Cormorant Garamond', 'Crimson Text'],
        signature_fonts: ['Homemade Apple', 'Dancing Script'],
    },

    textures: {
        paper: 'aged-parchment',
        background: 'dark-wood-desk',
        overlay: 'candlelight-glow',
    },

    animations: {
        envelope_open: 'flip-3d',
        text_reveal: 'ink-bleed',
        speed_multipliers: {
            slow: 1.5,
            normal: 1.0,
            fast: 0.6,
        },
    },

    ambient: {
        effects: ['candle-flicker', 'dust-particles'],
        particle_color: '#d4af37',
    },

    sounds: {
        enabled_by_default: true,
        envelope_open: '/sounds/love-letter/paper-slide.mp3',
        seal_break: '/sounds/love-letter/wax-seal-crack.mp3',
        text_reveal: '/sounds/love-letter/quill-writing.mp3',
        ambient: '/sounds/love-letter/fireplace-crackle.mp3',
    },

    decorations: {
        borders: 'ornate',
        drop_cap: true,
        drop_cap_style: 'illuminated',
        flourishes: true,
        watermark: undefined,
    },
};
