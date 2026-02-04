export type TemplateCategory = 'storybook' | 'interactive';

export type PolaroidStyle = 'classic' | 'vintage' | 'modern';

export type PolaroidBackground = 'cork-board' | 'wooden-table' | 'soft-fabric' | 'minimal-white';

export type Template = {
    id: string;
    category: TemplateCategory;
    name: string;
    description: string | null;
    thumbnail_url: string | null;
    preview_url: string | null;
    schema: TemplateSchema;
    default_customizations: Record<string, unknown> | null;
    is_active: boolean;
    is_premium: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
};

export type TemplateSchema = {
    pages?: {
        min: number;
        max: number;
    };
    theme: {
        color_palettes: ColorPalette[];
        fonts: FontOption[];
        allow_custom_colors: boolean;
    };
    audio?: {
        allow_background_music: boolean;
        max_duration_seconds: number;
    };
};

export type ColorPalette = {
    id: string;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        accent: string;
    };
};

export type FontOption = {
    id: string;
    name: string;
    category: 'script' | 'serif' | 'sans' | 'handwriting';
    url: string;
};
