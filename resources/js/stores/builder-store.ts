import type { PendingMedia } from '@/types/media';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { BuilderStep } from '@/lib/constants';

export type BuilderState = {
    template_id: string | null;
    current_step: BuilderStep;
    customizations: Record<string, unknown>;
    pending_media: PendingMedia[];
    is_dirty: boolean;
};

export type BuilderActions = {
    setTemplateId: (templateId: string | null) => void;
    setCurrentStep: (step: BuilderStep) => void;
    updateCustomizations: (updates: Partial<Record<string, unknown>>) => void;
    setCustomizations: (customizations: Record<string, unknown>) => void;
    addPendingMedia: (media: PendingMedia) => void;
    updatePendingMedia: (id: string, updates: Partial<PendingMedia>) => void;
    removePendingMedia: (id: string) => void;
    clearPendingMedia: () => void;
    setIsDirty: (isDirty: boolean) => void;
    reset: () => void;
    resetForTemplate: (templateId: string) => void;
};

const initialState: BuilderState = {
    template_id: null,
    current_step: 'content',
    customizations: {},
    pending_media: [],
    is_dirty: false,
};

export const useBuilderStore = create<BuilderState & BuilderActions>()(
    persist(
        (set) => ({
            ...initialState,

            setTemplateId: (templateId) =>
                set({ template_id: templateId, is_dirty: true }),

            setCurrentStep: (step) => set({ current_step: step }),

            updateCustomizations: (updates) =>
                set((state) => ({
                    customizations: { ...state.customizations, ...updates },
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
                customizations: state.customizations,
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
