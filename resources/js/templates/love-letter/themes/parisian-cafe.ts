import type { LetterTheme } from './index';

export const parisianCafeTheme: LetterTheme = {
    id: 'parisian-cafe',
    name: 'Parisian Café',
    description: 'Romantic afternoon in Paris, love notes over espresso',
    preview_image: '/images/themes/love-letter/parisian-cafe-preview.png',

    palette: {
        paper: ['#fdf5f0', '#f8ebe4', '#f3e1d8', '#eed7cc', '#e9cdc0'],
        ink: ['#2d2d2d', '#3d3d3d', '#4d4d4d', '#1d1d1d', '#5d5d5d'],
        seal: ['#c8a2c8', '#d8b2d8', '#b892b8', '#e8c2e8', '#a882a8'],
        accent: ['#c8a2c8', '#d4af37', '#e8c2e8', '#c9a227', '#a882a8'],
        background: '#2a2428',
    },

    typography: {
        heading_fonts: ['Parisienne', 'Great Vibes'],
        body_fonts: ['Lora', 'Merriweather'],
        signature_fonts: ['Allura', 'Alex Brush'],
    },

    textures: {
        paper: 'rose-tinted-paper',
        background: 'marble-cafe-table',
        overlay: 'soft-bokeh',
    },

    animations: {
        envelope_open: 'ribbon-untie',
        text_reveal: 'ink-bleed',
        speed_multipliers: {
            slow: 1.5,
            normal: 1.0,
            fast: 0.6,
        },
    },

    ambient: {
        effects: ['bokeh'],
        particle_color: '#ffd700',
    },

    sounds: {
        enabled_by_default: true,
        envelope_open: '/sounds/love-letter/ribbon-untie.mp3',
        seal_break: undefined,
        text_reveal: undefined,
        ambient: '/sounds/love-letter/cafe-ambiance.mp3',
    },

    decorations: {
        borders: 'simple',
        drop_cap: true,
        drop_cap_style: 'simple',
        flourishes: false,
        watermark: undefined,
    },
};
