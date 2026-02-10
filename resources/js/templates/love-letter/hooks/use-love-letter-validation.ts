import { useMemo } from 'react';
import type { BuilderStep } from '@/lib/constants';
import { LOVE_LETTER_LIMITS } from '../schema';
import { useLoveLetterCustomizations } from './use-love-letter-customizations';

export type ValidationResult = {
    isValid: boolean;
    errors: string[];
    warnings: string[];
};

export function useLoveLetterValidation(step?: BuilderStep): ValidationResult {
    const { customizations } = useLoveLetterCustomizations();

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

                const letterLength = customizations.letter_text.trim().length;
                if (letterLength < LOVE_LETTER_LIMITS.letter_text.min) {
                    errors.push(
                        `Your letter needs at least ${LOVE_LETTER_LIMITS.letter_text.min} characters (currently ${letterLength})`
                    );
                }

                if (!customizations.letter_date) {
                    warnings.push('Consider adding a date to your letter');
                }
                break;
            }

            case 'style': {
                if (!customizations.theme_id) {
                    errors.push('Please select a theme');
                }
                break;
            }

            case 'music': {
                break;
            }

            case 'details': {
                if (!customizations.final_message.ask_text.trim()) {
                    errors.push('The question for your valentine is required');
                }

                if (!customizations.yes_response.message.trim()) {
                    errors.push('A response message for when they say yes is required');
                }

                if (!customizations.final_message.text.trim()) {
                    warnings.push('Consider adding a final message before the question');
                }
                break;
            }

            case 'preview':
            case 'publish': {
                if (!customizations.recipient_name.trim()) {
                    errors.push("Recipient's name is required");
                }
                if (!customizations.sender_name.trim()) {
                    errors.push('Your name is required');
                }

                const publishLetterLength = customizations.letter_text.trim().length;
                if (publishLetterLength < LOVE_LETTER_LIMITS.letter_text.min) {
                    errors.push(
                        `Your letter needs at least ${LOVE_LETTER_LIMITS.letter_text.min} characters`
                    );
                }

                if (!customizations.theme_id) {
                    errors.push('Please select a theme');
                }

                if (!customizations.final_message.ask_text.trim()) {
                    errors.push('The question is required');
                }

                if (!customizations.yes_response.message.trim()) {
                    errors.push('The yes response message is required');
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

                const defaultLetterLength = customizations.letter_text.trim().length;
                if (defaultLetterLength < LOVE_LETTER_LIMITS.letter_text.min) {
                    errors.push(
                        `Your letter needs at least ${LOVE_LETTER_LIMITS.letter_text.min} characters`
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
    const validation = useLoveLetterValidation(step);
    return validation.isValid;
}
