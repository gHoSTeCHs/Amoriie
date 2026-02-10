import type { LetterTheme } from './index';

export const gardenRomanceTheme: LetterTheme = {
    id: 'garden-romance',
    name: 'Garden Romance',
    description: 'Fresh spring blossoms and the hope of new beginnings',
    preview_image: '/images/themes/love-letter/garden-romance-preview.jpg',

    palette: {
        paper: ['#fdf8f5', '#f9f1ec', '#f5eae3', '#f0e3d9', '#ebdcce'],
        ink: ['#2d4a3e', '#3d5f50', '#4d7462', '#1d3a2e', '#5d8472'],
        seal: ['#e8b4bc', '#d4a0a8', '#c08c94', '#f0c8d0', '#b87880'],
        accent: ['#e8b4bc', '#9eb8a0', '#d4a0a8', '#b8d0b0', '#c8e0c0'],
        background: '#f0ede8',
    },

    typography: {
        heading_fonts: ['Lavishly Yours', 'Parisienne'],
        body_fonts: ['Lora', 'Libre Baskerville'],
        signature_fonts: ['Dancing Script', 'Pacifico'],
    },

    textures: {
        paper: 'pressed-flower-paper',
        background: 'watercolor-floral',
        overlay: 'soft-light-rays',
    },

    animations: {
        envelope_open: 'petal-scatter',
        text_reveal: 'fade-lines',
        speed_multipliers: {
            slow: 1.4,
            normal: 1.0,
            fast: 0.7,
        },
    },

    ambient: {
        effects: ['floating-petals'],
        particle_color: '#e8b4bc',
    },

    sounds: {
        enabled_by_default: true,
        envelope_open: '/sounds/love-letter/gentle-breeze.mp3',
        seal_break: undefined,
        text_reveal: undefined,
        ambient: '/sounds/love-letter/birds-chirping.mp3',
    },

    decorations: {
        borders: 'floral',
        drop_cap: true,
        drop_cap_style: 'floral',
        flourishes: true,
        watermark: undefined,
    },
};
