import { memo, type RefObject } from 'react';

import type { TextRevealAnimation } from '../themes';
import type { LoveLetterViewerTheme } from './types';
import InkBleedReveal from './text-animations/InkBleedReveal';
import TypewriterReveal from './text-animations/TypewriterReveal';
import FadeLinesReveal from './text-animations/FadeLinesReveal';
import InstantReveal from './text-animations/InstantReveal';

type TextRevealProps = {
    animationType: TextRevealAnimation;
    text: string;
    theme: LoveLetterViewerTheme;
    scrollContainerRef?: RefObject<HTMLDivElement | null>;
    onStart?: () => void;
    onComplete: () => void;
    reducedMotion?: boolean;
};

function TextReveal({
    animationType,
    text,
    theme,
    scrollContainerRef,
    onStart,
    onComplete,
    reducedMotion = false,
}: TextRevealProps) {
    switch (animationType) {
        case 'ink-bleed':
            return (
                <InkBleedReveal
                    text={text}
                    font={theme.bodyFont}
                    color={theme.inkColor}
                    scrollContainerRef={scrollContainerRef}
                    onStart={onStart}
                    onComplete={onComplete}
                    speedMultiplier={theme.speedMultiplier}
                    reducedMotion={reducedMotion}
                />
            );

        case 'typewriter':
            return (
                <TypewriterReveal
                    text={text}
                    font={theme.bodyFont}
                    color={theme.inkColor}
                    scrollContainerRef={scrollContainerRef}
                    onStart={onStart}
                    onComplete={onComplete}
                    speedMultiplier={theme.speedMultiplier}
                    reducedMotion={reducedMotion}
                />
            );

        case 'fade-lines':
            return (
                <FadeLinesReveal
                    text={text}
                    font={theme.bodyFont}
                    color={theme.inkColor}
                    scrollContainerRef={scrollContainerRef}
                    onStart={onStart}
                    onComplete={onComplete}
                    speedMultiplier={theme.speedMultiplier}
                    reducedMotion={reducedMotion}
                />
            );

        case 'instant':
            return (
                <InstantReveal
                    text={text}
                    font={theme.bodyFont}
                    color={theme.inkColor}
                    onStart={onStart}
                    onComplete={onComplete}
                    speedMultiplier={theme.speedMultiplier}
                    reducedMotion={reducedMotion}
                />
            );

        default:
            return (
                <InstantReveal
                    text={text}
                    font={theme.bodyFont}
                    color={theme.inkColor}
                    onStart={onStart}
                    onComplete={onComplete}
                    speedMultiplier={theme.speedMultiplier}
                    reducedMotion={reducedMotion}
                />
            );
    }
}

export default memo(TextReveal);
