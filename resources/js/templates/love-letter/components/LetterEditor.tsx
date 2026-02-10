import { memo, useId, useMemo } from 'react';
import { PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';

type LetterEditorProps = {
    value: string;
    onChange: (value: string) => void;
    minLength: number;
    maxLength: number;
    placeholder?: string;
    className?: string;
};

function LetterEditorComponent({
    value,
    onChange,
    minLength,
    maxLength,
    placeholder = 'My dearest...\n\nWrite from your heart. Let every word carry the weight of your affection...',
    className,
}: LetterEditorProps) {
    const id = useId();
    const currentLength = value.length;

    const status = useMemo(() => {
        if (currentLength < minLength) {
            const nearMin = currentLength >= minLength - 20;
            return {
                color: nearMin ? 'text-amber-400' : 'text-rose-400',
                ringColor: nearMin ? 'ring-amber-500/30' : 'ring-rose-500/30',
                bgGlow: nearMin ? 'shadow-amber-500/5' : 'shadow-rose-500/5',
                label: 'below minimum',
            };
        }
        return {
            color: 'text-emerald-400',
            ringColor: 'ring-emerald-500/20',
            bgGlow: 'shadow-emerald-500/5',
            label: 'ready',
        };
    }, [currentLength, minLength]);

    const progressPercent = Math.min((currentLength / minLength) * 100, 100);

    return (
        <div className={cn('relative', className)}>
            <div className="absolute -top-3 left-4 z-10 flex items-center gap-1.5 rounded-full bg-[#1a1215] px-3 py-1 ring-1 ring-white/10">
                <PenLine className="h-3.5 w-3.5 text-rose-400/70" />
                <span className="font-serif text-xs tracking-wide text-stone-400">
                    Your Letter
                </span>
            </div>

            <div
                className={cn(
                    'group relative overflow-hidden rounded-2xl',
                    'bg-gradient-to-b from-white/[0.04] to-white/[0.02]',
                    'ring-1 ring-inset ring-white/10',
                    'transition-all duration-500',
                    'focus-within:ring-rose-500/40 focus-within:shadow-lg focus-within:shadow-rose-500/10'
                )}
            >
                <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjciIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wMyIvPjwvc3ZnPg==')] opacity-50" />

                <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-rose-400/20 to-transparent" />

                <textarea
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    rows={8}
                    className={cn(
                        'relative z-10 w-full resize-none bg-transparent px-5 pb-14 pt-8',
                        'min-h-[240px]',
                        'font-serif text-base leading-relaxed text-stone-200',
                        'placeholder:text-stone-500/60 placeholder:italic',
                        'focus:outline-none',
                        'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10'
                    )}
                    style={{
                        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                    }}
                />

                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-white/5 bg-black/20 px-4 py-2.5 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="relative h-1 w-20 overflow-hidden rounded-full bg-white/5">
                            <div
                                className={cn(
                                    'h-full rounded-full transition-all duration-500 ease-out',
                                    currentLength < minLength - 20
                                        ? 'bg-gradient-to-r from-rose-500/80 to-rose-400'
                                        : currentLength < minLength
                                          ? 'bg-gradient-to-r from-amber-500/80 to-amber-400'
                                          : 'bg-gradient-to-r from-emerald-500/80 to-emerald-400'
                                )}
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        {currentLength < minLength && (
                            <span className="text-xs text-stone-500">
                                {minLength - currentLength} more needed
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className={cn('tabular-nums transition-colors duration-300', status.color)}>
                            {currentLength.toLocaleString()}
                        </span>
                        <span className="text-stone-600">/</span>
                        <span className="text-stone-500">{minLength} min</span>
                        <span className="mx-1 text-stone-700">•</span>
                        <span className="text-stone-500">{maxLength.toLocaleString()} max</span>
                    </div>
                </div>

                <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-rose-500/5 blur-3xl transition-opacity duration-700 group-focus-within:opacity-100 opacity-0" />
            </div>
        </div>
    );
}

export const LetterEditor = memo(LetterEditorComponent);
