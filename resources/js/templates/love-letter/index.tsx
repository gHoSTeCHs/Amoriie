import type { TemplateModule, TemplateViewerProps } from '../registry';
import Builder from './Builder';
import { getDefaultLoveLetterCustomizations } from './schema';
import type { LoveLetterCustomizations } from './schema';
import LoveLetterViewer from './viewer/LoveLetterViewer';

function TemplateViewer({ customizations, slug }: TemplateViewerProps) {
    return (
        <LoveLetterViewer
            customizations={customizations as LoveLetterCustomizations}
            slug={slug}
        />
    );
}

const loveLetterModule: TemplateModule = {
    Builder,
    Viewer: TemplateViewer,
    getDefaultCustomizations: getDefaultLoveLetterCustomizations,
};

export default loveLetterModule;
