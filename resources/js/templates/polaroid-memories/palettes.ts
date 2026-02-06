export type BackgroundOption = {
    id: string;
    name: string;
    description: string;
    cssClass: string;
    preview: string;
};

export type PolaroidStyleOption = {
    id: string;
    name: string;
    description: string;
    borderColor: string;
    shadowClass: string;
    textureClass: string;
};

export type HandwritingFontOption = {
    id: string;
    name: string;
    fontFamily: string;
    googleFontUrl: string;
    previewText: string;
};

export const POLAROID_BACKGROUNDS: BackgroundOption[] = [
    {
        id: 'cork-board',
        name: 'Cork Board',
        description: 'Warm, nostalgic texture',
        cssClass: 'bg-gradient-to-br from-amber-900/90 via-amber-800/80 to-amber-900/90',
        preview: 'bg-amber-800',
    },
    {
        id: 'soft-pink',
        name: 'Soft Pink',
        description: 'Romantic and dreamy',
        cssClass: 'bg-gradient-to-br from-rose-100 via-pink-50 to-rose-100',
        preview: 'bg-rose-200',
    },
    {
        id: 'midnight-blue',
        name: 'Midnight Blue',
        description: 'Elegant and mysterious',
        cssClass: 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900',
        preview: 'bg-slate-800',
    },
    {
        id: 'cream-linen',
        name: 'Cream Linen',
        description: 'Classic and timeless',
        cssClass: 'bg-gradient-to-br from-stone-100 via-amber-50 to-stone-100',
        preview: 'bg-stone-200',
    },
];

export const POLAROID_STYLES: PolaroidStyleOption[] = [
    {
        id: 'classic',
        name: 'Classic White',
        description: 'Traditional polaroid frame',
        borderColor: '#ffffff',
        shadowClass: 'shadow-xl shadow-black/20',
        textureClass: '',
    },
    {
        id: 'vintage',
        name: 'Vintage Cream',
        description: 'Aged, yellowed edges',
        borderColor: '#f5f0e1',
        shadowClass: 'shadow-lg shadow-amber-900/30',
        textureClass: 'before:absolute before:inset-0 before:bg-gradient-to-b before:from-amber-100/20 before:to-transparent',
    },
    {
        id: 'instant',
        name: 'Instant Film',
        description: 'Modern instant camera look',
        borderColor: '#fafafa',
        shadowClass: 'shadow-md shadow-black/10',
        textureClass: 'border-b-[4rem]',
    },
];

export const HANDWRITING_FONTS: HandwritingFontOption[] = [
    {
        id: 'dancing-script',
        name: 'Dancing Script',
        fontFamily: "'Dancing Script', cursive",
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap',
        previewText: 'Forever yours',
    },
    {
        id: 'caveat',
        name: 'Caveat',
        fontFamily: "'Caveat', cursive",
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap',
        previewText: 'Forever yours',
    },
    {
        id: 'kalam',
        name: 'Kalam',
        fontFamily: "'Kalam', cursive",
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap',
        previewText: 'Forever yours',
    },
    {
        id: 'satisfy',
        name: 'Satisfy',
        fontFamily: "'Satisfy', cursive",
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Satisfy&display=swap',
        previewText: 'Forever yours',
    },
    {
        id: 'pacifico',
        name: 'Pacifico',
        fontFamily: "'Pacifico', cursive",
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
        previewText: 'Forever yours',
    },
    {
        id: 'permanent-marker',
        name: 'Permanent Marker',
        fontFamily: "'Permanent Marker', cursive",
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap',
        previewText: 'Forever yours',
    },
];

export function getBackgroundById(id: string): BackgroundOption | undefined {
    return POLAROID_BACKGROUNDS.find((bg) => bg.id === id);
}

export function getPolaroidStyleById(id: string): PolaroidStyleOption | undefined {
    return POLAROID_STYLES.find((style) => style.id === id);
}

export function getFontById(id: string): HandwritingFontOption | undefined {
    return HANDWRITING_FONTS.find((font) => font.id === id);
}
