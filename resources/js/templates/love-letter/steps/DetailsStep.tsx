import { Sparkles, MessageCircle, Heart, Wand2, MessageSquareHeart, MousePointerClick, ArrowUpDown, Check } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StepValidationAlert } from '@/components/shared/StepValidationAlert';
import { cn } from '@/lib/utils';
import type { NoButtonBehavior } from '@/types/viewer';
import { useLoveLetterCustomizations } from '../hooks/use-love-letter-customizations';
import { useLoveLetterValidation } from '../hooks/use-love-letter-validation';
import { LOVE_LETTER_LIMITS } from '../schema';

const NO_BUTTON_BEHAVIORS: { value: NoButtonBehavior; label: string; description: string; icon: typeof MessageSquareHeart }[] = [
    { value: 'plead', label: 'Pleading Text', description: 'Button text cycles through funny pleas', icon: MessageSquareHeart },
    { value: 'dodge', label: 'Dodge', description: 'Button runs away when clicked', icon: MousePointerClick },
    { value: 'shrink-grow', label: 'Shrink & Grow', description: 'No shrinks, Yes grows bigger', icon: ArrowUpDown },
    { value: 'simple', label: 'Simple', description: 'Standard yes/no, no tricks', icon: Check },
];

export function DetailsStep() {
    const { customizations, setFinalMessage, setYesResponse } = useLoveLetterCustomizations();
    const validation = useLoveLetterValidation('details');

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 ring-1 ring-amber-500/30">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                    </div>
                    <h3 className="font-serif text-lg tracking-wide text-white">
                        The Big Question
                    </h3>
                </div>

                <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <p className="font-serif text-sm text-stone-400">
                        The moment of truth — what will you ask?
                    </p>
                    <Input
                        type="text"
                        value={customizations.final_message.ask_text}
                        onChange={(e) => setFinalMessage({ ask_text: e.target.value })}
                        placeholder="Will you be my Valentine?"
                        maxLength={LOVE_LETTER_LIMITS.ask_text.max}
                        className={cn(
                            'h-12 rounded-xl border-white/10 bg-white/5 px-4',
                            'font-serif text-base text-white placeholder:text-stone-500',
                            'transition-all duration-300',
                            'focus-visible:border-rose-500/50 focus-visible:ring-rose-500/20',
                            'hover:border-white/20'
                        )}
                    />
                    <div className="flex justify-end">
                        <span className={cn(
                            'font-mono text-xs transition-colors',
                            customizations.final_message.ask_text.length > LOVE_LETTER_LIMITS.ask_text.max * 0.9
                                ? 'text-amber-400'
                                : 'text-stone-600'
                        )}>
                            {customizations.final_message.ask_text.length}/{LOVE_LETTER_LIMITS.ask_text.max}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 ring-1 ring-pink-500/30">
                        <Wand2 className="h-4 w-4 text-pink-400" />
                    </div>
                    <h3 className="font-serif text-lg tracking-wide text-white">
                        No Button Style
                    </h3>
                </div>

                <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <p className="font-serif text-sm text-stone-400">
                        What happens when they try to say no?
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {NO_BUTTON_BEHAVIORS.map((behavior) => {
                            const isSelected = customizations.final_message.no_button_behavior === behavior.value;
                            const Icon = behavior.icon;
                            return (
                                <button
                                    key={behavior.value}
                                    type="button"
                                    onClick={() => setFinalMessage({ no_button_behavior: behavior.value })}
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
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 ring-1 ring-violet-500/30">
                        <MessageCircle className="h-4 w-4 text-violet-400" />
                    </div>
                    <div>
                        <h3 className="font-serif text-lg tracking-wide text-white">
                            Before the Question
                        </h3>
                        <p className="font-serif text-xs text-stone-500">Optional</p>
                    </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <p className="font-serif text-sm text-stone-400">
                        An optional message that appears before your question
                    </p>
                    <Textarea
                        value={customizations.final_message.text}
                        onChange={(e) => setFinalMessage({ text: e.target.value })}
                        placeholder="I've been meaning to tell you..."
                        maxLength={LOVE_LETTER_LIMITS.message.max}
                        rows={3}
                        className={cn(
                            'min-h-[100px] resize-none rounded-xl border-white/10 bg-white/5 px-4 py-3',
                            'font-serif text-base leading-relaxed text-white placeholder:text-stone-500',
                            'transition-all duration-300',
                            'focus-visible:border-rose-500/50 focus-visible:ring-rose-500/20',
                            'hover:border-white/20'
                        )}
                    />
                    <div className="flex justify-end">
                        <span className={cn(
                            'font-mono text-xs transition-colors',
                            customizations.final_message.text.length > LOVE_LETTER_LIMITS.message.max * 0.9
                                ? 'text-amber-400'
                                : 'text-stone-600'
                        )}>
                            {customizations.final_message.text.length}/{LOVE_LETTER_LIMITS.message.max}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 ring-1 ring-rose-500/30">
                        <Heart className="h-4 w-4 text-rose-400" />
                    </div>
                    <h3 className="font-serif text-lg tracking-wide text-white">
                        When They Say Yes
                    </h3>
                </div>

                <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <p className="font-serif text-sm text-stone-400">
                        What they'll see when they accept
                    </p>
                    <Textarea
                        value={customizations.yes_response.message}
                        onChange={(e) => setYesResponse({ message: e.target.value })}
                        placeholder="You've made me the happiest person!"
                        maxLength={LOVE_LETTER_LIMITS.message.max}
                        rows={3}
                        className={cn(
                            'min-h-[100px] resize-none rounded-xl border-white/10 bg-white/5 px-4 py-3',
                            'font-serif text-base leading-relaxed text-white placeholder:text-stone-500',
                            'transition-all duration-300',
                            'focus-visible:border-rose-500/50 focus-visible:ring-rose-500/20',
                            'hover:border-white/20'
                        )}
                    />
                    <div className="flex justify-end">
                        <span className={cn(
                            'font-mono text-xs transition-colors',
                            customizations.yes_response.message.length > LOVE_LETTER_LIMITS.message.max * 0.9
                                ? 'text-amber-400'
                                : 'text-stone-600'
                        )}>
                            {customizations.yes_response.message.length}/{LOVE_LETTER_LIMITS.message.max}
                        </span>
                    </div>
                </div>
            </div>

            <StepValidationAlert
                errors={validation.errors}
                warnings={validation.warnings}
            />
        </div>
    );
}
