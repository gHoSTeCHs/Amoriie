import { MessageCircle, HelpCircle, Wand2, MessageSquareHeart, MousePointerClick, ArrowUpDown, Check } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { NoButtonBehavior } from '@/types/viewer';
import type { PolaroidFinalMessage } from '../schema';
import { POLAROID_LIMITS } from '../schema';

const NO_BUTTON_BEHAVIORS: { value: NoButtonBehavior; label: string; description: string; icon: typeof MessageSquareHeart }[] = [
    { value: 'plead', label: 'Pleading Text', description: 'Button text cycles through funny pleas', icon: MessageSquareHeart },
    { value: 'dodge', label: 'Dodge', description: 'Button runs away when clicked', icon: MousePointerClick },
    { value: 'shrink-grow', label: 'Shrink & Grow', description: 'No shrinks, Yes grows bigger', icon: ArrowUpDown },
    { value: 'simple', label: 'Simple', description: 'Standard yes/no, no tricks', icon: Check },
];

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
                        <Wand2 className="h-4 w-4" />
                        No button style
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {NO_BUTTON_BEHAVIORS.map((behavior) => {
                            const isSelected = message.no_button_behavior === behavior.value;
                            const Icon = behavior.icon;
                            return (
                                <button
                                    key={behavior.value}
                                    type="button"
                                    onClick={() => onChange({ no_button_behavior: behavior.value })}
                                    className={cn(
                                        'flex min-h-[80px] cursor-pointer flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all duration-200',
                                        isSelected
                                            ? 'border-rose-500/50 bg-rose-500/5 ring-1 ring-rose-500/20'
                                            : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                                    )}
                                >
                                    <Icon className={cn(
                                        'h-5 w-5 transition-colors duration-200',
                                        isSelected ? 'text-rose-400' : 'text-stone-500'
                                    )} />
                                    <div>
                                        <p className={cn(
                                            'text-sm font-medium transition-colors duration-200',
                                            isSelected ? 'text-white' : 'text-stone-300'
                                        )}>
                                            {behavior.label}
                                        </p>
                                        <p className="text-xs text-stone-500">
                                            {behavior.description}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-xs text-white/40">
                        What happens when they try to say no?
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
