import { memo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { LetterTheme } from '../themes';

type ThemeCardProps = {
    theme: LetterTheme;
    isSelected: boolean;
    onSelect: () => void;
};

function ThemeCardComponent({ theme, isSelected, onSelect }: ThemeCardProps) {
    return (
        <motion.button
            type="button"
            onClick={onSelect}
            initial={false}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
            }}
            className={cn(
                'group relative w-full overflow-hidden rounded-2xl',
                'transition-all duration-300',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0607]',
                isSelected
                    ? 'ring-2 ring-rose-500 shadow-lg shadow-rose-500/20'
                    : 'ring-1 ring-white/10 hover:ring-white/25'
            )}
            aria-pressed={isSelected}
            aria-label={`Select ${theme.name} theme`}
        >
            <div
                className="aspect-[4/5] w-full"
                style={{ backgroundColor: theme.palette.background }}
            >
                <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjciIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')] opacity-30" />

                <div className="absolute inset-x-0 top-0 flex justify-center pt-6">
                    <div
                        className="h-24 w-20 rounded-sm shadow-lg"
                        style={{
                            backgroundColor: theme.palette.paper[0] || '#f5f0e1',
                            boxShadow: `0 4px 20px ${theme.palette.background}80`,
                        }}
                    >
                        <div className="flex h-full flex-col p-2">
                            <div
                                className="h-1 w-8 rounded-full opacity-60"
                                style={{ backgroundColor: theme.palette.ink[0] || '#2d1810' }}
                            />
                            <div className="mt-1.5 space-y-1">
                                <div
                                    className="h-0.5 w-full rounded-full opacity-30"
                                    style={{ backgroundColor: theme.palette.ink[0] || '#2d1810' }}
                                />
                                <div
                                    className="h-0.5 w-3/4 rounded-full opacity-30"
                                    style={{ backgroundColor: theme.palette.ink[0] || '#2d1810' }}
                                />
                                <div
                                    className="h-0.5 w-5/6 rounded-full opacity-30"
                                    style={{ backgroundColor: theme.palette.ink[0] || '#2d1810' }}
                                />
                            </div>
                            <div className="mt-auto flex justify-end">
                                <div
                                    className="h-4 w-4 rounded-full"
                                    style={{ backgroundColor: theme.palette.seal[0] || '#8b0000' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 pt-12">
                    <h4 className="font-serif text-base font-medium tracking-wide text-white">
                        {theme.name}
                    </h4>
                    <p className="mt-1 line-clamp-2 font-serif text-xs leading-relaxed text-white/60">
                        {theme.description}
                    </p>
                </div>

                {isSelected && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                        }}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 shadow-lg shadow-rose-500/40"
                    >
                        <Check className="h-4 w-4 text-white" strokeWidth={3} />
                    </motion.div>
                )}

                <div
                    className={cn(
                        'pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300',
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                    )}
                    style={{
                        boxShadow: 'inset 0 0 30px rgba(244, 63, 94, 0.1)',
                    }}
                />
            </div>
        </motion.button>
    );
}

export const ThemeCard = memo(ThemeCardComponent);
