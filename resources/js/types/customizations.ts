import type { PolaroidCustomizations } from '@/templates/polaroid-memories/schema';

export type TemplateCustomizationsMap = {
    'polaroid-memories': PolaroidCustomizations;
};

export type TemplateId = keyof TemplateCustomizationsMap;

export type TemplateCustomizations<T extends TemplateId = TemplateId> = {
    template: T;
    data: TemplateCustomizationsMap[T];
};

export type AnyTemplateCustomizations = TemplateCustomizationsMap[TemplateId];

export function isValidTemplateId(id: string): id is TemplateId {
    return id === 'polaroid-memories';
}
