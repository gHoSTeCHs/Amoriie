import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useEffect } from 'react';

import { cn } from '@/lib/utils';
import { HANDWRITING_FONTS, type HandwritingFontOption } from '../palettes';

type FontPickerProps = {
    selected: string;
    onChange: (id: string) => void;
};

export function FontPicker({ selected, onChange }: FontPickerProps) {
    useEffect(() => {
        const loadedFonts = new Set<string>();

        HANDWRITING_FONTS.forEach((font) => {
            if (!loadedFonts.has(font.id)) {
                const link = document.createElement('link');
                link.href = font.googleFontUrl;
                link.rel = 'stylesheet';
                link.dataset.fontId = font.id;
                document.head.appendChild(link);
                loadedFonts.add(font.id);
            }
        });

        return () => {
            document.querySelectorAll('link[data-font-id]').forEach((link) => {
                link.remove();
            });
        };
    }, []);

    return (
        <div className="space-y-3">
            <h4 className="text-sm font-medium text-white/70">Handwriting Style</h4>

            <div className="grid grid-cols-2 gap-3">
                {HANDWRITING_FONTS.map((font) => (
                    <FontOption
                        key={font.id}
                        option={font}
                        isSelected={selected === font.id}
                        onSelect={() => onChange(font.id)}
                    />
                ))}
            </div>
        </div>
    );
}

type FontOptionProps = {
    option: HandwritingFontOption;
    isSelected: boolean;
    onSelect: () => void;
};

function FontOption({ option, isSelected, onSelect }: FontOptionProps) {
    return (
        <motion.button
            type="button"
            onClick={onSelect}
            className={cn(
                'relative flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-4 transition-all',
                isSelected
                    ? 'border-rose-500 bg-rose-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <p
                className={cn(
                    'text-xl transition-colors',
                    isSelected ? 'text-rose-300' : 'text-white/80'
                )}
                style={{ fontFamily: option.fontFamily }}
            >
                {option.previewText}
            </p>

            <p className={cn(
                'text-xs',
                isSelected ? 'text-white/70' : 'text-white/40'
            )}>
                {option.name}
            </p>

            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500"
                >
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </motion.div>
            )}
        </motion.button>
    );
}
