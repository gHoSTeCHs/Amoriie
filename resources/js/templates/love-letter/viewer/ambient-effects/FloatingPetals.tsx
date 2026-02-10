import { memo, useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';

type FloatingPetalsProps = {
    color?: string;
    reducedMotion?: boolean;
};

function FloatingPetals({
    color = '#ffb6c1',
    reducedMotion = false,
}: FloatingPetalsProps) {
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
                      value: 5,
                      density: {
                          enable: false,
                      },
                  },
                  color: {
                      value: color,
                  },
                  shape: {
                      type: 'char',
                      options: {
                          char: {
                              value: ['🌸', '🌷', '💮'],
                              font: 'serif',
                              fill: true,
                          },
                      },
                  },
                  opacity: {
                      value: { min: 0.5, max: 0.7 },
                  },
                  size: {
                      value: { min: 10, max: 16 },
                  },
                  move: {
                      enable: false,
                  },
                  rotate: {
                      value: { min: 0, max: 360 },
                      animation: {
                          enable: false,
                      },
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
                      value: 15,
                      density: {
                          enable: true,
                          width: 1920,
                          height: 1080,
                      },
                  },
                  color: {
                      value: [color, '#ffc0cb', '#ff69b4', '#db7093'],
                  },
                  shape: {
                      type: 'char',
                      options: {
                          char: {
                              value: ['🌸', '🌷', '💮', '✿'],
                              font: 'serif',
                              fill: true,
                          },
                      },
                  },
                  opacity: {
                      value: { min: 0.5, max: 0.8 },
                  },
                  size: {
                      value: { min: 8, max: 18 },
                  },
                  move: {
                      enable: true,
                      speed: { min: 0.5, max: 1.0 },
                      direction: 'bottom',
                      straight: false,
                      outModes: {
                          default: 'out',
                          top: 'out',
                          bottom: 'out',
                          left: 'out',
                          right: 'out',
                      },
                      random: true,
                      drift: 2,
                  },
                  rotate: {
                      value: { min: 0, max: 360 },
                      direction: 'random',
                      animation: {
                          enable: true,
                          speed: 3,
                          sync: false,
                      },
                  },
                  tilt: {
                      enable: true,
                      value: { min: -15, max: 15 },
                      direction: 'random',
                      animation: {
                          enable: true,
                          speed: 5,
                          sync: false,
                      },
                  },
                  wobble: {
                      enable: true,
                      distance: 15,
                      speed: { min: 2, max: 5 },
                  },
                  shadow: {
                      enable: true,
                      color: '#ff69b4',
                      blur: 6,
                      offset: {
                          x: 2,
                          y: 2,
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
                id="floating-petals-particles"
                className="h-full w-full"
                options={options}
            />
        </div>
    );
}

export default memo(FloatingPetals);
