import { memo } from 'react';

type BokehLightsProps = {
    reducedMotion?: boolean;
};

type BokehCircle = {
    size: number;
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    color: string;
    blur: number;
    delay: number;
};

const BOKEH_CIRCLES: BokehCircle[] = [
    {
        size: 180,
        top: '8%',
        left: '12%',
        color: 'rgba(255, 215, 0, 0.35)',
        blur: 25,
        delay: 0,
    },
    {
        size: 120,
        top: '15%',
        right: '18%',
        color: 'rgba(255, 250, 205, 0.4)',
        blur: 20,
        delay: -2.5,
    },
    {
        size: 200,
        bottom: '20%',
        left: '8%',
        color: 'rgba(255, 182, 193, 0.3)',
        blur: 30,
        delay: -5,
    },
    {
        size: 90,
        top: '45%',
        right: '10%',
        color: 'rgba(255, 215, 0, 0.4)',
        blur: 18,
        delay: -1.8,
    },
    {
        size: 150,
        bottom: '12%',
        right: '25%',
        color: 'rgba(255, 250, 205, 0.35)',
        blur: 22,
        delay: -7.2,
    },
    {
        size: 110,
        top: '30%',
        left: '35%',
        color: 'rgba(255, 182, 193, 0.25)',
        blur: 20,
        delay: -3.6,
    },
    {
        size: 80,
        top: '65%',
        left: '22%',
        color: 'rgba(255, 215, 0, 0.3)',
        blur: 15,
        delay: -9,
    },
    {
        size: 160,
        bottom: '35%',
        right: '5%',
        color: 'rgba(255, 250, 205, 0.28)',
        blur: 28,
        delay: -4.3,
    },
];

function BokehLights({ reducedMotion = false }: BokehLightsProps) {
    return (
        <div
            className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
            aria-hidden="true"
        >
            <style>{`
                @keyframes bokehFloat1 {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.35;
                    }
                    25% {
                        transform: translate(12px, -18px) scale(1.08);
                        opacity: 0.5;
                    }
                    50% {
                        transform: translate(-8px, 10px) scale(0.92);
                        opacity: 0.4;
                    }
                    75% {
                        transform: translate(15px, 8px) scale(1.05);
                        opacity: 0.45;
                    }
                }

                @keyframes bokehFloat2 {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.4;
                    }
                    20% {
                        transform: translate(-10px, 15px) scale(1.1);
                        opacity: 0.55;
                    }
                    45% {
                        transform: translate(18px, -12px) scale(0.95);
                        opacity: 0.38;
                    }
                    70% {
                        transform: translate(-5px, -8px) scale(1.03);
                        opacity: 0.48;
                    }
                }

                @keyframes bokehFloat3 {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.32;
                    }
                    30% {
                        transform: translate(8px, 20px) scale(1.12);
                        opacity: 0.52;
                    }
                    60% {
                        transform: translate(-15px, -5px) scale(0.9);
                        opacity: 0.36;
                    }
                    85% {
                        transform: translate(10px, -15px) scale(1.02);
                        opacity: 0.42;
                    }
                }

                @keyframes bokehPulse {
                    0%, 100% {
                        filter: brightness(1) saturate(1);
                    }
                    50% {
                        filter: brightness(1.15) saturate(1.1);
                    }
                }

                .bokeh-circle {
                    position: absolute;
                    border-radius: 50%;
                    will-change: transform, opacity;
                }

                .bokeh-animate-1 {
                    animation: bokehFloat1 12s ease-in-out infinite,
                               bokehPulse 8s ease-in-out infinite;
                }

                .bokeh-animate-2 {
                    animation: bokehFloat2 14s ease-in-out infinite,
                               bokehPulse 10s ease-in-out infinite;
                }

                .bokeh-animate-3 {
                    animation: bokehFloat3 16s ease-in-out infinite,
                               bokehPulse 12s ease-in-out infinite;
                }

                .bokeh-static {
                    animation: none !important;
                }
            `}</style>

            {BOKEH_CIRCLES.map((circle, index) => {
                const animationClass = reducedMotion
                    ? 'bokeh-static'
                    : `bokeh-animate-${(index % 3) + 1}`;

                return (
                    <div
                        key={`bokeh-${index}`}
                        className={`bokeh-circle ${animationClass}`}
                        style={{
                            width: circle.size,
                            height: circle.size,
                            top: circle.top,
                            bottom: circle.bottom,
                            left: circle.left,
                            right: circle.right,
                            background: `radial-gradient(circle at 30% 30%, ${circle.color}, transparent 70%)`,
                            filter: `blur(${circle.blur}px)`,
                            animationDelay: reducedMotion ? '0s' : `${circle.delay}s`,
                            opacity: reducedMotion ? 0.25 : undefined,
                        }}
                    />
                );
            })}

            {/* Subtle ambient glow overlay for warmth */}
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(
                        ellipse 120% 80% at 50% 100%,
                        rgba(255, 215, 0, 0.04) 0%,
                        rgba(255, 182, 193, 0.02) 40%,
                        transparent 70%
                    )`,
                    opacity: reducedMotion ? 0.5 : 0.7,
                }}
            />
        </div>
    );
}

export default memo(BokehLights);
