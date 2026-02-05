import type { ComponentType } from 'react';
import { useCallback, useEffect, useState } from 'react';

import type { Template } from '@/types/template';

export type TemplateBuilderProps = {
    template: Template;
    onStepComplete?: () => void;
};

export type TemplateViewerProps = {
    template: Template;
    customizations: Record<string, unknown>;
};

export type TemplateModule = {
    Builder: ComponentType<TemplateBuilderProps>;
    Viewer: ComponentType<TemplateViewerProps>;
    getDefaultCustomizations: () => Record<string, unknown>;
};

type TemplateLoader = () => Promise<{ default: TemplateModule }>;

const templateRegistry: Record<string, TemplateLoader> = {
    'polaroid-memories': () => import('./polaroid-memories/index'),
};

export async function loadTemplateModule(
    templateId: string
): Promise<TemplateModule | null> {
    const loader = templateRegistry[templateId];
    if (!loader) {
        console.warn(`Template "${templateId}" not found in registry`);
        return null;
    }

    try {
        const module = await loader();
        return module.default;
    } catch (error) {
        console.error(`Failed to load template "${templateId}":`, error);
        return null;
    }
}

export type UseTemplateModuleResult = {
    module: TemplateModule | null;
    isLoading: boolean;
    error: Error | null;
    reload: () => void;
};

export function useTemplateModule(
    templateId: string | null
): UseTemplateModuleResult {
    const [module, setModule] = useState<TemplateModule | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const load = useCallback(async () => {
        if (!templateId) {
            setModule(null);
            setIsLoading(false);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const loadedModule = await loadTemplateModule(templateId);
            if (!loadedModule) {
                throw new Error(`Template "${templateId}" not found`);
            }
            setModule(loadedModule);
        } catch (err) {
            setError(
                err instanceof Error ? err : new Error('Failed to load template')
            );
            setModule(null);
        } finally {
            setIsLoading(false);
        }
    }, [templateId]);

    useEffect(() => {
        load();
    }, [load]);

    return { module, isLoading, error, reload: load };
}

export function isTemplateRegistered(templateId: string): boolean {
    return templateId in templateRegistry;
}

export function getRegisteredTemplateIds(): string[] {
    return Object.keys(templateRegistry);
}
