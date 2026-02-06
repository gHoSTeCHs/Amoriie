import { Heart, User, Sparkles } from 'lucide-react';

import { StepValidationAlert } from '@/components/shared/StepValidationAlert';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { MemoryManager } from '../components/MemoryManager';
import { usePolaroidCustomizations } from '../hooks/use-polaroid-customizations';
import { usePolaroidValidation } from '../hooks/use-polaroid-validation';
import { getFontById } from '../palettes';
import { POLAROID_LIMITS } from '../schema';

export function ContentStep() {
    const {
        customizations,
        setTitle,
        setRecipientName,
        setSenderName,
        addMemory,
        removeMemory,
        updateMemory,
    } = usePolaroidCustomizations();

    const validation = usePolaroidValidation('content');

    const selectedFont = getFontById(customizations.theme.handwriting_font);
    const fontFamily = selectedFont?.fontFamily ?? "'Dancing Script', cursive";

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-400" />
                    <h3 className="text-lg font-medium text-white">The Basics</h3>
                </div>

                <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-white/70">
                            <User className="h-4 w-4" />
                            Who is this for?
                        </label>
                        <Input
                            type="text"
                            value={customizations.recipient_name}
                            onChange={(e) => setRecipientName(e.target.value)}
                            placeholder="Their name"
                            maxLength={POLAROID_LIMITS.name.max}
                            className={cn(
                                'border-white/10 bg-white/5 text-white placeholder:text-white/30',
                                'focus-visible:border-rose-500/50 focus-visible:ring-rose-500/20'
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-white/70">
                            <Heart className="h-4 w-4" />
                            From
                        </label>
                        <Input
                            type="text"
                            value={customizations.sender_name}
                            onChange={(e) => setSenderName(e.target.value)}
                            placeholder="Your name"
                            maxLength={POLAROID_LIMITS.name.max}
                            className={cn(
                                'border-white/10 bg-white/5 text-white placeholder:text-white/30',
                                'focus-visible:border-rose-500/50 focus-visible:ring-rose-500/20'
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-white/70">
                            <Sparkles className="h-4 w-4" />
                            Title (optional)
                        </label>
                        <Input
                            type="text"
                            value={customizations.title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Our Love Story"
                            maxLength={POLAROID_LIMITS.title.max}
                            className={cn(
                                'border-white/10 bg-white/5 text-white placeholder:text-white/30',
                                'focus-visible:border-rose-500/50 focus-visible:ring-rose-500/20'
                            )}
                        />
                        <div className="flex justify-end">
                            <span className="text-xs text-white/30">
                                {customizations.title.length}/{POLAROID_LIMITS.title.max}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <MemoryManager
                memories={customizations.memories}
                fontFamily={fontFamily}
                onAddMemory={addMemory}
                onRemoveMemory={removeMemory}
                onUpdateMemory={updateMemory}
            />

            <StepValidationAlert
                errors={validation.errors}
                warnings={validation.warnings}
            />
        </div>
    );
}
