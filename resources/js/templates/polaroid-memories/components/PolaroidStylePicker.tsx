import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { POLAROID_STYLES, type PolaroidStyleOption } from '../palettes';

type PolaroidStylePickerProps = {
    selected: string;
    onChange: (id: string) => void;
};

export function PolaroidStylePicker({ selected, onChange }: PolaroidStylePickerProps) {
    return (
        <div className="space-y-3">
            <h4 className="text-sm font-medium text-white/70">Polaroid Style</h4>

            <div className="grid grid-cols-3 gap-3">
                {POLAROID_STYLES.map((style) => (
                    <PolaroidStyleOption
                        key={style.id}
                        option={style}
                        isSelected={selected === style.id}
                        onSelect={() => onChange(style.id)}
                    />
                ))}
            </div>
        </div>
    );
}

type PolaroidStyleOptionProps = {
    option: PolaroidStyleOption;
    isSelected: boolean;
    onSelect: () => void;
};

function PolaroidStyleOption({ option, isSelected, onSelect }: PolaroidStyleOptionProps) {
    return (
        <motion.button
            type="button"
            onClick={onSelect}
            className={cn(
                'relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all',
                isSelected
                    ? 'border-rose-500 bg-rose-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="flex h-16 w-full items-center justify-center">
                <div
                    className={cn(
                        'relative h-14 w-11 rounded-sm p-1 pb-3',
                        option.shadowClass
                    )}
                    style={{ backgroundColor: option.borderColor }}
                >
                    <div className="h-full w-full rounded-sm bg-gradient-to-br from-rose-200 to-pink-200" />
                    {option.id === 'vintage' && (
                        <div className="absolute inset-0 rounded-sm bg-gradient-to-b from-amber-100/30 to-transparent" />
                    )}
                    {option.id === 'instant' && (
                        <div className="absolute bottom-0 inset-x-0 h-3 bg-gradient-to-t from-gray-100/50 to-transparent" />
                    )}
                </div>
            </div>

            <div className="text-center">
                <p className={cn(
                    'text-xs font-medium',
                    isSelected ? 'text-white' : 'text-white/80'
                )}>
                    {option.name}
                </p>
            </div>

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
