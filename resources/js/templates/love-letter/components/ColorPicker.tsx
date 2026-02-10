import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ColorPickerProps = {
    label: string;
    colors: string[];
    selected: string;
    onChange: (color: string) => void;
};

function getColorName(hex: string): string {
    const colorNames: Record<string, string> = {
        '#faf6f1': 'Cream',
        '#f5ebe0': 'Warm Ivory',
        '#e8ddd4': 'Parchment',
        '#2c1810': 'Deep Mahogany',
        '#1a0f0a': 'Midnight Brown',
        '#8b1538': 'Burgundy',
        '#722f37': 'Wine',
        '#4a1c2a': 'Dark Rose',
        '#d4af37': 'Gold',
        '#c9a227': 'Antique Gold',
        '#ffffff': 'White',
        '#000000': 'Black',
        '#1a1a2e': 'Deep Navy',
        '#f8f4e8': 'Antique White',
        '#e8e0d0': 'Aged Paper',
    };
    return colorNames[hex.toLowerCase()] || hex;
}

function ColorPickerComponent({ label, colors, selected, onChange }: ColorPickerProps) {
    return (
        <div className="space-y-3">
            <label className="block font-serif text-sm tracking-wide text-stone-400">
                {label}
            </label>

            <div className="flex flex-wrap gap-2.5">
                {colors.map((color, index) => {
                    const isSelected = selected.toLowerCase() === color.toLowerCase();
                    const colorName = getColorName(color);

                    return (
                        <motion.button
                            key={color}
                            type="button"
                            onClick={() => onChange(color)}
                            initial={false}
                            animate={{
                                scale: isSelected ? 1.1 : 1,
                            }}
                            whileHover={{ scale: isSelected ? 1.15 : 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 25,
                            }}
                            className={cn(
                                'relative h-8 w-8 rounded-full transition-all duration-300',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0607]',
                                isSelected
                                    ? 'ring-2 ring-white shadow-lg shadow-rose-500/30'
                                    : 'ring-1 ring-white/20 hover:ring-white/40'
                            )}
                            style={{ backgroundColor: color }}
                            aria-label={`Select ${colorName} color`}
                            aria-pressed={isSelected}
                        >
                            {isSelected && (
                                <motion.span
                                    layoutId={`${label}-glow`}
                                    className="absolute inset-0 -z-10 rounded-full bg-rose-500/40 blur-md"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}

                            {isSelected && (
                                <motion.span
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <span
                                        className={cn(
                                            'h-2 w-2 rounded-full',
                                            isLightColor(color) ? 'bg-stone-800' : 'bg-white'
                                        )}
                                    />
                                </motion.span>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

function isLightColor(hex: string): boolean {
    const c = hex.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    return luma > 160;
}

export const ColorPicker = memo(ColorPickerComponent);
