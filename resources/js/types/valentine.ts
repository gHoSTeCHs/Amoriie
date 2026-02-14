import type { Media } from './media';
import type { Template } from './template';

export type ValentineResponse = 'yes' | 'no';

export type Valentine = {
    id: string;
    slug: string;
    template_id: string;
    customizations: Record<string, unknown>;
    recipient_name: string;
    sender_name: string | null;
    response: ValentineResponse | null;
    responded_at: string | null;
    view_count: number;
    unique_view_count: number;
    first_viewed_at: string | null;
    total_time_spent_seconds: number;
    last_section_reached: string | null;
    completed: boolean;
    furthest_progress: number;
    og_image_path: string | null;
    expires_at: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    template?: Template;
    media?: Media[];
    public_url: string;
    stats_url: string;
};

export type ValentineStats = {
    view_count: number;
    unique_view_count: number;
    first_viewed_at: string | null;
    total_time_spent_seconds: number;
    last_section_reached: string | null;
    furthest_progress: number;
    completed: boolean;
    response: ValentineResponse | null;
    responded_at: string | null;
};

export type ValentineCreateData = {
    template_id: string;
    slug: string;
    recipient_name: string;
    sender_name?: string;
    creator_email?: string;
    notify_on_response?: boolean;
    customizations: Record<string, unknown>;
    expires_at?: string;
};

export type ValentineUpdateData = Partial<ValentineCreateData>;

export type SlugCheckResult = {
    slug: string;
    available: boolean;
    suggestions?: string[];
};

export type SlugSuggestionsResult = {
    name: string;
    suggestions: string[];
};
