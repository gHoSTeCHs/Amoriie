import { memo, useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';

type GoldSparkleProps = {
    color?: string;
    reducedMotion?: boolean;
};

function GoldSparkle({
    color = '#d4af37',
    reducedMotion = false,
}: GoldSparkleProps) {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options: ISourceOptions = reducedMotion
        ? {
              fullScreen: false,
              fpsLimit: 30,
              particles: {
                  number: {
                      value: 6,
                      density: {
                          enable: false,
                      },
                  },
                  color: {
                      value: color,
                  },
                  shape: {
                      type: 'circle',
                  },
                  opacity: {
                      value: { min: 0.4, max: 0.6 },
                  },
                  size: {
                      value: { min: 2, max: 4 },
                  },
                  move: {
                      enable: false,
                  },
              },
              detectRetina: true,
              background: {
                  color: 'transparent',
              },
          }
        : {
              fullScreen: false,
              fpsLimit: 60,
              particles: {
                  number: {
                      value: 25,
                      density: {
                          enable: true,
                          width: 1920,
                          height: 1080,
                      },
                  },
                  color: {
                      value: [color, '#ffd700', '#ffe066'],
                  },
                  shape: {
                      type: 'circle',
                  },
                  opacity: {
                      value: { min: 0.3, max: 0.9 },
                      animation: {
                          enable: true,
                          speed: 0.8,
                          startValue: 'random',
                          sync: false,
                          destroy: 'none',
                          mode: 'random',
                      },
                  },
                  size: {
                      value: { min: 2, max: 5 },
                      animation: {
                          enable: true,
                          speed: 1.5,
                          startValue: 'random',
                          sync: false,
                          destroy: 'none',
                          mode: 'random',
                      },
                  },
                  move: {
                      enable: true,
                      speed: { min: 0.1, max: 0.3 },
                      direction: 'none',
                      straight: false,
                      outModes: {
                          default: 'bounce',
                      },
                      random: true,
                  },
                  twinkle: {
                      particles: {
                          enable: true,
                          frequency: 0.08,
                          opacity: 1,
                          color: {
                              value: '#ffffff',
                          },
                      },
                  },
                  shadow: {
                      enable: true,
                      color: '#ffd700',
                      blur: 8,
                      offset: {
                          x: 0,
                          y: 0,
                      },
                  },
              },
              detectRetina: true,
              background: {
                  color: 'transparent',
              },
              interactivity: {
                  events: {
                      onHover: {
                          enable: false,
                      },
                      onClick: {
                          enable: false,
                      },
                  },
              },
          };

    if (!init) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-10" aria-hidden="true">
            <Particles
                id="gold-sparkle-particles"
                className="h-full w-full"
                options={options}
            />
        </div>
    );
}

export default memo(GoldSparkle);
