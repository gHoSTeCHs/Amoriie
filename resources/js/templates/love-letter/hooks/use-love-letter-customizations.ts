import { useCallback, useMemo } from 'react';
import { useBuilderStore, useBuilderCustomizations } from '@/stores/builder-store';
import type {
    LoveLetterCustomizations,
    LoveLetterThemeCustomization,
    LoveLetterAudio,
    LoveLetterFinalMessage,
    LoveLetterYesResponse,
    LoveLetterThemeId,
} from '../schema';
import { getDefaultLoveLetterCustomizations, LOVE_LETTER_LIMITS } from '../schema';

export function useLoveLetterCustomizations() {
    const rawCustomizations = useBuilderCustomizations();
    const customizations = (rawCustomizations ?? {}) as Partial<LoveLetterCustomizations>;
    const { updateCustomizations } = useBuilderStore();

    const defaults = useMemo(() => getDefaultLoveLetterCustomizations(), []);

    const safeCustomizations = useMemo(
        (): LoveLetterCustomizations => ({
            recipient_name: customizations.recipient_name ?? defaults.recipient_name,
            sender_name: customizations.sender_name ?? defaults.sender_name,
            letter_date: customizations.letter_date ?? defaults.letter_date,
            letter_text: customizations.letter_text ?? defaults.letter_text,
            theme_id: customizations.theme_id ?? defaults.theme_id,
            customization: customizations.customization ?? defaults.customization,
            audio: customizations.audio ?? defaults.audio,
            final_message: customizations.final_message ?? defaults.final_message,
            yes_response: customizations.yes_response ?? defaults.yes_response,
        }),
        [customizations, defaults]
    );

    const setRecipientName = useCallback(
        (name: string) => {
            updateCustomizations({ recipient_name: name.slice(0, LOVE_LETTER_LIMITS.name.max) });
        },
        [updateCustomizations]
    );

    const setSenderName = useCallback(
        (name: string) => {
            updateCustomizations({ sender_name: name.slice(0, LOVE_LETTER_LIMITS.name.max) });
        },
        [updateCustomizations]
    );

    const setLetterDate = useCallback(
        (date: string) => {
            updateCustomizations({ letter_date: date });
        },
        [updateCustomizations]
    );

    const setLetterText = useCallback(
        (text: string) => {
            updateCustomizations({ letter_text: text.slice(0, LOVE_LETTER_LIMITS.letter_text.max) });
        },
        [updateCustomizations]
    );

    const setThemeId = useCallback(
        (themeId: LoveLetterThemeId) => {
            updateCustomizations({ theme_id: themeId });
        },
        [updateCustomizations]
    );

    const setCustomization = useCallback(
        (updates: Partial<LoveLetterThemeCustomization>) => {
            updateCustomizations({
                customization: { ...safeCustomizations.customization, ...updates },
            });
        },
        [safeCustomizations.customization, updateCustomizations]
    );

    const setAudio = useCallback(
        (audio: Partial<LoveLetterAudio>) => {
            updateCustomizations({
                audio: { ...safeCustomizations.audio, ...audio },
            });
        },
        [safeCustomizations.audio, updateCustomizations]
    );

    const setFinalMessage = useCallback(
        (message: Partial<LoveLetterFinalMessage>) => {
            const updates = { ...safeCustomizations.final_message, ...message };
            if (message.ask_text !== undefined) {
                updates.ask_text = message.ask_text.slice(0, LOVE_LETTER_LIMITS.ask_text.max);
            }
            if (message.text !== undefined) {
                updates.text = message.text.slice(0, LOVE_LETTER_LIMITS.message.max);
            }
            updateCustomizations({ final_message: updates });
        },
        [safeCustomizations.final_message, updateCustomizations]
    );

    const setYesResponse = useCallback(
        (response: Partial<LoveLetterYesResponse>) => {
            const updates = { ...safeCustomizations.yes_response, ...response };
            if (response.message !== undefined) {
                updates.message = response.message.slice(0, LOVE_LETTER_LIMITS.message.max);
            }
            updateCustomizations({ yes_response: updates });
        },
        [safeCustomizations.yes_response, updateCustomizations]
    );

    return {
        customizations: safeCustomizations,
        setRecipientName,
        setSenderName,
        setLetterDate,
        setLetterText,
        setThemeId,
        setCustomization,
        setAudio,
        setFinalMessage,
        setYesResponse,
    };
}
