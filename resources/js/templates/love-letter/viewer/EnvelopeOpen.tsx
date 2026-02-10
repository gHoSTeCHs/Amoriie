import { memo } from 'react';
import { motion } from 'framer-motion';

import type { EnvelopeAnimation } from '../themes';
import type { LoveLetterViewerTheme } from './types';
import Flip3DEnvelope from './envelope-animations/Flip3DEnvelope';
import SlideOutEnvelope from './envelope-animations/SlideOutEnvelope';
import UnfoldEnvelope from './envelope-animations/UnfoldEnvelope';
import RibbonUntieEnvelope from './envelope-animations/RibbonUntieEnvelope';
import PetalScatterEnvelope from './envelope-animations/PetalScatterEnvelope';

type EnvelopeOpenProps = {
    animationType: EnvelopeAnimation;
    theme: LoveLetterViewerTheme;
    onSealBreak?: () => void;
    onComplete: () => void;
    reducedMotion?: boolean;
};

function PlaceholderEnvelope({
    theme,
    onComplete,
}: {
    theme: LoveLetterViewerTheme;
    onComplete: () => void;
}) {
    return (
        <motion.div
            className="flex min-h-dvh items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => {
                setTimeout(onComplete, 800);
            }}
        >
            <div
                className="relative h-64 w-80 rounded-lg shadow-2xl"
                style={{ backgroundColor: theme.paperColor }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.p
                        className="text-lg italic opacity-60"
                        style={{
                            color: theme.inkColor,
                            fontFamily: theme.bodyFont,
                        }}
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Opening your letter...
                    </motion.p>
                </div>
            </div>
        </motion.div>
    );
}

function EnvelopeOpen({
    animationType,
    theme,
    onSealBreak,
    onComplete,
    reducedMotion = false,
}: EnvelopeOpenProps) {
    switch (animationType) {
        case 'flip-3d':
            return (
                <Flip3DEnvelope
                    theme={theme}
                    onSealBreak={onSealBreak}
                    onComplete={onComplete}
                    reducedMotion={reducedMotion}
                />
            );

        case 'slide-out':
            return (
                <SlideOutEnvelope
                    theme={theme}
                    onSealBreak={onSealBreak}
                    onComplete={onComplete}
                    reducedMotion={reducedMotion}
                />
            );

        case 'unfold':
            return (
                <UnfoldEnvelope
                    theme={theme}
                    onSealBreak={onSealBreak}
                    onComplete={onComplete}
                    reducedMotion={reducedMotion}
                />
            );

        case 'petal-scatter':
            return (
                <PetalScatterEnvelope
                    theme={theme}
                    onSealBreak={onSealBreak}
                    onComplete={onComplete}
                    reducedMotion={reducedMotion}
                />
            );

        case 'ribbon-untie':
            return (
                <RibbonUntieEnvelope
                    theme={theme}
                    onSealBreak={onSealBreak}
                    onComplete={onComplete}
                    reducedMotion={reducedMotion}
                />
            );

        default:
            return <PlaceholderEnvelope theme={theme} onComplete={onComplete} />;
    }
}

export default memo(EnvelopeOpen);
