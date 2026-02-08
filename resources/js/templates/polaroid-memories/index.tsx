import { useEffect } from 'react';

import { useBuilderStep, useBuilderStore } from '@/stores/builder-store';
import type { TemplateModule, TemplateBuilderProps } from '../registry';
import { usePolaroidValidation } from './hooks/use-polaroid-validation';
import { getDefaultPolaroidCustomizations } from './schema';
import { ContentStep } from './steps/ContentStep';
import { DetailsStep } from './steps/DetailsStep';
import { MusicStep } from './steps/MusicStep';
import { PreviewStep } from './steps/PreviewStep';
import { PublishStep } from './steps/PublishStep';
import { StyleStep } from './steps/StyleStep';
import { TemplateViewer } from './viewer/TemplateViewer';

function PolaroidBuilder({ onStepComplete }: TemplateBuilderProps) {
    const currentStep = useBuilderStep();
    const validation = usePolaroidValidation(currentStep);
    const setStepValidation = useBuilderStore((state) => state.setStepValidation);

    useEffect(() => {
        setStepValidation({
            isValid: validation.errors.length === 0,
            errors: validation.errors,
            warnings: validation.warnings,
        });
    }, [validation.errors, validation.warnings, setStepValidation]);

    function renderStep() {
        switch (currentStep) {
            case 'content':
                return <ContentStep />;
            case 'style':
                return <StyleStep />;
            case 'music':
                return <MusicStep />;
            case 'details':
                return <DetailsStep />;
            case 'preview':
                return <PreviewStep />;
            case 'publish':
                return <PublishStep />;
            default:
                return null;
        }
    }

    return <div>{renderStep()}</div>;
}

const polaroidMemoriesModule: TemplateModule = {
    Builder: PolaroidBuilder,
    Viewer: TemplateViewer,
    getDefaultCustomizations: getDefaultPolaroidCustomizations,
};

export default polaroidMemoriesModule;
