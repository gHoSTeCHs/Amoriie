import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { builder as builderRoute } from '@/actions/App/Http/Controllers/ValentineController';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/spinner';
import BuilderLayout from '@/layouts/builder-layout';
import type { BuilderStep } from '@/lib/constants';
import { getNextStep, getPreviousStep, canNavigateToStep } from '@/lib/constants';
import {
    useBuilderStore,
    useBuilderTemplateId,
    useBuilderIsDirty,
    useBuilderStep,
    useBuilderCanContinue,
} from '@/stores/builder-store';
import { useTemplateModule, isTemplateRegistered } from '@/templates/registry';
import type { Template } from '@/types/template';

type Props = {
    template: Template;
};

export default function Builder({ template }: Props) {
    const storedTemplateId = useBuilderTemplateId();
    const isDirty = useBuilderIsDirty();
    const currentStep = useBuilderStep();
    const canContinue = useBuilderCanContinue();
    const { setCurrentStep, resetForTemplate, setIsDirty, updateCustomizations } = useBuilderStore();

    const [showSwitchDialog, setShowSwitchDialog] = useState(false);
    const [showStartOverDialog, setShowStartOverDialog] = useState(false);

    const { module, isLoading, error } = useTemplateModule(template.id);

    useEffect(() => {
        if (storedTemplateId && storedTemplateId !== template.id && isDirty) {
            setShowSwitchDialog(true);
        } else if (!storedTemplateId || storedTemplateId !== template.id) {
            if (isTemplateRegistered(template.id)) {
                resetForTemplate(template.id);
                if (module) {
                    updateCustomizations(module.getDefaultCustomizations());
                }
                setIsDirty(false);
            }
        }
    }, [template.id, storedTemplateId, isDirty, module]);

    useEffect(() => {
        if (module && !isDirty && storedTemplateId === template.id) {
            const currentCustomizations = useBuilderStore.getState().customizations;
            if (!currentCustomizations || Object.keys(currentCustomizations).length === 0) {
                updateCustomizations(module.getDefaultCustomizations());
            }
        }
    }, [module, isDirty, storedTemplateId, template.id]);

    function handleContinueEditing() {
        setShowSwitchDialog(false);
        if (storedTemplateId) {
            router.visit(builderRoute.url(storedTemplateId));
        }
    }

    function handleStartFresh() {
        setShowSwitchDialog(false);
        if (isTemplateRegistered(template.id)) {
            resetForTemplate(template.id);
            if (module) {
                updateCustomizations(module.getDefaultCustomizations());
            }
            setIsDirty(false);
        }
    }

    function handleStartOverClick() {
        if (isDirty) {
            setShowStartOverDialog(true);
        } else {
            handleConfirmStartOver();
        }
    }

    function handleConfirmStartOver() {
        setShowStartOverDialog(false);
        if (isTemplateRegistered(template.id)) {
            resetForTemplate(template.id);
            if (module) {
                updateCustomizations(module.getDefaultCustomizations());
            }
            setIsDirty(false);
            setCurrentStep('content');
        }
    }

    function handleStepClick(step: BuilderStep) {
        if (canNavigateToStep(currentStep, step)) {
            setCurrentStep(step);
        }
    }

    function handleBack() {
        const previousStep = getPreviousStep(currentStep);
        if (previousStep) {
            setCurrentStep(previousStep);
        }
    }

    function handleContinue() {
        const nextStep = getNextStep(currentStep);
        if (nextStep) {
            setCurrentStep(nextStep);
        }
    }

    function handleStepComplete() {
        handleContinue();
    }

    if (showSwitchDialog) {
        return (
            <AlertDialog open={showSwitchDialog} onOpenChange={setShowSwitchDialog}>
                <AlertDialogContent className="border-white/10 bg-[#0c0607]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Continue Previous Work?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-rose-100/60">
                            You have unsaved progress on a different template. Would you like to
                            continue editing that one, or start fresh with this template?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={handleStartFresh}
                            className="border-rose-500/30 bg-transparent text-rose-100 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-white"
                        >
                            Start Fresh
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleContinueEditing}
                            className="bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-500 hover:to-pink-500"
                        >
                            Continue Editing
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    if (isLoading) {
        return (
            <BuilderLayout
                currentStep={currentStep}
                showNavigation={false}
                title={`${template.name} — Amoriie`}
            >
                <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
                    <Spinner className="h-8 w-8 text-rose-500" />
                    <p className="text-rose-100/60">Loading template...</p>
                </div>
            </BuilderLayout>
        );
    }

    if (error || !module) {
        return (
            <BuilderLayout
                currentStep={currentStep}
                showNavigation={false}
                title="Error — Amoriie"
            >
                <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
                    <p className="text-rose-100/80">
                        {error?.message || 'Failed to load template'}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="rounded-full border border-rose-500/30 bg-rose-500/10 px-5 py-2 text-sm text-rose-100 transition-all hover:border-rose-500/50 hover:bg-rose-500/20"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => router.visit('/create')}
                            className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm text-white/70 transition-all hover:border-white/30 hover:bg-white/10"
                        >
                            Choose Another Template
                        </button>
                    </div>
                </div>
            </BuilderLayout>
        );
    }

    const { Builder: TemplateBuilder } = module;

    return (
        <>
            <BuilderLayout
                currentStep={currentStep}
                onStepClick={handleStepClick}
                onBack={handleBack}
                onContinue={handleContinue}
                onStartOver={handleStartOverClick}
                canContinue={canContinue}
                title={`${template.name} — Amoriie`}
            >
                <TemplateBuilder template={template} onStepComplete={handleStepComplete} />
            </BuilderLayout>

            <AlertDialog open={showStartOverDialog} onOpenChange={setShowStartOverDialog}>
                <AlertDialogContent className="border-white/10 bg-[#0c0607]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Start Over?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-rose-100/60">
                            This will clear all your progress and start fresh. Your photos,
                            captions, and customizations will be lost.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-white/10 bg-transparent text-rose-100 hover:border-white/20 hover:bg-white/5 hover:text-white">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmStartOver}
                            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500"
                        >
                            Start Over
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
