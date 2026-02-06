import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export type WatermarkVariant = 'light' | 'dark';
export type WatermarkPosition = 'bottom-left' | 'bottom-right' | 'bottom-center';

export type WatermarkProps = {
    variant?: WatermarkVariant;
    position?: WatermarkPosition;
    delay?: number;
};

const positionClasses: Record<WatermarkPosition, string> = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

const variantClasses: Record<WatermarkVariant, string> = {
    light: 'text-stone-500 hover:text-stone-700',
    dark: 'text-stone-400 hover:text-stone-200',
};

export function Watermark({ variant = 'light', position = 'bottom-center', delay = 2 }: WatermarkProps) {
    return (
        <motion.a
            href="/"
            className={`fixed z-50 flex items-center gap-1.5 text-xs opacity-60 transition-opacity hover:opacity-100 ${positionClasses[position]} ${variantClasses[variant]}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <span>Made with</span>
            <Heart className="h-3 w-3 fill-current text-rose-400" />
            <span className="font-medium">Amoriie</span>
        </motion.a>
    );
}
