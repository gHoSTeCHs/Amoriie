import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Howl } from 'howler';

import type { LetterTheme } from '../themes';

export type SoundKey =
    | 'envelope_open'
    | 'seal_break'
    | 'text_reveal'
    | 'ambient';

type SoundCache = Partial<Record<SoundKey, Howl>>;

export type UseViewerSoundManagerOptions = {
    theme: LetterTheme;
    enabled: boolean;
};

export type UseViewerSoundManagerReturn = {
    isEnabled: boolean;
    isLoading: boolean;
    isAmbientPlaying: boolean;
    setEnabled: (enabled: boolean) => void;
    playSound: (key: SoundKey) => void;
    stopSound: (key: SoundKey) => void;
    stopAllSounds: () => void;
    startAmbient: () => void;
    stopAmbient: () => void;
};

function createHowl(
    src: string | undefined,
    loop: boolean = false,
): Howl | null {
    if (!src) return null;

    try {
        return new Howl({
            src: [src],
            preload: true,
            volume: loop ? 0.3 : 0.1,
            loop,
            html5: true,
        });
    } catch {
        return null;
    }
}

export function useViewerSoundManager(
    options: UseViewerSoundManagerOptions,
): UseViewerSoundManagerReturn {
    const { theme, enabled: initialEnabled } = options;

    const [isEnabled, setIsEnabled] = useState(initialEnabled);
    const [isLoading, setIsLoading] = useState(false);
    const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

    const soundsRef = useRef<SoundCache>({});
    const currentThemeIdRef = useRef<string | null>(null);
    const loadingCountRef = useRef({ total: 0, loaded: 0 });

    useEffect(() => {
        if (currentThemeIdRef.current === theme.id) {
            return;
        }

        currentThemeIdRef.current = theme.id;

        Object.values(soundsRef.current).forEach((howl) => howl?.unload());
        soundsRef.current = {};

        const soundKeys: SoundKey[] = ['seal_break'];
        const soundsToLoad = soundKeys.filter((key) => theme.sounds[key]);
        const totalSounds = soundsToLoad.length;

        if (totalSounds === 0) {
            setIsLoading(false);
            return;
        }

        loadingCountRef.current = { total: totalSounds, loaded: 0 };
        setIsLoading(true);

        soundsToLoad.forEach((key) => {
            const src = theme.sounds[key];
            if (!src) {
                loadingCountRef.current.loaded++;
                return;
            }

            const isAmbient = key === 'ambient';
            const howl = createHowl(src, isAmbient);

            if (howl) {
                const handleLoadComplete = () => {
                    loadingCountRef.current.loaded++;
                    if (
                        loadingCountRef.current.loaded >=
                        loadingCountRef.current.total
                    ) {
                        setIsLoading(false);
                    }
                };

                howl.on('load', handleLoadComplete);
                howl.on('loaderror', handleLoadComplete);

                soundsRef.current[key] = howl;
            } else {
                loadingCountRef.current.loaded++;
                if (
                    loadingCountRef.current.loaded >=
                    loadingCountRef.current.total
                ) {
                    setIsLoading(false);
                }
            }
        });
    }, [theme.id, theme.sounds]);

    useEffect(() => {
        return () => {
            Object.values(soundsRef.current).forEach((howl) => howl?.unload());
            soundsRef.current = {};
            currentThemeIdRef.current = null;
        };
    }, []);

    const playSound = useCallback(
        (key: SoundKey) => {
            if (!isEnabled) return;

            const howl = soundsRef.current[key];
            if (howl && !howl.playing()) {
                howl.play();
            }
        },
        [isEnabled],
    );

    const stopSound = useCallback((key: SoundKey) => {
        const howl = soundsRef.current[key];
        if (howl) {
            howl.stop();
        }
    }, []);

    const stopAllSounds = useCallback(() => {
        Object.values(soundsRef.current).forEach((howl) => {
            if (howl) howl.stop();
        });
        setIsAmbientPlaying(false);
    }, []);

    const startAmbient = useCallback(() => {
        if (!isEnabled) return;

        const ambient = soundsRef.current.ambient;
        if (ambient && !ambient.playing()) {
            ambient.play();
            setIsAmbientPlaying(true);
        }
    }, [isEnabled]);

    const stopAmbient = useCallback(() => {
        const ambient = soundsRef.current.ambient;
        if (ambient) {
            ambient.stop();
            setIsAmbientPlaying(false);
        }
    }, []);

    const handleSetEnabled = useCallback(
        (enabled: boolean) => {
            setIsEnabled(enabled);
            if (!enabled) {
                stopAllSounds();
            }
        },
        [stopAllSounds],
    );

    return useMemo(
        () => ({
            isEnabled,
            isLoading,
            isAmbientPlaying,
            setEnabled: handleSetEnabled,
            playSound,
            stopSound,
            stopAllSounds,
            startAmbient,
            stopAmbient,
        }),
        [
            isEnabled,
            isLoading,
            isAmbientPlaying,
            handleSetEnabled,
            playSound,
            stopSound,
            stopAllSounds,
            startAmbient,
            stopAmbient,
        ],
    );
}
