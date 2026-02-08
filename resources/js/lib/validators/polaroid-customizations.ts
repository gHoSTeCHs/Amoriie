import type { PolaroidCustomizations } from '@/templates/polaroid-memories/schema';

export type ValidationResult = {
    isValid: boolean;
    errors: string[];
    warnings: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidMemory(item: unknown): boolean {
    if (!isRecord(item)) return false;
    const hasValidImage = item.image === undefined || item.image === null || typeof item.image === 'string';
    const hasValidCaption = item.caption === undefined || typeof item.caption === 'string';
    return hasValidImage && hasValidCaption;
}

function isMemoryArray(value: unknown): boolean {
    if (!Array.isArray(value)) return false;
    return value.every(isValidMemory);
}

export function validatePolaroidCustomizations(
    data: unknown
): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!isRecord(data)) {
        return { isValid: false, errors: ['Invalid customizations object'], warnings: [] };
    }

    if (typeof data.recipient_name !== 'string' || !data.recipient_name.trim()) {
        errors.push('Missing recipient name');
    }

    if (!isMemoryArray(data.memories)) {
        errors.push('Invalid or missing memories array');
    } else {
        const memories = data.memories as Array<{ image?: string | null }>;
        const validMemories = memories.filter((m) => m.image);
        if (validMemories.length === 0) {
            errors.push('No valid memories with images');
        }
    }

    if (!isRecord(data.theme)) {
        errors.push('Missing theme configuration');
    }

    if (!isRecord(data.final_message)) {
        errors.push('Missing final message');
    }

    if (!isRecord(data.yes_response)) {
        errors.push('Missing yes response configuration');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

export function isPolaroidCustomizations(
    data: unknown
): data is PolaroidCustomizations {
    return validatePolaroidCustomizations(data).isValid;
}
