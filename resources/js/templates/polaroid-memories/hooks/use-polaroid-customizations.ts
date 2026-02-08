import { useCallback, useMemo } from 'react';
import { useBuilderStore, useBuilderCustomizations } from '@/stores/builder-store';
import type { PolaroidCustomizations, PolaroidMemory, PolaroidTheme, PolaroidFinalMessage, PolaroidYesResponse, PolaroidAudio } from '../schema';
import { getDefaultPolaroidCustomizations, createEmptyMemory, POLAROID_LIMITS } from '../schema';

export function usePolaroidCustomizations() {
    const rawCustomizations = useBuilderCustomizations();
    const customizations = (rawCustomizations ?? {}) as Partial<PolaroidCustomizations>;
    const { updateCustomizations } = useBuilderStore();

    const defaults = useMemo(() => getDefaultPolaroidCustomizations(), []);

    const safeCustomizations = useMemo((): PolaroidCustomizations => ({
        title: customizations.title ?? defaults.title,
        recipient_name: customizations.recipient_name ?? defaults.recipient_name,
        sender_name: customizations.sender_name ?? defaults.sender_name,
        memories: customizations.memories ?? defaults.memories,
        final_message: customizations.final_message ?? defaults.final_message,
        theme: customizations.theme ?? defaults.theme,
        audio: customizations.audio ?? defaults.audio,
        yes_response: customizations.yes_response ?? defaults.yes_response,
    }), [customizations, defaults]);

    const setTitle = useCallback((title: string) => {
        updateCustomizations({ title: title.slice(0, POLAROID_LIMITS.title.max) });
    }, [updateCustomizations]);

    const setRecipientName = useCallback((name: string) => {
        updateCustomizations({ recipient_name: name.slice(0, POLAROID_LIMITS.name.max) });
    }, [updateCustomizations]);

    const setSenderName = useCallback((name: string) => {
        updateCustomizations({ sender_name: name.slice(0, POLAROID_LIMITS.name.max) });
    }, [updateCustomizations]);

    const setMemories = useCallback((memories: PolaroidMemory[]) => {
        updateCustomizations({ memories });
    }, [updateCustomizations]);

    const addMemory = useCallback(() => {
        if (safeCustomizations.memories.length < POLAROID_LIMITS.memories.max) {
            setMemories([...safeCustomizations.memories, createEmptyMemory()]);
        }
    }, [safeCustomizations.memories, setMemories]);

    const removeMemory = useCallback((id: string) => {
        if (safeCustomizations.memories.length > POLAROID_LIMITS.memories.min) {
            setMemories(safeCustomizations.memories.filter((m) => m.id !== id));
        }
    }, [safeCustomizations.memories, setMemories]);

    const updateMemory = useCallback((id: string, updates: Partial<PolaroidMemory>) => {
        setMemories(
            safeCustomizations.memories.map((m) =>
                m.id === id ? { ...m, ...updates } : m
            )
        );
    }, [safeCustomizations.memories, setMemories]);

    const setTheme = useCallback((theme: Partial<PolaroidTheme>) => {
        updateCustomizations({
            theme: { ...safeCustomizations.theme, ...theme },
        });
    }, [safeCustomizations.theme, updateCustomizations]);

    const setFinalMessage = useCallback((message: Partial<PolaroidFinalMessage>) => {
        updateCustomizations({
            final_message: { ...safeCustomizations.final_message, ...message },
        });
    }, [safeCustomizations.final_message, updateCustomizations]);

    const setYesResponse = useCallback((response: Partial<PolaroidYesResponse>) => {
        updateCustomizations({
            yes_response: { ...safeCustomizations.yes_response, ...response },
        });
    }, [safeCustomizations.yes_response, updateCustomizations]);

    const setAudio = useCallback((audio: Partial<PolaroidAudio>) => {
        updateCustomizations({
            audio: { ...safeCustomizations.audio, ...audio },
        });
    }, [safeCustomizations.audio, updateCustomizations]);

    return {
        customizations: safeCustomizations,
        setTitle,
        setRecipientName,
        setSenderName,
        setMemories,
        addMemory,
        removeMemory,
        updateMemory,
        setTheme,
        setFinalMessage,
        setYesResponse,
        setAudio,
    };
}
