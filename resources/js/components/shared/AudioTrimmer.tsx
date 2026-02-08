import { useState, useRef, useEffect, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import { AudioLibraryPicker } from '@/components/shared/AudioLibraryPicker';
import { extractRegion } from '@/lib/audioEncoder';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { MEDIA_CONSTRAINTS } from '@/lib/constraints';
import type { AudioTrack } from '@/types/audio';

type AudioTrimmerProps = {
    onSave: (audioBlob: Blob, filename: string) => void;
    maxDurationSeconds?: number;
    showLibrary?: boolean;
    className?: string;
};

function FloatingNote({ delay, duration, left, note }: { delay: number; duration: number; left: number; note: string }) {
    return (
        <div
            className="pointer-events-none absolute bottom-0 animate-float-up text-rose-400/40"
            style={{
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                fontFamily: 'serif',
                fontSize: '1rem',
            }}
        >
            {note}
        </div>
    );
}

function MusicNoteIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
    );
}

function WaveformIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 12h2M6 8v8M10 5v14M14 8v8M18 10v4M22 12h-2" />
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

function ScissorsIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" />
            <line x1="14.47" y1="14.48" x2="20" y2="20" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" />
        </svg>
    );
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

function UploadIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
    );
}

function LibraryIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
        </svg>
    );
}

