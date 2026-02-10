import { memo, useEffect } from 'react';

import { useBuilderStep, useBuilderStore } from '@/stores/builder-store';
import type { TemplateBuilderProps } from '../registry';
import { useLoveLetterValidation } from './hooks/use-love-letter-validation';
import { ContentStep } from './steps/ContentStep';
import { DetailsStep } from './steps/DetailsStep';
import { MusicStep } from './steps/MusicStep';
import { PreviewStep } from './steps/PreviewStep';
import { PublishStep } from './steps/PublishStep';
import { ThemeStep } from './steps/ThemeStep';

function LoveLetterBuilder({ onStepComplete }: TemplateBuilderProps) {
    const currentStep = useBuilderStep();
    const validation = useLoveLetterValidation(currentStep);
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
                return <ThemeStep />;
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

export default memo(LoveLetterBuilder);
