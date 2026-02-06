import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { POLAROID_BACKGROUNDS, type BackgroundOption } from '../palettes';

type BackgroundPickerProps = {
    selected: string;
    onChange: (id: string) => void;
};

export function BackgroundPicker({ selected, onChange }: BackgroundPickerProps) {
    return (
        <div className="space-y-3">
            <h4 className="text-sm font-medium text-white/70">Background</h4>

            <div className="grid grid-cols-2 gap-3">
                {POLAROID_BACKGROUNDS.map((bg) => (
                    <BackgroundOption
                        key={bg.id}
                        option={bg}
                        isSelected={selected === bg.id}
                        onSelect={() => onChange(bg.id)}
                    />
                ))}
            </div>
        </div>
    );
}

type BackgroundOptionProps = {
    option: BackgroundOption;
    isSelected: boolean;
    onSelect: () => void;
};

function BackgroundOption({ option, isSelected, onSelect }: BackgroundOptionProps) {
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
            <div
                className={cn(
                    'h-16 w-full rounded-lg',
                    option.cssClass
                )}
            >
                <div className="flex h-full items-center justify-center">
                    <div className="h-8 w-6 rotate-3 rounded-sm bg-white shadow-md" />
                    <div className="h-8 w-6 -rotate-2 -ml-2 rounded-sm bg-white shadow-md" />
                </div>
            </div>

            <div className="text-center">
                <p className={cn(
                    'text-sm font-medium',
                    isSelected ? 'text-white' : 'text-white/80'
                )}>
                    {option.name}
                </p>
                <p className="text-xs text-white/40">{option.description}</p>
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
