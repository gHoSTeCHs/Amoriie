import { Palette } from 'lucide-react';

import type { PolaroidTheme } from '../schema';
import { BackgroundPicker } from './BackgroundPicker';
import { FontPicker } from './FontPicker';
import { PolaroidStylePicker } from './PolaroidStylePicker';

type ThemeSelectorProps = {
    theme: PolaroidTheme;
    onChange: (updates: Partial<PolaroidTheme>) => void;
};

export function ThemeSelector({ theme, onChange }: ThemeSelectorProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-rose-400" />
                <h3 className="text-lg font-medium text-white">Customize Your Style</h3>
            </div>

            <div className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <BackgroundPicker
                    selected={theme.background}
                    onChange={(background) => onChange({ background })}
                />

                <div className="h-px bg-white/5" />

                <PolaroidStylePicker
                    selected={theme.polaroid_style}
                    onChange={(polaroid_style) => onChange({ polaroid_style })}
                />

                <div className="h-px bg-white/5" />

                <FontPicker
                    selected={theme.handwriting_font}
                    onChange={(handwriting_font) => onChange({ handwriting_font })}
                />
            </div>
        </div>
    );
}
