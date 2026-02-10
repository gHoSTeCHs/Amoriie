import { Heart, User, UserCheck, Calendar } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { StepValidationAlert } from '@/components/shared/StepValidationAlert';
import { cn } from '@/lib/utils';
import { LetterEditor } from '../components/LetterEditor';
import { useLoveLetterCustomizations } from '../hooks/use-love-letter-customizations';
import { useLoveLetterValidation } from '../hooks/use-love-letter-validation';
import { LOVE_LETTER_LIMITS } from '../schema';

export function ContentStep() {
    const {
        customizations,
        setRecipientName,
        setSenderName,
        setLetterDate,
        setLetterText,
    } = useLoveLetterCustomizations();

    const validation = useLoveLetterValidation('content');

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 ring-1 ring-rose-500/30">
                        <Heart className="h-4 w-4 text-rose-400" />
                    </div>
                    <h3 className="font-serif text-lg tracking-wide text-white">
                        The Basics
                    </h3>
                </div>

                <div className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-stone-400">
                            <User className="h-4 w-4 text-rose-400/70" />
                            <span className="font-serif tracking-wide">Who is this for?</span>
                        </label>
                        <Input
                            type="text"
                            value={customizations.recipient_name}
                            onChange={(e) => setRecipientName(e.target.value)}
                            placeholder="Their name"
                            maxLength={LOVE_LETTER_LIMITS.name.max}
                            className={cn(
                                'h-12 rounded-xl border-white/10 bg-white/5 px-4',
                                'font-serif text-white placeholder:text-stone-500',
                                'transition-all duration-300',
                                'focus-visible:border-rose-500/50 focus-visible:ring-rose-500/20',
                                'hover:border-white/20'
                            )}
                        />
                        <div className="flex justify-end">
                            <span className="font-mono text-xs text-stone-600">
                                {customizations.recipient_name.length}/{LOVE_LETTER_LIMITS.name.max}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-stone-400">
                            <UserCheck className="h-4 w-4 text-rose-400/70" />
                            <span className="font-serif tracking-wide">From</span>
                        </label>
                        <Input
                            type="text"
                            value={customizations.sender_name}
                            onChange={(e) => setSenderName(e.target.value)}
                            placeholder="Your name"
                            maxLength={LOVE_LETTER_LIMITS.name.max}
                            className={cn(
                                'h-12 rounded-xl border-white/10 bg-white/5 px-4',
                                'font-serif text-white placeholder:text-stone-500',
                                'transition-all duration-300',
                                'focus-visible:border-rose-500/50 focus-visible:ring-rose-500/20',
                                'hover:border-white/20'
                            )}
                        />
                        <div className="flex justify-end">
                            <span className="font-mono text-xs text-stone-600">
                                {customizations.sender_name.length}/{LOVE_LETTER_LIMITS.name.max}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-stone-400">
                            <Calendar className="h-4 w-4 text-rose-400/70" />
                            <span className="font-serif tracking-wide">Date</span>
                        </label>
                        <Input
                            type="date"
                            value={customizations.letter_date}
                            onChange={(e) => setLetterDate(e.target.value)}
                            className={cn(
                                'h-12 rounded-xl border-white/10 bg-white/5 px-4',
                                'font-serif text-white',
                                'transition-all duration-300',
                                'focus-visible:border-rose-500/50 focus-visible:ring-rose-500/20',
                                'hover:border-white/20',
                                '[color-scheme:dark]'
                            )}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <LetterEditor
                    value={customizations.letter_text}
                    onChange={setLetterText}
                    minLength={LOVE_LETTER_LIMITS.letter_text.min}
                    maxLength={LOVE_LETTER_LIMITS.letter_text.max}
                />
            </div>

            <StepValidationAlert
                errors={validation.errors}
                warnings={validation.warnings}
            />
        </div>
    );
}
