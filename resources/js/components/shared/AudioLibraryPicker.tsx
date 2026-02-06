import { useState, useRef, useEffect, useCallback } from 'react';
import { index as fetchAudioLibrary } from '@/actions/App/Http/Controllers/AudioLibraryController';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import type { AudioTrack, AudioLibraryResponse } from '@/types/audio';

type AudioLibraryPickerProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (track: AudioTrack) => void;
};

function MusicNoteIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
    );
}

function PlayIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
        </svg>
    );
}

function PauseIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
    );
}

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function HeartIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );
}

const moodConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    gentle: { label: 'Gentle', color: 'text-rose-300', bgColor: 'bg-rose-500/20' },
    nostalgic: { label: 'Nostalgic', color: 'text-amber-300', bgColor: 'bg-amber-500/20' },
    playful: { label: 'Playful', color: 'text-pink-300', bgColor: 'bg-pink-500/20' },
    emotional: { label: 'Emotional', color: 'text-purple-300', bgColor: 'bg-purple-500/20' },
};

function TrackItem({
    track,
    isPlaying,
    onPlay,
    onSelect,
}: {
    track: AudioTrack;
    isPlaying: boolean;
    onPlay: () => void;
    onSelect: () => void;
}) {
    const mood = moodConfig[track.mood] || moodConfig.gentle;

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl',
                'bg-gradient-to-r from-white/[0.03] to-white/[0.01]',
                'border border-white/5',
                'transition-all duration-300',
                'hover:border-rose-500/30 hover:bg-white/[0.04]',
                isPlaying && 'border-rose-500/40 bg-rose-500/5'
            )}
        >
            <div
                className={cn(
                    'absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/5 to-rose-500/0',
                    'opacity-0 transition-opacity duration-500',
                    'group-hover:opacity-100',
                    isPlaying && 'opacity-100'
                )}
            />

            <div className="relative flex items-center gap-3 p-3">
                <button
                    type="button"
                    onClick={onPlay}
                    className={cn(
                        'relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full',
                        'bg-gradient-to-br from-rose-500/20 to-pink-500/20',
                        'border border-rose-500/30',
                        'transition-all duration-300',
                        'hover:scale-105 hover:shadow-lg hover:shadow-rose-500/20',
                        'active:scale-95',
                        isPlaying && 'from-rose-500 to-pink-500 border-rose-400'
                    )}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? (
                        <PauseIcon className="h-5 w-5 text-white" />
                    ) : (
                        <PlayIcon className="h-5 w-5 text-rose-300 ml-0.5" />
                    )}

                    {isPlaying && (
                        <span className="absolute inset-0 rounded-full animate-ping bg-rose-500/30" />
                    )}
                </button>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-white/90">
                            {track.name}
                        </p>
                        <span
                            className={cn(
                                'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                                mood.bgColor,
                                mood.color
                            )}
                        >
                            {mood.label}
                        </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                        {track.artist && (
                            <span className="truncate text-xs text-white/40">
                                {track.artist}
                            </span>
                        )}
                        <span className="text-white/20">·</span>
                        <span className="text-xs font-mono text-white/40">
                            {track.formattedDuration}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onSelect}
                    className={cn(
                        'flex h-10 items-center gap-1.5 rounded-xl px-4',
                        'bg-gradient-to-r from-rose-500 to-pink-500 text-white',
                        'text-sm font-medium',
                        'shadow-lg shadow-rose-500/25',
                        'transition-all duration-300',
                        'hover:from-rose-400 hover:to-pink-400 hover:shadow-rose-500/40',
                        'active:scale-95'
                    )}
                >
                    <CheckIcon className="h-4 w-4" />
                    <span>Use</span>
                </button>
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3"
                    style={{ animationDelay: `${i * 100}ms` }}
                >
                    <div className="h-11 w-11 rounded-full bg-white/5 animate-pulse" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 rounded bg-white/5 animate-pulse" />
                        <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
                    </div>
                    <div className="h-10 w-20 rounded-xl bg-white/5 animate-pulse" />
                </div>
            ))}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20">
                <MusicNoteIcon className="h-8 w-8 text-rose-400/60" />
            </div>
            <p
                className="text-rose-300/80 text-lg mb-1"
                style={{ fontFamily: "'Dancing Script', cursive" }}
            >
                No tracks available
            </p>
            <p className="text-white/40 text-sm">
                Check back later for romantic melodies
            </p>
        </div>
    );
}

const scrollbarStyles = `
    .audio-library-scroll::-webkit-scrollbar {
        width: 4px;
    }
    .audio-library-scroll::-webkit-scrollbar-track {
        background: transparent;
    }
    .audio-library-scroll::-webkit-scrollbar-thumb {
        background: rgba(251, 113, 133, 0.3);
        border-radius: 4px;
    }
    .audio-library-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(251, 113, 133, 0.5);
    }
`;

type AudioLibraryContentProps = {
    tracks: AudioTrack[];
    isLoading: boolean;
    error: string | null;
    playingTrackId: number | null;
    onPlay: (track: AudioTrack) => void;
    onSelect: (track: AudioTrack) => void;
    isMobile: boolean;
};

