import { memo, useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';

type DustParticlesProps = {
    color?: string;
    count?: number;
    reducedMotion?: boolean;
};

function DustParticles({
    color = '#d4af37',
    count = 40,
    reducedMotion = false,
}: DustParticlesProps) {
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
                      value: 8,
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
                      value: { min: 0.3, max: 0.5 },
                  },
                  size: {
                      value: { min: 1, max: 2.5 },
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
                      value: count,
                      density: {
                          enable: true,
                          width: 1920,
                          height: 1080,
                      },
                  },
                  color: {
                      value: [color, '#ffb84d', '#ffd699'],
                  },
                  shape: {
                      type: 'circle',
                  },
                  opacity: {
                      value: { min: 0.2, max: 0.6 },
                  },
                  size: {
                      value: { min: 0.8, max: 3 },
                  },
                  move: {
                      enable: true,
                      speed: { min: 0.2, max: 0.5 },
                      direction: 'top',
                      straight: false,
                      outModes: {
                          default: 'out',
                          top: 'out',
                          bottom: 'out',
                      },
                      random: true,
                  },
                  wobble: {
                      enable: true,
                      distance: 10,
                      speed: { min: 1, max: 3 },
                  },
                  shadow: {
                      enable: true,
                      color: color,
                      blur: 4,
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
            <Particles id="dust-particles" className="h-full w-full" options={options} />
        </div>
    );
}

export default memo(DustParticles);
