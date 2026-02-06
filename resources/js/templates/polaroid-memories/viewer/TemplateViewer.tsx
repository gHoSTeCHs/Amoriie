import type { TemplateViewerProps } from '../../registry';
import type { PolaroidCustomizations } from '../schema';
import { PolaroidViewer } from './PolaroidViewer';

export function TemplateViewer({ customizations }: TemplateViewerProps) {
    const polaroidCustomizations = customizations as PolaroidCustomizations;

    const slug = (customizations as { slug?: string }).slug || 'viewer';

    return (
        <PolaroidViewer
            customizations={polaroidCustomizations}
            slug={slug}
        />
    );
}
