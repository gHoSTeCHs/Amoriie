import { useCallback, useEffect, useRef, useState } from 'react';

export type UseAudioPlayerOptions = {
    src: string | null;
    loop?: boolean;
    volume?: number;
    autoPlay?: boolean;
};

export type UseAudioPlayerReturn = {
    isPlaying: boolean;
    isReady: boolean;
    isMuted: boolean;
    duration: number;
    currentTime: number;
    error: Error | null;
    play: () => Promise<void>;
    pause: () => void;
    toggle: () => Promise<void>;
    toggleMute: () => void;
    seek: (time: number) => void;
};

export function useAudioPlayer(options: UseAudioPlayerOptions): UseAudioPlayerReturn {
    const { src, loop = true, volume = 0.7, autoPlay = false } = options;

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!src) {
            return;
        }

        const audio = new Audio(src);
        audio.loop = loop;
        audio.volume = volume;
        audioRef.current = audio;

        const handleCanPlay = () => {
            setIsReady(true);
            setDuration(audio.duration);
            if (autoPlay) {
                audio.play().catch(() => {
                    /** Browser blocked autoplay - user must interact first */
                });
            }
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            if (!loop) {
                setIsPlaying(false);
            }
        };

        const handleError = () => {
            setError(new Error('Failed to load audio'));
            setIsReady(false);
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.pause();
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audioRef.current = null;
        };
    }, [src, loop, volume, autoPlay]);

    const play = useCallback(async () => {
        if (!audioRef.current || !isReady) return;
        try {
            await audioRef.current.play();
        } catch {
            setError(new Error('Playback failed - user interaction required'));
        }
    }, [isReady]);

    const pause = useCallback(() => {
        if (!audioRef.current) return;
        audioRef.current.pause();
    }, []);

    const toggle = useCallback(async () => {
        if (isPlaying) {
            pause();
        } else {
            await play();
        }
    }, [isPlaying, play, pause]);

    const toggleMute = useCallback(() => {
        if (!audioRef.current) return;
        const newMuted = !isMuted;
        audioRef.current.muted = newMuted;
        setIsMuted(newMuted);
    }, [isMuted]);

    const seek = useCallback((time: number) => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
    }, [duration]);

    return {
        isPlaying,
        isReady,
        isMuted,
        duration,
        currentTime,
        error,
        play,
        pause,
        toggle,
        toggleMute,
        seek,
    };
}
