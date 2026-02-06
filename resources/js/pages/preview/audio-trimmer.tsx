import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { AudioTrimmer } from '@/components/shared/AudioTrimmer';

export default function AudioTrimmerPreview() {
    const [savedClip, setSavedClip] = useState<{ blob: Blob; filename: string; url: string } | null>(null);

    const handleSave = (audioBlob: Blob, filename: string) => {
        if (savedClip?.url) {
            URL.revokeObjectURL(savedClip.url);
        }

        const url = URL.createObjectURL(audioBlob);
        setSavedClip({ blob: audioBlob, filename, url });
    };

    return (
        <>
            <Head title="AudioTrimmer Preview" />

            <div className="min-h-screen bg-[#0c0607] text-white">
                <div className="mx-auto max-w-md px-4 py-12">
                    <div className="text-center mb-8">
                        <h1
                            className="text-3xl text-rose-300 mb-2"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            AudioTrimmer Preview
                        </h1>
                        <p className="text-white/50 text-sm">
                            Phase 3.5 Component Demo
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-sm font-medium text-white/70 mb-3">
                                Default (30s max, with library button)
                            </h2>
                            <AudioTrimmer
                                onSave={handleSave}
                                maxDurationSeconds={30}
                                showLibrary={true}
                            />
                        </div>

                        <div>
                            <h2 className="text-sm font-medium text-white/70 mb-3">
                                Short clip (15s max, no library)
                            </h2>
                            <AudioTrimmer
                                onSave={handleSave}
                                maxDurationSeconds={15}
                                showLibrary={false}
                            />
                        </div>

                        {savedClip && (
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <h3
                                    className="text-rose-300 mb-3"
                                    style={{ fontFamily: "'Dancing Script', cursive" }}
                                >
                                    Saved Clip
                                </h3>

                                <div className="space-y-3">
                                    <div className="text-xs text-white/60 space-y-1">
                                        <p>
                                            <span className="text-white/40">Filename:</span>{' '}
                                            {savedClip.filename}
                                        </p>
                                        <p>
                                            <span className="text-white/40">Size:</span>{' '}
                                            {(savedClip.blob.size / 1024).toFixed(1)} KB
                                        </p>
                                        <p>
                                            <span className="text-white/40">Type:</span>{' '}
                                            {savedClip.blob.type}
                                        </p>
                                    </div>

                                    <audio
                                        controls
                                        src={savedClip.url}
                                        className="w-full h-10 rounded-lg"
                                        style={{
                                            filter: 'sepia(20%) saturate(70%) hue-rotate(310deg)',
                                        }}
                                    />

                                    <a
                                        href={savedClip.url}
                                        download={savedClip.filename}
                                        className="flex items-center justify-center gap-2 h-10 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-medium hover:from-rose-400 hover:to-pink-400 transition-all duration-300"
                                    >
                                        Download Clip
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
