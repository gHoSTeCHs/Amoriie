import type { LetterTheme } from './index';

export const vintageTelegramTheme: LetterTheme = {
    id: 'vintage-telegram',
    name: 'Vintage Telegram',
    description: 'Nostalgic charm of an old-world telegram, typed with love',
    preview_image: '/images/themes/love-letter/vintage-telegram-preview.jpg',

    palette: {
        paper: ['#f4e4bc', '#e8d5a3', '#dcc68a', '#d0b871', '#c4a958'],
        ink: ['#1a1a1a', '#2c2c2c', '#3d3d3d', '#0a0a0a', '#4d4d4d'],
        seal: ['#8b4513', '#a0522d', '#6b3a0f', '#cd853f', '#deb887'],
        accent: ['#8b4513', '#6b3a0f', '#a0522d', '#cd853f', '#d2691e'],
        background: '#2a2520',
    },

    typography: {
        heading_fonts: ['Special Elite', 'Courier Prime'],
        body_fonts: ['Courier Prime', 'IBM Plex Mono'],
        signature_fonts: ['Special Elite'],
    },

    textures: {
        paper: 'yellowed-telegram',
        background: 'postal-desk',
        overlay: undefined,
    },

    animations: {
        envelope_open: 'slide-out',
        text_reveal: 'typewriter',
        speed_multipliers: {
            slow: 1.8,
            normal: 1.0,
            fast: 0.5,
        },
    },

    ambient: {
        effects: [],
        particle_color: undefined,
    },

    sounds: {
        enabled_by_default: true,
        envelope_open: '/sounds/love-letter/paper-shuffle.mp3',
        seal_break: undefined,
        text_reveal: '/sounds/love-letter/typewriter-key.mp3',
        ambient: undefined,
    },

    decorations: {
        borders: 'simple',
        drop_cap: false,
        drop_cap_style: undefined,
        flourishes: false,
        watermark: 'telegram-watermark',
    },
};