export function AudioTrimmer({
    onSave,
    maxDurationSeconds = 30,
    showLibrary = true,
    className,
}: AudioTrimmerProps) {
    const [file, setFile] = useState<File | null>(null);
    const [libraryTrack, setLibraryTrack] = useState<AudioTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [duration, setDuration] = useState(0);
    const [regionStart, setRegionStart] = useState(0);
    const [regionEnd, setRegionEnd] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [libraryOpen, setLibraryOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const regionsRef = useRef<RegionsPlugin | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const regionEndRef = useRef(regionEnd);

    const notes = ['♪', '♫', '♬', '♩'];
    const floatingNotes = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        delay: i * 1.5,
        duration: 6 + Math.random() * 4,
        left: 5 + (i * 12) + Math.random() * 8,
        note: notes[i % notes.length],
    }));

    useEffect(() => {
        return () => {
            wavesurferRef.current?.destroy();
            if (playIntervalRef.current) {
                clearInterval(playIntervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        regionEndRef.current = regionEnd;
    }, [regionEnd]);

    const initializeWavesurfer = useCallback(
        async (audioFile: File | string) => {
            if (!waveformRef.current) return;

            setIsLoading(true);
            setError(null);
            wavesurferRef.current?.destroy();

            const regions = RegionsPlugin.create();
            regionsRef.current = regions;

            const ws = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'rgba(251, 113, 133, 0.6)',
                progressColor: 'rgba(244, 63, 94, 0.9)',
                cursorColor: 'rgba(190, 18, 60, 0.8)',
                height: 100,
                barWidth: 2,
                barGap: 1,
                barRadius: 2,
                normalize: true,
                plugins: [regions],
            });

            wavesurferRef.current = ws;

            ws.on('ready', (dur) => {
                setIsLoading(false);
                setDuration(dur);

                const end = Math.min(dur, maxDurationSeconds);
                setRegionStart(0);
                setRegionEnd(end);

                regions.addRegion({
                    start: 0,
                    end: end,
                    color: 'transparent',
                    drag: true,
                    resize: true,
                });
            });

            regions.on('region-created', (region) => {
                const el = region.element;
                if (el) {
                    Object.assign(el.style, {
                        background: 'linear-gradient(90deg, rgba(251, 113, 133, 0.35) 0%, rgba(190, 50, 90, 0.08) 6%, rgba(190, 50, 90, 0.08) 94%, rgba(251, 113, 133, 0.35) 100%)',
                        borderRadius: '10px',
                        borderTop: '1px solid rgba(255, 180, 200, 0.5)',
                        borderBottom: '1px solid rgba(255, 180, 200, 0.5)',
                        boxShadow: 'inset 0 0 30px rgba(251, 113, 133, 0.12), 0 0 20px rgba(244, 63, 94, 0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
                    });
                    el.classList.add('audio-region-selection');

                    const handles = el.querySelectorAll('[part*="region-handle"]');
                    handles.forEach((handle, index) => {
                        const h = handle as HTMLElement;
                        const isLeft = index === 0;

                        Object.assign(h.style, {
                            width: '10px',
                            background: 'linear-gradient(180deg, rgba(255, 190, 210, 1) 0%, rgba(251, 113, 133, 1) 20%, rgba(225, 50, 90, 1) 50%, rgba(251, 113, 133, 1) 80%, rgba(255, 190, 210, 1) 100%)',
                            borderRadius: isLeft ? '6px 2px 2px 6px' : '2px 6px 6px 2px',
                            border: '1px solid rgba(255, 200, 220, 0.6)',
                            borderLeftWidth: isLeft ? '1px' : '0',
                            borderRightWidth: isLeft ? '0' : '1px',
                            opacity: '1',
                            boxShadow: '0 0 15px rgba(251, 113, 133, 1), 0 0 30px rgba(244, 63, 94, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.25)',
                            transition: 'all 0.2s ease',
                        });
                        h.classList.add('audio-region-handle');

                        h.addEventListener('mouseenter', () => {
                            h.style.width = '14px';
                            h.style.boxShadow = '0 0 20px rgba(251, 113, 133, 1), 0 0 40px rgba(244, 63, 94, 0.7), inset 0 0 15px rgba(255, 255, 255, 0.35)';
                        });
                        h.addEventListener('mouseleave', () => {
                            h.style.width = '10px';
                            h.style.boxShadow = '0 0 15px rgba(251, 113, 133, 1), 0 0 30px rgba(244, 63, 94, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.25)';
                        });
                    });
                }
            });

            ws.on('error', (err) => {
                setIsLoading(false);
                setError('Failed to decode audio. Please try a different file.');
                logger.error('Wavesurfer error:', err);
            });

            ws.on('play', () => setIsPlaying(true));
            ws.on('pause', () => setIsPlaying(false));
            ws.on('finish', () => setIsPlaying(false));

            regions.on('region-updated', (region) => {
                const start = region.start;
                let end = region.end;

                if (end - start > maxDurationSeconds) {
                    end = start + maxDurationSeconds;
                    region.setOptions({ end });
                }

                setRegionStart(start);
                setRegionEnd(end);
            });

            try {
                if (typeof audioFile === 'string') {
                    await ws.load(audioFile);
                } else {
                    await ws.loadBlob(audioFile);
                }
            } catch (err) {
                setIsLoading(false);
                setError('Failed to load audio file. Please try again.');
                logger.error('Load error:', err);
            }
        },
        [maxDurationSeconds]
    );

    useEffect(() => {
        if (file && waveformRef.current) {
            initializeWavesurfer(file);
        }
    }, [file, initializeWavesurfer]);

    const handleFileSelect = useCallback(
        (selectedFile: File) => {
            setError(null);

            if (!selectedFile.type.startsWith('audio/')) {
                setError('Please select an audio file');
                return;
            }

            const sizeMB = selectedFile.size / (1024 * 1024);
            if (sizeMB > MEDIA_CONSTRAINTS.AUDIO_MAX_SIZE_MB) {
                setError(`Audio file must be smaller than ${MEDIA_CONSTRAINTS.AUDIO_MAX_SIZE_MB}MB`);
                return;
            }

            setFile(selectedFile);
        },
        []
    );

    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = event.target.files?.[0];
            if (selectedFile) {
                handleFileSelect(selectedFile);
            }
        },
        [handleFileSelect]
    );

    const handleDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            setIsDragging(false);

            const selectedFile = event.dataTransfer.files[0];
            if (selectedFile) {
                handleFileSelect(selectedFile);
            }
        },
        [handleFileSelect]
    );

    const handleDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);
    }, []);

    const handleLibrarySelect = useCallback((track: AudioTrack) => {
        setFile(null);
        setLibraryTrack(track);
        initializeWavesurfer(track.url);
    }, [initializeWavesurfer]);

    const handlePlayPause = useCallback(() => {
        if (!wavesurferRef.current) return;

        if (playIntervalRef.current) {
            clearInterval(playIntervalRef.current);
            playIntervalRef.current = null;
        }

        if (isPlaying) {
            wavesurferRef.current.pause();
        } else {
            wavesurferRef.current.setTime(regionStart);
            wavesurferRef.current.play();

            playIntervalRef.current = setInterval(() => {
                if (wavesurferRef.current) {
                    const currentTime = wavesurferRef.current.getCurrentTime();
                    if (currentTime >= regionEndRef.current) {
                        wavesurferRef.current.pause();
                        if (playIntervalRef.current) {
                            clearInterval(playIntervalRef.current);
                            playIntervalRef.current = null;
                        }
                    }
                }
            }, 50);
        }
    }, [isPlaying, regionStart]);

    const handleSave = useCallback(async () => {
        if (!file && !libraryTrack) return;

        setIsProcessing(true);
        setError(null);

        try {
            let audioSource: File | string;
            let filename: string;

            if (file) {
                audioSource = file;
                filename = file.name.replace(/\.[^/.]+$/, '') + '_trimmed.mp3';
            } else if (libraryTrack) {
                audioSource = libraryTrack.url;
                filename = libraryTrack.name.toLowerCase().replace(/\s+/g, '-') + '_trimmed.mp3';
            } else {
                return;
            }

            const trimmedBlob = await extractRegion(audioSource, regionStart, regionEnd);
            onSave(trimmedBlob, filename);
        } catch (err) {
            setError('Failed to process audio. Please try again.');
            logger.error('Audio processing error:', err);
        } finally {
            setIsProcessing(false);
        }
    }, [file, libraryTrack, regionStart, regionEnd, onSave]);

    const handleRemove = useCallback(() => {
        if (playIntervalRef.current) {
            clearInterval(playIntervalRef.current);
            playIntervalRef.current = null;
        }
        wavesurferRef.current?.destroy();
        wavesurferRef.current = null;
        regionsRef.current = null;
        setFile(null);
        setLibraryTrack(null);
        setDuration(0);
        setRegionStart(0);
        setRegionEnd(0);
        setError(null);
        setIsPlaying(false);
        setIsLoading(false);
    }, []);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const selectedDuration = regionEnd - regionStart;
    const hasAudio = file || libraryTrack;
    const audioName = file?.name || libraryTrack?.name || '';

    const getAriaStatus = () => {
        if (isLoading) return 'Loading audio waveform';
        if (isProcessing) return 'Processing audio clip';
        if (error) return `Error: ${error}`;
        if (hasAudio) return `Audio loaded. ${formatTime(selectedDuration)} selected for trimming`;
        return '';
    };

    if (!hasAudio) {
        return (
            <div className={cn('space-y-4', className)} ref={containerRef}>
                <div aria-live="polite" aria-atomic="true" className="sr-only">
                    {getAriaStatus()}
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleInputChange}
                    className="hidden"
                />

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className={cn(
                        'relative flex w-full flex-col items-center justify-center rounded-2xl py-12 px-6',
                        'border-2 border-dashed transition-all duration-500',
                        'overflow-hidden group',
                        isDragging
                            ? 'border-rose-400 bg-rose-500/10'
                            : 'border-white/10 bg-white/[0.02] hover:border-rose-400/50 hover:bg-rose-500/5'
                    )}
                >
                    <div
                        className={cn(
                            'absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-pink-500/5',
                            'opacity-0 transition-opacity duration-500',
                            (isHovering || isDragging) && 'opacity-100'
                        )}
                    />

                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {(isHovering || isDragging) &&
                            floatingNotes.map((note) => (
                                <FloatingNote
                                    key={note.id}
                                    delay={note.delay}
                                    duration={note.duration}
                                    left={note.left}
                                    note={note.note}
                                />
                            ))}
                    </div>

                    <div
                        className={cn(
                            'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500',
                            'shadow-[inset_0_0_60px_rgba(244,63,94,0.1)]',
                            (isHovering || isDragging) && 'opacity-100'
                        )}
                    />

                    <div className="relative z-10 flex flex-col items-center">
                        <div
                            className={cn(
                                'mb-4 h-16 w-16 rounded-full flex items-center justify-center',
                                'bg-gradient-to-br from-rose-500/20 to-pink-500/20',
                                'border border-rose-500/20',
                                'transition-all duration-500',
                                'group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-rose-500/20'
                            )}
                        >
                            <WaveformIcon className="h-7 w-7 text-rose-400" />
                        </div>

                        <p
                            className="text-rose-300/80 text-lg mb-1"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            Add your song
                        </p>

                        <p className="text-white/40 text-xs">
                            {isDragging ? 'Drop to upload' : 'Tap or drag & drop'}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-white/30 text-xs">
                            <MusicNoteIcon className="h-3 w-3" />
                            <span>Max {maxDurationSeconds}s clip • {MEDIA_CONSTRAINTS.AUDIO_MAX_SIZE_MB}MB limit</span>
                        </div>
                    </div>
                </button>

                {showLibrary && (
                    <button
                        type="button"
                        onClick={() => setLibraryOpen(true)}
                        className={cn(
                            'w-full flex items-center justify-center gap-2 h-12 rounded-xl',
                            'bg-white/5 border border-white/10 text-white/60',
                            'hover:bg-white/10 hover:text-white/80 hover:border-rose-500/30',
                            'transition-all duration-300',
                            'font-medium text-sm'
                        )}
                    >
                        <LibraryIcon className="h-4 w-4" />
                        Browse royalty-free music
                    </button>
                )}

                {error && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                        <MusicNoteIcon className="h-4 w-4 text-rose-400 flex-shrink-0" />
                        <p className="text-rose-300 text-sm">{error}</p>
                    </div>
                )}

                <AudioLibraryPicker
                    open={libraryOpen}
                    onOpenChange={setLibraryOpen}
                    onSelect={handleLibrarySelect}
                />
            </div>
        );
    }

    return (
        <div className={cn('space-y-4', className)} ref={containerRef}>
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {getAriaStatus()}
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0607]">
                <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none" />

                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center bg-rose-500/20 border border-rose-500/30 flex-shrink-0">
                                <MusicNoteIcon className="h-5 w-5 text-rose-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-white/80 text-sm font-medium truncate">
                                    {audioName}
                                </p>
                                <p className="text-white/40 text-xs">
                                    {formatTime(duration)} total{libraryTrack && ' • Library track'}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className={cn(
                                'h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0',
                                'bg-white/5 border border-white/10 text-white/50',
                                'hover:bg-rose-500/20 hover:border-rose-500/30 hover:text-rose-300',
                                'transition-all duration-300'
                            )}
                            aria-label="Remove audio"
                        >
                            <XIcon className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="relative mb-4">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl z-10">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="h-8 w-8 rounded-full border-2 border-rose-500/30 border-t-rose-500 animate-spin" />
                                    <p
                                        className="text-rose-300/60 text-xs"
                                        style={{ fontFamily: "'Dancing Script', cursive" }}
                                    >
                                        Loading waveform...
                                    </p>
                                </div>
                            </div>
                        )}

                        <div
                            ref={waveformRef}
                            className={cn(
                                'rounded-xl bg-black/40 overflow-hidden',
                                '[&_wave]:!overflow-hidden',
                                'shadow-[0_0_30px_rgba(244,63,94,0.1)]'
                            )}
                            style={{ minHeight: '100px' }}
                        />

                        <div className="absolute inset-0 pointer-events-none rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
                    </div>

                    <div className="flex items-center justify-between mb-4 px-1">
                        <span className="text-white/50 text-xs font-mono">
                            {formatTime(regionStart)}
                        </span>
                        <div className="flex items-center gap-2">
                            <span
                                className="text-rose-300 text-sm"
                                style={{ fontFamily: "'Dancing Script', cursive" }}
                            >
                                {formatTime(selectedDuration)} selected
                            </span>
                            {selectedDuration > maxDurationSeconds && (
                                <span className="text-rose-400 text-xs">
                                    (max {maxDurationSeconds}s)
                                </span>
                            )}
                        </div>
                        <span className="text-white/50 text-xs font-mono">
                            {formatTime(regionEnd)}
                        </span>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handlePlayPause}
                            disabled={isLoading}
                            className={cn(
                                'flex-1 flex items-center justify-center gap-2 h-12 rounded-xl',
                                'bg-white/5 border border-white/10 text-white/70',
                                'hover:bg-white/10 hover:text-white/90',
                                'disabled:opacity-50 disabled:cursor-not-allowed',
                                'transition-all duration-300',
                                'font-medium text-sm'
                            )}
                        >
                            {isPlaying ? (
                                <>
                                    <PauseIcon className="h-5 w-5" />
                                    Pause
                                </>
                            ) : (
                                <>
                                    <PlayIcon className="h-5 w-5" />
                                    Preview
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isProcessing || selectedDuration < 1 || isLoading}
                            className={cn(
                                'flex-1 flex items-center justify-center gap-2 h-12 rounded-xl',
                                'bg-gradient-to-r from-rose-500 to-pink-500 text-white',
                                'hover:from-rose-400 hover:to-pink-400',
                                'shadow-lg shadow-rose-500/25',
                                'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
                                'transition-all duration-300',
                                'font-medium text-sm',
                                isProcessing && 'animate-pulse'
                            )}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <ScissorsIcon className="h-4 w-4" />
                                    Save clip
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <MusicNoteIcon className="h-4 w-4 text-rose-400 flex-shrink-0" />
                    <p className="text-rose-300 text-sm">{error}</p>
                </div>
            )}
        </div>
    );
}

export type { AudioTrimmerProps };
