import { AlertCircle, AlertTriangle } from 'lucide-react';

import { cn } from '@/lib/utils';

type StepValidationAlertProps = {
    errors?: string[];
    warnings?: string[];
    className?: string;
};

export function StepValidationAlert({
    errors = [],
    warnings = [],
    className,
}: StepValidationAlertProps) {
    if (errors.length === 0 && warnings.length === 0) {
        return null;
    }

    return (
        <div className={cn('space-y-3', className)}>
            {errors.length > 0 && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-400" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-rose-300">
                                {errors.length === 1 ? 'Required' : 'Required items'}
                            </p>
                            <ul className="mt-1 space-y-1">
                                {errors.map((error, i) => (
                                    <li key={i} className="text-sm text-rose-300/80">
                                        {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {warnings.length > 0 && errors.length === 0 && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-amber-300">
                                {warnings.length === 1 ? 'Suggestion' : 'Suggestions'}
                            </p>
                            <ul className="mt-1 space-y-1">
                                {warnings.map((warning, i) => (
                                    <li key={i} className="text-sm text-amber-300/80">
                                        {warning}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
