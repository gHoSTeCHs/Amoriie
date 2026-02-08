import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { BuilderStep } from '@/lib/constants';
import type { PendingMedia } from '@/types/media';
import type { AnyTemplateCustomizations, TemplateId } from '@/types/customizations';

export type StepValidation = {
    isValid: boolean;
    errors: string[];
    warnings: string[];
};

export type BuilderState = {
    template_id: TemplateId | null;
    current_step: BuilderStep;
    customizations: AnyTemplateCustomizations | null;
    pending_media: PendingMedia[];
    is_dirty: boolean;
    step_validation: StepValidation;
};

export type BuilderActions = {
    setTemplateId: (templateId: TemplateId | null) => void;
    setCurrentStep: (step: BuilderStep) => void;
    updateCustomizations: <T extends AnyTemplateCustomizations>(updates: Partial<T>) => void;
    setCustomizations: (customizations: AnyTemplateCustomizations | null) => void;
    addPendingMedia: (media: PendingMedia) => void;
    updatePendingMedia: (id: string, updates: Partial<PendingMedia>) => void;
    removePendingMedia: (id: string) => void;
    clearPendingMedia: () => void;
    setIsDirty: (isDirty: boolean) => void;
    setStepValidation: (validation: StepValidation) => void;
    reset: () => void;
    resetForTemplate: (templateId: TemplateId) => void;
};

const initialState: BuilderState = {
    template_id: null,
    current_step: 'content',
    customizations: null,
    pending_media: [],
    is_dirty: false,
    step_validation: { isValid: true, errors: [], warnings: [] },
};

const NON_SERIALIZABLE_KEYS = [
    'image_file',
    'trimmed_blob',
    'background_music_file',
    'reveal_photo_file',
    'file',
];

function serializeCustomizations(
    customizations: AnyTemplateCustomizations | null
): AnyTemplateCustomizations | null {
    if (!customizations) return null;

    try {
        return JSON.parse(
            JSON.stringify(customizations, (key, value) => {
                if (value instanceof File || value instanceof Blob) {
                    return undefined;
                }
                if (NON_SERIALIZABLE_KEYS.includes(key)) {
                    return undefined;
                }
                return value;
            })
        );
    } catch {
        return null;
    }
}

export const useBuilderStore = create<BuilderState & BuilderActions>()(
    persist(
        (set) => ({
            ...initialState,

            setTemplateId: (templateId) =>
                set({ template_id: templateId, is_dirty: true }),

            setCurrentStep: (step) => set({ current_step: step }),

            updateCustomizations: (updates) =>
                set((state) => ({
                    customizations: { ...(state.customizations ?? {}), ...updates } as AnyTemplateCustomizations,
                    is_dirty: true,
                })),

            setCustomizations: (customizations) =>
                set({ customizations, is_dirty: true }),

            addPendingMedia: (media) =>
                set((state) => ({
                    pending_media: [...state.pending_media, media],
                    is_dirty: true,
                })),

            updatePendingMedia: (id, updates) =>
                set((state) => ({
                    pending_media: state.pending_media.map((m) =>
                        m.id === id ? { ...m, ...updates } : m
                    ),
                })),

            removePendingMedia: (id) =>
                set((state) => ({
                    pending_media: state.pending_media.filter((m) => m.id !== id),
                    is_dirty: true,
                })),

            clearPendingMedia: () => set({ pending_media: [] }),

            setIsDirty: (isDirty) => set({ is_dirty: isDirty }),

            setStepValidation: (validation) => set({ step_validation: validation }),

            reset: () => set(initialState),

            resetForTemplate: (templateId) =>
                set({
                    ...initialState,
                    template_id: templateId,
                }),
        }),
        {
            name: 'amoriie-builder',
            partialize: (state) => ({
                template_id: state.template_id,
                current_step: state.current_step,
                customizations: serializeCustomizations(state.customizations),
                pending_media: [],
                is_dirty: state.is_dirty,
            }),
        }
    )
);

export function useBuilderStep() {
    return useBuilderStore((state) => state.current_step);
}

export function useBuilderCustomizations() {
    return useBuilderStore((state) => state.customizations);
}

export function useBuilderIsDirty() {
    return useBuilderStore((state) => state.is_dirty);
}

export function useBuilderTemplateId() {
    return useBuilderStore((state) => state.template_id);
}

export function useBuilderStepValidation() {
    return useBuilderStore((state) => state.step_validation);
}

export function useBuilderCanContinue() {
    return useBuilderStore((state) => state.step_validation.isValid);
}
