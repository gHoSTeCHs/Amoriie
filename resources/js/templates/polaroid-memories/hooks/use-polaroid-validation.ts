import { useMemo } from 'react';
import type { BuilderStep } from '@/lib/constants';
import { POLAROID_LIMITS } from '../schema';
import { usePolaroidCustomizations } from './use-polaroid-customizations';

export type ValidationResult = {
    isValid: boolean;
    errors: string[];
    warnings: string[];
};

export function usePolaroidValidation(step?: BuilderStep): ValidationResult {
    const { customizations } = usePolaroidCustomizations();

    return useMemo(() => {
        const errors: string[] = [];
        const warnings: string[] = [];

        switch (step) {
            case 'content': {
                if (!customizations.recipient_name.trim()) {
                    errors.push("Recipient's name is required");
                }
                if (!customizations.sender_name.trim()) {
                    errors.push('Your name is required');
                }

                const memoriesWithImages = customizations.memories.filter(
                    (m) => m.image !== null
                );
                if (memoriesWithImages.length < POLAROID_LIMITS.memories.min) {
                    errors.push(
                        `Add at least ${POLAROID_LIMITS.memories.min} photos (you have ${memoriesWithImages.length})`
                    );
                }

                if (!customizations.title.trim()) {
                    warnings.push('Consider adding a title for your valentine');
                }

                const memoriesWithoutCaptions = customizations.memories.filter(
                    (m) => m.image && !m.caption.trim()
                );
                if (memoriesWithoutCaptions.length > 0) {
                    warnings.push(
                        `${memoriesWithoutCaptions.length} photo(s) have no caption`
                    );
                }
                break;
            }

            case 'style': {
                break;
            }

            case 'music': {
                break;
            }

            case 'details': {
                if (!customizations.final_message.ask_text.trim()) {
                    errors.push('The question for your valentine is required');
                }

                if (!customizations.final_message.text.trim()) {
                    warnings.push('Consider adding a final message');
                }

                if (!customizations.yes_response.message.trim()) {
                    warnings.push('Consider adding a response message for when they say yes');
                }
                break;
            }

            default: {
                if (!customizations.recipient_name.trim()) {
                    errors.push("Recipient's name is required");
                }
                if (!customizations.sender_name.trim()) {
                    errors.push('Your name is required');
                }

                const totalMemoriesWithImages = customizations.memories.filter(
                    (m) => m.image !== null
                ).length;
                if (totalMemoriesWithImages < POLAROID_LIMITS.memories.min) {
                    errors.push(
                        `Add at least ${POLAROID_LIMITS.memories.min} photos`
                    );
                }

                if (!customizations.final_message.ask_text.trim()) {
                    errors.push('The question is required');
                }
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }, [customizations, step]);
}

export function useStepCanContinue(step: BuilderStep): boolean {
    const validation = usePolaroidValidation(step);
    return validation.isValid;
}
