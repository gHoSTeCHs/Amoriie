import { nanoid } from 'nanoid';
import { MEDIA_CONSTRAINTS } from '@/lib/constraints';

export type PolaroidMemory = {
    id: string;
    image: string | null;
    image_file?: File;
    caption: string;
    date?: string;
    rotation: number;
};

export type PolaroidTheme = {
    background: string;
    polaroid_style: string;
    handwriting_font: string;
};

export type PolaroidFinalMessage = {
    text: string;
    ask_text: string;
};

export type PolaroidYesResponse = {
    message: string;
    reveal_photo: string | null;
    reveal_photo_file?: File;
};

export type PolaroidAudio = {
    background_music: string | null;
    background_music_file?: File;
    trimmed_blob?: Blob;
    filename?: string;
};

export type PolaroidCustomizations = {
    title: string;
    recipient_name: string;
    sender_name: string;
    memories: PolaroidMemory[];
    final_message: PolaroidFinalMessage;
    theme: PolaroidTheme;
    audio: PolaroidAudio;
    yes_response: PolaroidYesResponse;
};

export const POLAROID_LIMITS = {
    memories: {
        min: MEDIA_CONSTRAINTS.MIN_IMAGES,
        max: MEDIA_CONSTRAINTS.MAX_IMAGES,
    },
    caption: {
        max: 150,
    },
    title: {
        max: 50,
    },
    message: {
        max: 300,
    },
    ask_text: {
        max: 100,
    },
    rotation: {
        min: -15,
        max: 15,
    },
    name: {
        max: 50,
    },
} as const;

export function createEmptyMemory(): PolaroidMemory {
    return {
        id: nanoid(),
        image: null,
        caption: '',
        date: undefined,
        rotation: Math.floor(Math.random() * 11) - 5,
    };
}

export function getDefaultPolaroidCustomizations(): PolaroidCustomizations {
    return {
        title: '',
        recipient_name: '',
        sender_name: '',
        memories: [
            createEmptyMemory(),
            createEmptyMemory(),
            createEmptyMemory(),
        ],
        final_message: {
            text: '',
            ask_text: 'Will you be my Valentine?',
        },
        theme: {
            background: 'cork-board',
            polaroid_style: 'classic',
            handwriting_font: 'dancing-script',
        },
        audio: {
            background_music: null,
        },
        yes_response: {
            message: "You've made me the happiest person!",
            reveal_photo: null,
        },
    };
}
