import { StepValidationAlert } from '@/components/shared/StepValidationAlert';
import { FinalMessageEditor } from '../components/FinalMessageEditor';
import { YesResponseEditor } from '../components/YesResponseEditor';
import { usePolaroidCustomizations } from '../hooks/use-polaroid-customizations';
import { usePolaroidValidation } from '../hooks/use-polaroid-validation';

export function DetailsStep() {
    const { customizations, setFinalMessage, setYesResponse } = usePolaroidCustomizations();
    const validation = usePolaroidValidation('details');

    return (
        <div className="space-y-8">
            <FinalMessageEditor
                message={customizations.final_message}
                onChange={setFinalMessage}
            />

            <YesResponseEditor
                response={customizations.yes_response}
                onChange={setYesResponse}
            />

            <StepValidationAlert
                errors={validation.errors}
                warnings={validation.warnings}
            />
        </div>
    );
}
