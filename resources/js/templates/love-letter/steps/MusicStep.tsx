import { Music, Check, Volume2 } from 'lucide-react';

import { AudioTrimmer } from '@/components/shared/AudioTrimmer';
import { cn } from '@/lib/utils';
import { useLoveLetterCustomizations } from '../hooks/use-love-letter-customizations';

export function MusicStep() {
    const { customizations, setAudio } = useLoveLetterCustomizations();

    function handleAudioSave(audioBlob: Blob, filename: string) {
        const previewUrl = URL.createObjectURL(audioBlob);
        setAudio({
            background_music: previewUrl,
            trimmed_blob: audioBlob,
            filename,
        });
    }

    const hasMusic = customizations.audio.background_music !== null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 ring-1 ring-rose-500/30">
                    <Music className="h-4 w-4 text-rose-400" />
                </div>
                <h3 className="font-serif text-lg tracking-wide text-white">
                    Background Music
                </h3>
            </div>

            <p className="font-serif text-sm leading-relaxed text-stone-400">
                Set the mood with a gentle melody. Upload your own music or choose
                from our curated royalty-free collection.
            </p>

            {hasMusic ? (
                <div className="space-y-4">
                    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-5">
                        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />

                        <div className="relative flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/30">
                                <Check className="h-6 w-6 text-emerald-400" strokeWidth={2.5} />
                            </div>
                            <div className="flex-1">
                                <p className="font-serif text-base font-medium tracking-wide text-white">
                                    Music added!
                                </p>
                                <div className="mt-0.5 flex items-center gap-1.5 text-sm text-emerald-300/70">
                                    <Volume2 className="h-3.5 w-3.5" />
                                    <span className="truncate">
                                        {customizations.audio.filename || 'Audio clip ready'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setAudio({
                            background_music: null,
                            trimmed_blob: undefined,
                            filename: undefined
                        })}
                        className={cn(
                            'w-full rounded-xl border border-white/10 bg-white/[0.03] py-3.5',
                            'font-serif text-sm tracking-wide text-stone-400',
                            'transition-all duration-300',
                            'hover:border-white/20 hover:bg-white/[0.06] hover:text-white'
                        )}
                    >
                        Choose different music
                    </button>
                </div>
            ) : (
                <AudioTrimmer
                    onSave={handleAudioSave}
                    maxDurationSeconds={30}
                    showLibrary={true}
                />
            )}

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-center font-serif text-xs tracking-wide text-stone-500">
                    Music is optional. Your letter will still be beautiful without it.
                </p>
            </div>
        </div>
    );
}
