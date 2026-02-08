import { API_CONFIG } from './constraints';

export class ApiError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        public data?: unknown
    ) {
        super(`API Error: ${status} ${statusText}`);
        this.name = 'ApiError';
    }

    get isNetworkError(): boolean {
        return this.status === 0;
    }

    get isServerError(): boolean {
        return this.status >= 500;
    }

    get isClientError(): boolean {
        return this.status >= 400 && this.status < 500;
    }

    get isNotFound(): boolean {
        return this.status === 404;
    }

    get isValidationError(): boolean {
        return this.status === 422;
    }

    get isUnauthorized(): boolean {
        return this.status === 401;
    }

    get isForbidden(): boolean {
        return this.status === 403;
    }
}

function getCsrfToken(): string {
    return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

function getDefaultHeaders(): HeadersInit {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': getCsrfToken(),
        'X-Requested-With': 'XMLHttpRequest',
    };
}

type RequestOptions = {
    timeout?: number;
    signal?: AbortSignal;
};

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let data: unknown;
        try {
            data = await response.json();
        } catch {
            data = await response.text();
        }
        throw new ApiError(response.status, response.statusText, data);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

export async function apiGet<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { timeout = API_CONFIG.TIMEOUT_MS, signal } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const combinedSignal = signal
        ? AbortSignal.any([signal, controller.signal])
        : controller.signal;

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: getDefaultHeaders(),
            signal: combinedSignal,
        });

        return handleResponse<T>(response);
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new ApiError(0, 'Request timeout or cancelled');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function apiPost<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
): Promise<T> {
    const { timeout = API_CONFIG.TIMEOUT_MS, signal } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const combinedSignal = signal
        ? AbortSignal.any([signal, controller.signal])
        : controller.signal;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: getDefaultHeaders(),
            body: data ? JSON.stringify(data) : undefined,
            signal: combinedSignal,
        });

        return handleResponse<T>(response);
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new ApiError(0, 'Request timeout or cancelled');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function apiPostFormData<T>(
    endpoint: string,
    formData: FormData,
    options: RequestOptions & { onProgress?: (progress: number) => void } = {}
): Promise<T> {
    const { timeout = API_CONFIG.TIMEOUT_MS, onProgress } = options;

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        const timeoutId = setTimeout(() => {
            xhr.abort();
            reject(new ApiError(0, 'Request timeout'));
        }, timeout);

        if (onProgress) {
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    onProgress(percentComplete);
                }
            });
        }

        xhr.addEventListener('load', () => {
            clearTimeout(timeoutId);

            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    resolve(JSON.parse(xhr.responseText));
                } catch {
                    reject(new ApiError(xhr.status, 'Invalid JSON response'));
                }
            } else {
                let data: unknown;
                try {
                    data = JSON.parse(xhr.responseText);
                } catch {
                    data = xhr.responseText;
                }
                reject(new ApiError(xhr.status, xhr.statusText, data));
            }
        });

        xhr.addEventListener('error', () => {
            clearTimeout(timeoutId);
            reject(new ApiError(0, 'Network error'));
        });

        xhr.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            reject(new ApiError(0, 'Request cancelled'));
        });

        xhr.open('POST', endpoint);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('X-CSRF-TOKEN', getCsrfToken());
        xhr.send(formData);
    });
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        if (error.isNetworkError) {
            return 'Network error. Please check your connection and try again.';
        }

        if (error.isServerError) {
            return 'Server error. Please try again later.';
        }

        if (error.isValidationError && typeof error.data === 'object' && error.data !== null) {
            const data = error.data as { message?: string; errors?: Record<string, string[]> };
            if (data.message) {
                return data.message;
            }
            if (data.errors) {
                const firstError = Object.values(data.errors)[0];
                if (Array.isArray(firstError) && firstError[0]) {
                    return firstError[0];
                }
            }
        }

        if (error.isNotFound) {
            return 'The requested resource was not found.';
        }

        if (error.isUnauthorized) {
            return 'Please log in to continue.';
        }

        if (error.isForbidden) {
            return 'You do not have permission to perform this action.';
        }

        if (typeof error.data === 'object' && error.data !== null) {
            const data = error.data as { message?: string; error?: string };
            return data.message || data.error || 'An unexpected error occurred.';
        }

        return 'An unexpected error occurred.';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred.';
}
