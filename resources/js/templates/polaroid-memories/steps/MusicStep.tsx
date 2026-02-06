import { Music, Check } from 'lucide-react';

import { AudioTrimmer } from '@/components/shared/AudioTrimmer';
import { cn } from '@/lib/utils';
import { usePolaroidCustomizations } from '../hooks/use-polaroid-customizations';

export function MusicStep() {
    const { customizations, setAudio } = usePolaroidCustomizations();

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
            <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-rose-400" />
                <h3 className="text-lg font-medium text-white">Background Music</h3>
            </div>

            <p className="text-sm text-white/60">
                Add a soundtrack to make your valentine even more memorable. Upload your
                own music or choose from our royalty-free library.
            </p>

            {hasMusic ? (
                <div className="space-y-4">
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                                <Check className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="font-medium text-white">Music added!</p>
                                <p className="text-sm text-white/60">
                                    {customizations.audio.filename || 'Audio clip ready'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setAudio({ background_music: null, trimmed_blob: undefined, filename: undefined })}
                        className={cn(
                            'w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-white/70',
                            'transition-all hover:bg-white/10 hover:text-white'
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
                <p className="text-center text-xs text-white/40">
                    Music is optional. Your valentine will still be beautiful without it.
                </p>
            </div>
        </div>
    );
}
