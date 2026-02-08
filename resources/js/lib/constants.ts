import { Image, Palette, Music, User, Eye, Send, type LucideIcon } from 'lucide-react';

export type BuilderStep =
    | 'content'
    | 'style'
    | 'music'
    | 'details'
    | 'preview'
    | 'publish';

export type StepConfig = {
    id: BuilderStep;
    label: string;
    description: string;
    icon: LucideIcon;
};

export const BUILDER_STEPS: StepConfig[] = [
    {
        id: 'content',
        label: 'Content',
        description: 'Add your photos and messages',
        icon: Image,
    },
    {
        id: 'style',
        label: 'Style',
        description: 'Choose colors and fonts',
        icon: Palette,
    },
    {
        id: 'music',
        label: 'Music',
        description: 'Add background music',
        icon: Music,
    },
    {
        id: 'details',
        label: 'Details',
        description: 'Set recipient info',
        icon: User,
    },
    {
        id: 'preview',
        label: 'Preview',
        description: 'Review your creation',
        icon: Eye,
    },
    {
        id: 'publish',
        label: 'Publish',
        description: 'Share your valentine',
        icon: Send,
    },
];

export const STEP_ORDER: BuilderStep[] = BUILDER_STEPS.map((step) => step.id);

export function getStepIndex(step: BuilderStep): number {
    return STEP_ORDER.indexOf(step);
}

export function getNextStep(currentStep: BuilderStep): BuilderStep | null {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex === -1 || currentIndex >= STEP_ORDER.length - 1) {
        return null;
    }
    return STEP_ORDER[currentIndex + 1];
}

export function getPreviousStep(currentStep: BuilderStep): BuilderStep | null {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex <= 0) {
        return null;
    }
    return STEP_ORDER[currentIndex - 1];
}

export function isStepComplete(
    currentStep: BuilderStep,
    targetStep: BuilderStep
): boolean {
    return getStepIndex(targetStep) < getStepIndex(currentStep);
}

export function canNavigateToStep(
    currentStep: BuilderStep,
    targetStep: BuilderStep
): boolean {
    const targetIndex = getStepIndex(targetStep);
    const currentIndex = getStepIndex(currentStep);
    return targetIndex <= currentIndex;
}

export const POLAROID_VIEWER = {
    swipeThreshold: 80,
    velocityThreshold: 500,
    stackVisibleCards: 3,
    cardScaleDecrement: 0.05,
    cardYOffsetIncrement: 10,
} as const;
