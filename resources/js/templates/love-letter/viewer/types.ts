import type { LoveLetterCustomizations, LoveLetterThemeCustomization } from '../schema';
import type { LetterTheme } from '../themes';

export type LoveLetterStage = 'intro' | 'envelope' | 'letter' | 'final' | 'celebration' | 'declined';

export type ViewerResponse = 'yes' | 'no';

export type LoveLetterViewerProps = {
    customizations: LoveLetterCustomizations;
    slug: string;
    onResponse?: (response: ViewerResponse) => void;
};

export type LoveLetterViewerTheme = {
    config: LetterTheme;
    customization: LoveLetterThemeCustomization;
    backgroundColor: string;
    paperColor: string;
    inkColor: string;
    sealColor: string;
    accentColor: string;
    headingFont: string;
    bodyFont: string;
    signatureFont: string;
    headingFontUrl: string;
    bodyFontUrl: string;
    signatureFontUrl: string;
    isDarkBackground: boolean;
    speedMultiplier: number;
};

export type IntroScreenProps = {
    recipientName: string;
    senderName: string;
    theme: LoveLetterViewerTheme;
    onStart: () => void;
};

export type EnvelopeOpenProps = {
    theme: LoveLetterViewerTheme;
    onSealBreak?: () => void;
    onComplete: () => void;
    reducedMotion?: boolean;
};

export type LetterRevealProps = {
    letterText: string;
    letterDate: string;
    recipientName: string;
    senderName: string;
    theme: LoveLetterViewerTheme;
    onTextRevealStart?: () => void;
    onComplete: () => void;
    reducedMotion?: boolean;
};

export type TextRevealProps = {
    text: string;
    theme: LoveLetterViewerTheme;
    onStart?: () => void;
    onComplete: () => void;
    reducedMotion?: boolean;
};

export type FinalScreenProps = {
    recipientName: string;
    senderName: string;
    finalMessageText: string;
    askText: string;
    noButtonBehavior?: import('@/types/viewer').NoButtonBehavior;
    theme: LoveLetterViewerTheme;
    onResponse: (response: ViewerResponse) => void;
};

export type CelebrationScreenProps = {
    message: string;
    theme: LoveLetterViewerTheme;
};

export type DeclinedScreenProps = {
    theme: LoveLetterViewerTheme;
};

export type AmbientEffectsProps = {
    effects: LetterTheme['ambient']['effects'];
    particleColor?: string;
    reducedMotion?: boolean;
};
