import { memo } from 'react';

type CandleFlickerProps = {
    intensity?: 'subtle' | 'medium' | 'strong';
    reducedMotion?: boolean;
};

const INTENSITY_CONFIG = {
    subtle: {
        primaryOpacity: '0.15',
        secondaryOpacity: '0.08',
        tertiaryOpacity: '0.12',
        glowSize: '50%',
    },
    medium: {
        primaryOpacity: '0.25',
        secondaryOpacity: '0.15',
        tertiaryOpacity: '0.2',
        glowSize: '60%',
    },
    strong: {
        primaryOpacity: '0.35',
        secondaryOpacity: '0.22',
        tertiaryOpacity: '0.28',
        glowSize: '70%',
    },
} as const;

function CandleFlicker({ intensity = 'medium', reducedMotion = false }: CandleFlickerProps) {
    const config = INTENSITY_CONFIG[intensity];

    return (
        <div
            className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
            aria-hidden="true"
        >
            <style>{`
                @keyframes candleFlickerPrimary {
                    0%, 100% { opacity: ${config.primaryOpacity}; transform: scale(1); }
                    12% { opacity: ${parseFloat(config.primaryOpacity) * 1.15}; transform: scale(1.02); }
                    23% { opacity: ${parseFloat(config.primaryOpacity) * 0.85}; transform: scale(0.98); }
                    37% { opacity: ${parseFloat(config.primaryOpacity) * 1.1}; transform: scale(1.01); }
                    48% { opacity: ${parseFloat(config.primaryOpacity) * 0.9}; transform: scale(0.99); }
                    61% { opacity: ${parseFloat(config.primaryOpacity) * 1.2}; transform: scale(1.03); }
                    74% { opacity: ${parseFloat(config.primaryOpacity) * 0.88}; transform: scale(0.97); }
                    87% { opacity: ${parseFloat(config.primaryOpacity) * 1.05}; transform: scale(1.01); }
                }

                @keyframes candleFlickerSecondary {
                    0%, 100% { opacity: ${config.secondaryOpacity}; }
                    17% { opacity: ${parseFloat(config.secondaryOpacity) * 1.3}; }
                    31% { opacity: ${parseFloat(config.secondaryOpacity) * 0.7}; }
                    44% { opacity: ${parseFloat(config.secondaryOpacity) * 1.15}; }
                    58% { opacity: ${parseFloat(config.secondaryOpacity) * 0.85}; }
                    71% { opacity: ${parseFloat(config.secondaryOpacity) * 1.25}; }
                    89% { opacity: ${parseFloat(config.secondaryOpacity) * 0.9}; }
                }

                @keyframes candleFlickerTertiary {
                    0%, 100% { opacity: ${config.tertiaryOpacity}; transform: translateY(0); }
                    21% { opacity: ${parseFloat(config.tertiaryOpacity) * 1.2}; transform: translateY(-1%); }
                    42% { opacity: ${parseFloat(config.tertiaryOpacity) * 0.8}; transform: translateY(0.5%); }
                    63% { opacity: ${parseFloat(config.tertiaryOpacity) * 1.1}; transform: translateY(-0.5%); }
                    84% { opacity: ${parseFloat(config.tertiaryOpacity) * 0.9}; transform: translateY(0); }
                }

                @keyframes warmPulse {
                    0%, 100% { filter: saturate(1) brightness(1); }
                    33% { filter: saturate(1.1) brightness(1.05); }
                    66% { filter: saturate(0.95) brightness(0.98); }
                }

                .candle-flicker-primary {
                    animation: candleFlickerPrimary 3.7s ease-in-out infinite,
                               warmPulse 8s ease-in-out infinite;
                }

                .candle-flicker-secondary {
                    animation: candleFlickerSecondary 2.9s ease-in-out infinite;
                    animation-delay: -0.7s;
                }

                .candle-flicker-tertiary {
                    animation: candleFlickerTertiary 4.3s ease-in-out infinite;
                    animation-delay: -1.3s;
                }

                .candle-flicker-static {
                    animation: none !important;
                }
            `}</style>

            {/* Primary warm glow - bottom right corner (main candle source) */}
            <div
                className={`absolute -bottom-[20%] -right-[10%] rounded-full ${reducedMotion ? 'candle-flicker-static' : 'candle-flicker-primary'}`}
                style={{
                    width: config.glowSize,
                    height: config.glowSize,
                    background: `radial-gradient(
                        ellipse at center,
                        rgba(212, 175, 55, 0.6) 0%,
                        rgba(255, 147, 41, 0.4) 20%,
                        rgba(255, 100, 20, 0.2) 40%,
                        rgba(139, 69, 19, 0.1) 60%,
                        rgba(139, 69, 19, 0.04) 80%,
                        transparent 100%
                    )`,
                    filter: 'blur(30px)',
                    opacity: reducedMotion ? config.primaryOpacity : undefined,
                }}
            />

            {/* Secondary glow - bottom left corner (reflected light) */}
            <div
                className={`absolute -bottom-[15%] -left-[15%] rounded-full ${reducedMotion ? 'candle-flicker-static' : 'candle-flicker-secondary'}`}
                style={{
                    width: '45%',
                    height: '40%',
                    background: `radial-gradient(
                        ellipse at center,
                        rgba(255, 170, 80, 0.35) 0%,
                        rgba(212, 175, 55, 0.2) 30%,
                        rgba(139, 90, 43, 0.08) 55%,
                        rgba(139, 90, 43, 0.03) 75%,
                        transparent 100%
                    )`,
                    filter: 'blur(25px)',
                    opacity: reducedMotion ? config.secondaryOpacity : undefined,
                }}
            />

            {/* Tertiary glow - top edge (ambient ceiling bounce) */}
            <div
                className={`absolute -top-[25%] left-1/2 -translate-x-1/2 rounded-full ${reducedMotion ? 'candle-flicker-static' : 'candle-flicker-tertiary'}`}
                style={{
                    width: '80%',
                    height: '35%',
                    background: `radial-gradient(
                        ellipse 70% 50% at 50% 100%,
                        rgba(255, 180, 100, 0.15) 0%,
                        rgba(212, 175, 55, 0.08) 40%,
                        rgba(212, 175, 55, 0.03) 70%,
                        transparent 100%
                    )`,
                    filter: 'blur(20px)',
                    opacity: reducedMotion ? config.tertiaryOpacity : undefined,
                }}
            />

            {/* Subtle center warmth (fills the space) */}
            <div
                className={`absolute inset-0 ${reducedMotion ? '' : 'candle-flicker-secondary'}`}
                style={{
                    background: `radial-gradient(
                        ellipse 100% 80% at 50% 100%,
                        rgba(255, 160, 60, 0.08) 0%,
                        rgba(212, 175, 55, 0.04) 40%,
                        transparent 70%
                    )`,
                    opacity: reducedMotion ? '0.06' : undefined,
                }}
            />

            {/* Corner vignette for depth */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(
                            ellipse 80% 60% at 50% 50%,
                            transparent 50%,
                            rgba(12, 6, 7, 0.1) 70%,
                            rgba(12, 6, 7, 0.25) 85%,
                            rgba(12, 6, 7, 0.3) 100%
                        )
                    `,
                    opacity: 0.5,
                }}
            />
        </div>
    );
}

export default memo(CandleFlicker);
