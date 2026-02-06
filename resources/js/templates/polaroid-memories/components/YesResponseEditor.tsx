import { Heart, PartyPopper, Image } from 'lucide-react';

import { ImageUploader } from '@/components/shared/ImageUploader';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { PolaroidYesResponse } from '../schema';
import { POLAROID_LIMITS } from '../schema';

type YesResponseEditorProps = {
    response: PolaroidYesResponse;
    onChange: (updates: Partial<PolaroidYesResponse>) => void;
};

export function YesResponseEditor({ response, onChange }: YesResponseEditorProps) {
    function handleImageUpload(file: File) {
        const previewUrl = URL.createObjectURL(file);
        onChange({
            reveal_photo: previewUrl,
            reveal_photo_file: file,
        });
    }

    function handleImageRemove() {
        if (response.reveal_photo && response.reveal_photo.startsWith('blob:')) {
            URL.revokeObjectURL(response.reveal_photo);
        }
        onChange({
            reveal_photo: null,
            reveal_photo_file: undefined,
        });
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <PartyPopper className="h-5 w-5 text-rose-400" />
                <h3 className="text-lg font-medium text-white">When They Say Yes</h3>
            </div>

            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-white/70">
                        <Heart className="h-4 w-4" />
                        Your response message
                    </label>
                    <Textarea
                        value={response.message}
                        onChange={(e) => onChange({ message: e.target.value.slice(0, POLAROID_LIMITS.message.max) })}
                        placeholder="You've made me the happiest person!"
                        maxLength={POLAROID_LIMITS.message.max}
                        rows={3}
                        className={cn(
                            'border-white/10 bg-white/5 text-white placeholder:text-white/30',
                            'focus-visible:border-rose-500/50 focus-visible:ring-rose-500/20'
                        )}
                    />
                    <div className="flex justify-end">
                        <span className="text-xs text-white/30">
                            {response.message.length}/{POLAROID_LIMITS.message.max}
                        </span>
                    </div>
                </div>

                <div className="h-px bg-white/5" />

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-white/70">
                        <Image className="h-4 w-4" />
                        Reveal photo (optional)
                    </label>
                    <p className="text-xs text-white/40">
                        This photo will be revealed with confetti when they tap Yes
                    </p>
                    <ImageUploader
                        onUpload={handleImageUpload}
                        onRemove={handleImageRemove}
                        currentImage={response.reveal_photo || undefined}
                        aspectRatio={1}
                        maxSizeMb={10}
                        showCrop={true}
                        placeholder="Add reveal photo"
                    />
                </div>
            </div>
        </div>
    );
}
