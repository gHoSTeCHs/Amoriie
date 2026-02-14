import type { LetterTheme } from './index';

export const royalEleganceTheme: LetterTheme = {
    id: 'royal-elegance',
    name: 'Royal Elegance',
    description: 'Luxurious grandeur fit for royalty, sealed with ceremony',
    preview_image: '/images/themes/love-letter/royal-elegance-preview.png',

    palette: {
        paper: ['#fffef5', '#f8f6eb', '#f0ede0', '#e8e4d5', '#dfd9c8'],
        ink: ['#1a1040', '#2d1b69', '#3d2485', '#0f0828', '#4a2ea0'],
        seal: ['#c9a227', '#d4af37', '#b8960f', '#e5c158', '#a08020'],
        accent: ['#800020', '#9b1b30', '#660018', '#b02040', '#d4af37'],
        background: '#1a1025',
    },

    typography: {
        heading_fonts: ['Cinzel Decorative', 'Playfair Display'],
        body_fonts: ['Cormorant Garamond', 'EB Garamond'],
        signature_fonts: ['Great Vibes', 'Allura'],
    },

    textures: {
        paper: 'heavy-ivory-stock',
        background: 'velvet-purple',
        overlay: 'gold-shimmer',
    },

    animations: {
        envelope_open: 'unfold',
        text_reveal: 'fade-lines',
        speed_multipliers: {
            slow: 1.6,
            normal: 1.0,
            fast: 0.65,
        },
    },

    ambient: {
        effects: ['gold-sparkle'],
        particle_color: '#d4af37',
    },

    sounds: {
        enabled_by_default: true,
        envelope_open: '/sounds/love-letter/paper-rustle.mp3',
        seal_break: '/sounds/love-letter/wax-seal-crack.mp3',
        text_reveal: undefined,
        ambient: '/sounds/love-letter/orchestral-swell.mp3',
    },

    decorations: {
        borders: 'ornate',
        drop_cap: true,
        drop_cap_style: 'illuminated',
        flourishes: true,
        watermark: 'royal-crest',
    },
};
