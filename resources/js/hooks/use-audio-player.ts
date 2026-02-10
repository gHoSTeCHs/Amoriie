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
    const isCleanedUpRef = useRef(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        isCleanedUpRef.current = false;

        if (!src) {
            setIsReady(false);
            setIsPlaying(false);
            setDuration(0);
            setCurrentTime(0);
            setError(null);
            return;
        }

        const audio = new Audio(src);
        audio.loop = loop;
        audio.volume = volume;
        audio.preload = 'auto';
        audioRef.current = audio;

        const handleCanPlay = () => {
            if (isCleanedUpRef.current) return;
            setIsReady(true);
            setDuration(audio.duration);
            if (autoPlay) {
                audio.play().catch(() => {});
            }
        };

        const handleTimeUpdate = () => {
            if (isCleanedUpRef.current) return;
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            if (isCleanedUpRef.current) return;
            if (!loop) {
                setIsPlaying(false);
            }
        };

        const handleError = () => {
            if (isCleanedUpRef.current) return;
            setError(new Error('Failed to load audio'));
            setIsReady(false);
        };

        const handlePlay = () => {
            if (isCleanedUpRef.current) return;
            setIsPlaying(true);
        };

        const handlePause = () => {
            if (isCleanedUpRef.current) return;
            setIsPlaying(false);
        };

        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            isCleanedUpRef.current = true;
            audio.pause();
            audio.src = '';
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
        const audio = audioRef.current;
        if (!audio || !isReady || isCleanedUpRef.current) return;

        try {
            await audio.play();
        } catch {
            if (!isCleanedUpRef.current) {
                setError(new Error('Playback failed - user interaction required'));
            }
        }
    }, [isReady]);

    const pause = useCallback(() => {
        const audio = audioRef.current;
        if (!audio || isCleanedUpRef.current) return;
        audio.pause();
    }, []);

    const toggle = useCallback(async () => {
        if (isPlaying) {
            pause();
        } else {
            await play();
        }
    }, [isPlaying, play, pause]);

    const toggleMute = useCallback(() => {
        const audio = audioRef.current;
        if (!audio || isCleanedUpRef.current) return;

        const newMuted = !isMuted;
        audio.muted = newMuted;
        setIsMuted(newMuted);
    }, [isMuted]);

    const seek = useCallback(
        (time: number) => {
            const audio = audioRef.current;
            if (!audio || isCleanedUpRef.current) return;
            audio.currentTime = Math.max(0, Math.min(time, duration));
        },
        [duration]
    );

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
