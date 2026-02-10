import { memo } from 'react';

import type { AmbientEffect } from '../themes';
import CandleFlicker from './ambient-effects/CandleFlicker';
import DustParticles from './ambient-effects/DustParticles';
import GoldSparkle from './ambient-effects/GoldSparkle';
import FloatingPetals from './ambient-effects/FloatingPetals';
import BokehLights from './ambient-effects/BokehLights';

type AmbientEffectsProps = {
    effects: AmbientEffect[];
    particleColor?: string;
    reducedMotion?: boolean;
};

function AmbientEffects({ effects, particleColor, reducedMotion = false }: AmbientEffectsProps) {
    if (!effects || effects.length === 0) {
        return null;
    }

    return (
        <>
            {effects.map((effect) => {
                switch (effect) {
                    case 'candle-flicker':
                        return (
                            <CandleFlicker
                                key="candle-flicker"
                                intensity="medium"
                                reducedMotion={reducedMotion}
                            />
                        );

                    case 'dust-particles':
                        return (
                            <DustParticles
                                key="dust-particles"
                                color={particleColor}
                                reducedMotion={reducedMotion}
                            />
                        );

                    case 'gold-sparkle':
                        return (
                            <GoldSparkle
                                key="gold-sparkle"
                                color={particleColor}
                                reducedMotion={reducedMotion}
                            />
                        );

                    case 'floating-petals':
                        return (
                            <FloatingPetals
                                key="floating-petals"
                                color={particleColor}
                                reducedMotion={reducedMotion}
                            />
                        );

                    case 'bokeh':
                        return (
                            <BokehLights
                                key="bokeh"
                                reducedMotion={reducedMotion}
                            />
                        );

                    default:
                        return null;
                }
            })}
        </>
    );
}

export default memo(AmbientEffects);
