export type SlugStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

export type SlugCheckState = {
    slug: string;
    status: SlugStatus;
    normalizedSlug: string | null;
    suggestions: string[];
    errors: string[];
};

export type UploadItemStatus = 'pending' | 'uploading' | 'complete' | 'error';

export type UploadItem = {
    id: string;
    name: string;
    type: 'image' | 'audio';
    status: UploadItemStatus;
    progress: number;
    error?: string;
};

export type PublishResult = {
    success: boolean;
    valentine?: {
        id: string;
        slug: string;
        public_url: string;
        stats_url: string;
    };
    error?: string;
};

export type PublishData = {
    slug: string;
    creator_email?: string;
    notify_on_response?: boolean;
};

export type SlugCheckResponse = {
    slug: string;
    normalized_slug: string;
    available: boolean;
    errors: string[];
    suggestions: string[];
};

export type SlugSuggestionsResponse = {
    name: string;
    suggestions: string[];
};
