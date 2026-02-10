import type { ComponentType } from 'react';
import { useCallback, useEffect, useState } from 'react';

import type { Template } from '@/types/template';
import type { AnyTemplateCustomizations, TemplateId } from '@/types/customizations';
import { logger } from '@/lib/logger';

export type TemplateBuilderProps = {
    template: Template;
    onStepComplete?: () => void;
};

export type TemplateViewerProps<T extends AnyTemplateCustomizations = AnyTemplateCustomizations> = {
    template: Template;
    customizations: T;
    slug?: string;
};

export type TemplateModule = {
    Builder: ComponentType<TemplateBuilderProps>;
    Viewer: ComponentType<TemplateViewerProps>;
    getDefaultCustomizations: () => AnyTemplateCustomizations;
};

type TemplateLoader = () => Promise<{ default: TemplateModule }>;

const templateRegistry: Record<TemplateId, TemplateLoader> = {
    'polaroid-memories': () => import('./polaroid-memories/index'),
    'love-letter': () => import('./love-letter/index'),
};

export function isTemplateRegistered(templateId: string): templateId is TemplateId {
    return templateId in templateRegistry;
}

export async function loadTemplateModule(
    templateId: string
): Promise<TemplateModule | null> {
    if (!isTemplateRegistered(templateId)) {
        logger.warn(`Template "${templateId}" not found in registry`);
        return null;
    }

    const loader = templateRegistry[templateId];

    try {
        const module = await loader();
        return module.default;
    } catch (error) {
        logger.error(`Failed to load template "${templateId}":`, error);
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

export function getRegisteredTemplateIds(): TemplateId[] {
    return Object.keys(templateRegistry) as TemplateId[];
}
