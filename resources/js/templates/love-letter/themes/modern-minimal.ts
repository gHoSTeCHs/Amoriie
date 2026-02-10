import type { LetterTheme } from './index';

export const modernMinimalTheme: LetterTheme = {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean contemporary design where the words speak for themselves',
    preview_image: '/images/themes/love-letter/modern-minimal-preview.jpg',

    palette: {
        paper: ['#ffffff', '#fafafa', '#f5f5f5', '#f0f0f0', '#ebebeb'],
        ink: ['#1a1a1a', '#2c2c2c', '#3d3d3d', '#0a0a0a', '#4d4d4d'],
        seal: ['#e63946', '#d62839', '#c5192d', '#f45b69', '#b01a2e'],
        accent: ['#e63946', '#2a9d8f', '#264653', '#e9c46a', '#f4a261'],
        background: '#ffffff',
    },

    typography: {
        heading_fonts: ['Playfair Display', 'Cormorant'],
        body_fonts: ['Inter', 'Source Sans Pro'],
        signature_fonts: ['Caveat', 'Nothing You Could Do'],
    },

    textures: {
        paper: 'crisp-white',
        background: 'pure-white',
        overlay: undefined,
    },

    animations: {
        envelope_open: 'slide-out',
        text_reveal: 'instant',
        speed_multipliers: {
            slow: 1.2,
            normal: 1.0,
            fast: 0.4,
        },
    },

    ambient: {
        effects: [],
        particle_color: undefined,
    },

    sounds: {
        enabled_by_default: false,
        envelope_open: '/sounds/love-letter/paper-slide.mp3',
        seal_break: undefined,
        text_reveal: undefined,
        ambient: undefined,
    },

    decorations: {
        borders: 'none',
        drop_cap: false,
        drop_cap_style: undefined,
        flourishes: false,
        watermark: undefined,
    },
};
