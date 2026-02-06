import { MessageCircle, HelpCircle } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { PolaroidFinalMessage } from '../schema';
import { POLAROID_LIMITS } from '../schema';

type FinalMessageEditorProps = {
    message: PolaroidFinalMessage;
    onChange: (updates: Partial<PolaroidFinalMessage>) => void;
};

export function FinalMessageEditor({ message, onChange }: FinalMessageEditorProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-rose-400" />
                <h3 className="text-lg font-medium text-white">Final Message</h3>
            </div>

            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-white/70">
                        <HelpCircle className="h-4 w-4" />
                        The big question
                    </label>
                    <Input
                        type="text"
                        value={message.ask_text}
                        onChange={(e) => onChange({ ask_text: e.target.value.slice(0, POLAROID_LIMITS.ask_text.max) })}
                        placeholder="Will you be my Valentine?"
                        maxLength={POLAROID_LIMITS.ask_text.max}
                        className={cn(
                            'border-white/10 bg-white/5 text-white placeholder:text-white/30',
                            'focus-visible:border-rose-500/50 focus-visible:ring-rose-500/20'
                        )}
                    />
                    <p className="text-xs text-white/40">
                        This will appear with Yes/No buttons
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-white/70">
                        <MessageCircle className="h-4 w-4" />
                        Your message (optional)
                    </label>
                    <Textarea
                        value={message.text}
                        onChange={(e) => onChange({ text: e.target.value.slice(0, POLAROID_LIMITS.message.max) })}
                        placeholder="Write a heartfelt message before the big question..."
                        maxLength={POLAROID_LIMITS.message.max}
                        rows={4}
                        className={cn(
                            'border-white/10 bg-white/5 text-white placeholder:text-white/30',
                            'focus-visible:border-rose-500/50 focus-visible:ring-rose-500/20'
                        )}
                    />
                    <div className="flex justify-end">
                        <span className="text-xs text-white/30">
                            {message.text.length}/{POLAROID_LIMITS.message.max}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