function AudioLibraryContent({
    tracks,
    isLoading,
    error,
    playingTrackId,
    onPlay,
    onSelect,
    isMobile,
}: AudioLibraryContentProps) {
    return (
        <>
            <style>{scrollbarStyles}</style>
            <div className={cn(
                'audio-library-scroll overflow-y-auto pr-1 -mr-1',
                isMobile ? 'max-h-[60vh] pb-6' : 'max-h-[50vh]'
            )}>
                <div className="space-y-2">
                    {isLoading && <LoadingSkeleton />}

                    {!isLoading && error && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                            <MusicNoteIcon className="h-4 w-4 text-rose-400 flex-shrink-0" />
                            <p className="text-rose-300 text-sm">{error}</p>
                        </div>
                    )}

                    {!isLoading && !error && tracks.length === 0 && <EmptyState />}

                    {!isLoading && !error && tracks.map((track) => (
                        <TrackItem
                            key={track.id}
                            track={track}
                            isPlaying={playingTrackId === track.id}
                            onPlay={() => onPlay(track)}
                            onSelect={() => onSelect(track)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

function PickerHeader({ isMobile }: { isMobile: boolean }) {
    const HeaderWrapper = isMobile ? SheetHeader : DialogHeader;
    const Title = isMobile ? SheetTitle : DialogTitle;
    const Description = isMobile ? SheetDescription : DialogDescription;

    return (
        <HeaderWrapper className={cn(isMobile ? 'px-0 pb-4' : 'pb-4')}>
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/30">
                    <HeartIcon className="h-5 w-5 text-rose-400" />
                </div>
                <div>
                    <Title
                        className="text-lg text-white/90"
                        style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                        Romantic Melodies
                    </Title>
                    <Description className="text-white/40 text-xs">
                        Royalty-free music for your love story
                    </Description>
                </div>
            </div>
        </HeaderWrapper>
    );
}

export function AudioLibraryPicker({
    open,
    onOpenChange,
    onSelect,
}: AudioLibraryPickerProps) {
    const isMobile = useIsMobile();
    const [tracks, setTracks] = useState<AudioTrack[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (open) {
            loadTracks();
        } else {
            stopAudio();
        }
    }, [open]);

    useEffect(() => {
        return () => {
            stopAudio();
        };
    }, []);

    const loadTracks = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(fetchAudioLibrary.url());
            if (!response.ok) {
                // console.log(response)

                throw new Error('Failed to load tracks');
            }
            const data: AudioLibraryResponse = await response.json();
            setTracks(data.tracks);
        } catch (err) {
            setError('Unable to load music library');
            console.error('Error loading audio library:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current = null;
        }
        setPlayingTrackId(null);
    }, []);

    const handlePlay = useCallback((track: AudioTrack) => {
        if (playingTrackId === track.id) {
            stopAudio();
            return;
        }

        stopAudio();

        const audio = new Audio(track.url);
        audioRef.current = audio;

        audio.addEventListener('ended', () => {
            setPlayingTrackId(null);
        });

        audio.addEventListener('error', () => {
            setPlayingTrackId(null);
        });

        audio.play().then(() => {
            setPlayingTrackId(track.id);
        }).catch(() => {
            setPlayingTrackId(null);
        });
    }, [playingTrackId, stopAudio]);

    const handleSelect = useCallback((track: AudioTrack) => {
        stopAudio();
        onSelect(track);
        onOpenChange(false);
    }, [onSelect, onOpenChange, stopAudio]);

    const contentProps = {
        tracks,
        isLoading,
        error,
        playingTrackId,
        onPlay: handlePlay,
        onSelect: handleSelect,
        isMobile,
    };

    const backgroundEffects = (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 via-transparent to-transparent" />
            <div className="absolute top-0 left-1/4 h-32 w-32 rounded-full bg-rose-500/10 blur-3xl" />
            <div className="absolute top-0 right-1/4 h-24 w-24 rounded-full bg-pink-500/10 blur-3xl" />
        </div>
    );

    if (isMobile) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent
                    side="bottom"
                    className={cn(
                        'max-h-[85vh] rounded-t-3xl border-t border-white/10',
                        'bg-[#0c0607]',
                        '[&>button]:top-4 [&>button]:right-4 [&>button]:text-white/50 [&>button]:hover:text-white/80'
                    )}
                >
                    {backgroundEffects}
                    <div className="relative">
                        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-white/20" />
                        <PickerHeader isMobile={true} />
                        <AudioLibraryContent {...contentProps} />
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    'max-w-lg rounded-2xl border border-white/10',
                    'bg-[#0c0607] p-6',
                    '[&>button]:top-4 [&>button]:right-4 [&>button]:text-white/50 [&>button]:hover:text-white/80'
                )}
            >
                {backgroundEffects}
                <div className="relative">
                    <PickerHeader isMobile={false} />
                    <AudioLibraryContent {...contentProps} />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export type { AudioLibraryPickerProps };
