export type LoveLetterThemeId =
    | 'midnight-candlelight'
    | 'vintage-telegram'
    | 'royal-elegance'
    | 'garden-romance'
    | 'modern-minimal'
    | 'parisian-cafe';

export type SignatureStyle = 'handwritten' | 'typed' | 'initials';

export type AnimationSpeed = 'slow' | 'normal' | 'fast';

export type LoveLetterThemeCustomization = {
    paper_color: string;
    ink_color: string;
    seal_color: string;
    heading_font: string;
    body_font: string;
    signature_font: string;
    signature_style: SignatureStyle;
    animation_speed: AnimationSpeed;
    sounds_enabled: boolean;
    show_borders: boolean;
    show_drop_cap: boolean;
    show_flourishes: boolean;
};

export type LoveLetterAudio = {
    background_music: string | null;
    background_music_file?: File;
    trimmed_blob?: Blob;
    filename?: string;
};

export type LoveLetterFinalMessage = {
    text: string;
    ask_text: string;
};

export type LoveLetterYesResponse = {
    message: string;
};

export type LoveLetterCustomizations = {
    recipient_name: string;
    sender_name: string;
    letter_date: string;
    letter_text: string;
    theme_id: LoveLetterThemeId;
    customization: LoveLetterThemeCustomization;
    audio: LoveLetterAudio;
    final_message: LoveLetterFinalMessage;
    yes_response: LoveLetterYesResponse;
};

export const LOVE_LETTER_LIMITS = {
    letter_text: {
        min: 50,
        max: 2000,
    },
    name: {
        max: 50,
    },
    message: {
        max: 300,
    },
    ask_text: {
        max: 100,
    },
} as const;

function getDefaultThemeCustomization(): LoveLetterThemeCustomization {
    return {
        paper_color: '#f5f0e1',
        ink_color: '#2d1810',
        seal_color: '#8b0000',
        heading_font: 'Pinyon Script',
        body_font: 'Cormorant Garamond',
        signature_font: 'Pinyon Script',
        signature_style: 'handwritten',
        animation_speed: 'normal',
        sounds_enabled: true,
        show_borders: true,
        show_drop_cap: true,
        show_flourishes: true,
    };
}

export function getDefaultLoveLetterCustomizations(): LoveLetterCustomizations {
    return {
        recipient_name: '',
        sender_name: '',
        letter_date: new Date().toISOString().split('T')[0],
        letter_text: '',
        theme_id: 'midnight-candlelight',
        customization: getDefaultThemeCustomization(),
        audio: {
            background_music: null,
        },
        final_message: {
            text: '',
            ask_text: 'Will you be my Valentine?',
        },
        yes_response: {
            message: "You've made me the happiest person!",
        },
    };
}
