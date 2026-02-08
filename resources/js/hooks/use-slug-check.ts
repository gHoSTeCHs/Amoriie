import { useCallback, useEffect, useRef, useState } from 'react';
import type { SlugCheckResponse, SlugCheckState, SlugStatus } from '@/types/publish';
import { check } from '@/actions/App/Http/Controllers/SlugController';
import { CACHE_CONFIG } from '@/lib/constraints';
import { apiPost, ApiError, getErrorMessage } from '@/lib/api-client';

type UseSlugCheckReturn = {
    state: SlugCheckState;
    checkSlug: (slug: string) => void;
    selectSuggestion: (suggestion: string) => void;
    reset: () => void;
    retry: () => void;
    canRetry: boolean;
};

const initialState: SlugCheckState = {
    slug: '',
    status: 'idle',
    normalizedSlug: null,
    suggestions: [],
    errors: [],
};

export function useSlugCheck(): UseSlugCheckReturn {
    const [state, setState] = useState<SlugCheckState>(initialState);
    const [lastAttemptedSlug, setLastAttemptedSlug] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const performCheck = useCallback(async (slug: string) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        setState((prev) => ({ ...prev, status: 'checking' }));
        setLastAttemptedSlug(slug);

        try {
            const data = await apiPost<SlugCheckResponse>(
                check.url(),
                { slug },
                { signal: abortControllerRef.current.signal }
            );

            let status: SlugStatus = 'available';
            if (data.errors.length > 0) {
                status = 'invalid';
            } else if (!data.available) {
                status = 'taken';
            }

            setState({
                slug: data.slug,
                status,
                normalizedSlug: data.normalized_slug,
                suggestions: data.suggestions,
                errors: data.errors,
            });
        } catch (error) {
            if (error instanceof ApiError && error.isNetworkError) {
                setState((prev) => ({
                    ...prev,
                    status: 'invalid',
                    errors: ['Network error. Please check your connection.'],
                }));
                return;
            }

            setState((prev) => ({
                ...prev,
                status: 'invalid',
                errors: [getErrorMessage(error)],
            }));
        }
    }, []);

    const checkSlug = useCallback(
        (slug: string) => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            const trimmed = slug.trim().toLowerCase();

            if (trimmed.length === 0) {
                setState({
                    slug: trimmed,
                    status: 'idle',
                    normalizedSlug: null,
                    suggestions: [],
                    errors: [],
                });
                return;
            }

            setState((prev) => ({ ...prev, slug: trimmed, status: 'checking' }));

            debounceTimerRef.current = setTimeout(() => {
                performCheck(trimmed);
            }, CACHE_CONFIG.SLUG_CHECK_DEBOUNCE_MS);
        },
        [performCheck]
    );

    const selectSuggestion = useCallback((suggestion: string) => {
        setState({
            slug: suggestion,
            status: 'available',
            normalizedSlug: suggestion,
            suggestions: [],
            errors: [],
        });
    }, []);

    const reset = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        setState(initialState);
        setLastAttemptedSlug(null);
    }, []);

    const retry = useCallback(() => {
        if (lastAttemptedSlug) {
            performCheck(lastAttemptedSlug);
        }
    }, [lastAttemptedSlug, performCheck]);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const canRetry = state.status === 'invalid' && !!lastAttemptedSlug;

    return {
        state,
        checkSlug,
        selectSuggestion,
        reset,
        retry,
        canRetry,
    };
}
