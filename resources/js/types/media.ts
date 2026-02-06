export type MediaType = 'image' | 'audio';

export type Media = {
    id: string;
    valentine_id: string;
    type: MediaType;
    original_filename: string;
    path: string;
    disk: string;
    mime_type: string;
    size: number;
    width: number | null;
    height: number | null;
    duration: number | null;
    metadata: Record<string, unknown> | null;
    sort_order: number;
    created_at: string;
    updated_at: string;
    public_url: string;
};

export type PendingMedia = {
    id: string;
    file: File;
    type: MediaType;
    preview_url: string;
    status: 'pending' | 'uploading' | 'complete' | 'error';
    progress: number;
    error?: string;
};

export type MediaUploadOptions = {
    max_size: number;
    allowed_types: string[];
    max_count?: number;
};

export type ImageDimensions = {
    width: number;
    height: number;
};

export type AudioMetadata = {
    duration: number;
    sample_rate?: number;
    channels?: number;
};

export type AudioTrimData = {
    start_time: number;
    end_time: number;
    original_duration: number;
};
