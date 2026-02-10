import { memo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type FontSelectorProps = {
    label: string;
    fonts: string[];
    selected: string;
    onChange: (font: string) => void;
};

const fontFamilyMap: Record<string, string> = {
    'Pinyon Script': "'Pinyon Script', cursive",
    'Great Vibes': "'Great Vibes', cursive",
    'Cormorant Garamond': "'Cormorant Garamond', serif",
    'Crimson Text': "'Crimson Text', serif",
    'Homemade Apple': "'Homemade Apple', cursive",
    'Dancing Script': "'Dancing Script', cursive",
    'Special Elite': "'Special Elite', monospace",
    'Courier Prime': "'Courier Prime', monospace",
    'IBM Plex Mono': "'IBM Plex Mono', monospace",
    'Cinzel Decorative': "'Cinzel Decorative', serif",
    'Playfair Display': "'Playfair Display', serif",
    'EB Garamond': "'EB Garamond', serif",
    'Allura': "'Allura', cursive",
    'Lavishly Yours': "'Lavishly Yours', cursive",
    'Parisienne': "'Parisienne', cursive",
    'Lora': "'Lora', serif",
    'Libre Baskerville': "'Libre Baskerville', serif",
    'Pacifico': "'Pacifico', cursive",
    'Inter': "'Inter', sans-serif",
    'Source Sans Pro': "'Source Sans Pro', sans-serif",
    'Caveat': "'Caveat', cursive",
    'Nothing You Could Do': "'Nothing You Could Do', cursive",
    'Merriweather': "'Merriweather', serif",
    'Alex Brush': "'Alex Brush', cursive",
};

function getFontFamily(fontName: string): string {
    return fontFamilyMap[fontName] || `'${fontName}', serif`;
}

function FontSelectorComponent({ label, fonts, selected, onChange }: FontSelectorProps) {
    return (
        <div className="space-y-3">
            <label className="block font-serif text-sm tracking-wide text-stone-400">
                {label}
            </label>

            <div className="space-y-1.5">
                {fonts.map((font) => {
                    const isSelected = selected === font;

                    return (
                        <motion.button
                            key={font}
                            type="button"
                            onClick={() => onChange(font)}
                            initial={false}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                                'group relative flex w-full items-center justify-between rounded-lg px-4 py-3',
                                'transition-all duration-300 ease-out',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0607]',
                                isSelected
                                    ? 'border border-rose-500/60 bg-rose-500/10 shadow-sm shadow-rose-500/20'
                                    : 'border border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]'
                            )}
                            aria-pressed={isSelected}
                        >
                            <span
                                className={cn(
                                    'text-lg transition-colors duration-200',
                                    isSelected ? 'text-white' : 'text-stone-300 group-hover:text-white'
                                )}
                                style={{ fontFamily: getFontFamily(font) }}
                            >
                                {font}
                            </span>

                            {isSelected && (
                                <motion.span
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                    className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500"
                                >
                                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                                </motion.span>
                            )}

                            {isSelected && (
                                <motion.span
                                    layoutId={`${label}-font-glow`}
                                    className="absolute inset-0 -z-10 rounded-lg bg-rose-500/5"
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

export const FontSelector = memo(FontSelectorComponent);
