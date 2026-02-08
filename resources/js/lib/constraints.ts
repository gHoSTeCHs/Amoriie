export const MEDIA_CONSTRAINTS = {
    IMAGE_MAX_SIZE_KB: 10240,
    IMAGE_MAX_SIZE_MB: 10,
    AUDIO_MAX_SIZE_KB: 15360,
    AUDIO_MAX_SIZE_MB: 15,
    IMAGE_MAX_WIDTH: 1920,
    THUMBNAIL_WIDTH: 400,
    IMAGE_QUALITY: 85,
    AUDIO_MAX_DURATION_SECONDS: 30,
    MIN_IMAGES: 3,
    MAX_IMAGES: 10,
    IMAGE_MIMES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    AUDIO_MIMES: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a'],
} as const;

export const SLUG_CONSTRAINTS = {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/,
} as const;

export const VIEWER_SECTIONS = {
    INTRO: 'intro',
    MEMORIES: 'memories',
    FINAL: 'final',
    CELEBRATION: 'celebration',
    DECLINED: 'declined',
} as const;

export const CACHE_CONFIG = {
    VIEW_TTL_DAYS: 30,
    SLUG_CHECK_DEBOUNCE_MS: 400,
} as const;

export const API_CONFIG = {
    TIMEOUT_MS: 30000,
} as const;

export const VALENTINE_CONFIG = {
    EXPIRATION_DAYS: 90,
} as const;

export function isValidImageType(file: File): boolean {
    return MEDIA_CONSTRAINTS.IMAGE_MIMES.includes(file.type as typeof MEDIA_CONSTRAINTS.IMAGE_MIMES[number]);
}

export function isValidAudioType(file: File): boolean {
    return MEDIA_CONSTRAINTS.AUDIO_MIMES.includes(file.type as typeof MEDIA_CONSTRAINTS.AUDIO_MIMES[number]);
}

export function isValidImageSize(file: File): boolean {
    return file.size <= MEDIA_CONSTRAINTS.IMAGE_MAX_SIZE_KB * 1024;
}

export function isValidAudioSize(file: File): boolean {
    return file.size <= MEDIA_CONSTRAINTS.AUDIO_MAX_SIZE_KB * 1024;
}

export function isValidSlug(slug: string): boolean {
    if (slug.length < SLUG_CONSTRAINTS.MIN_LENGTH || slug.length > SLUG_CONSTRAINTS.MAX_LENGTH) {
        return false;
    }
    return SLUG_CONSTRAINTS.PATTERN.test(slug);
}
