import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Type, PenTool, Wand2, ChevronDown, Volume2, Frame, Sparkles, Flower2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { SignatureStyle, AnimationSpeed, LoveLetterThemeCustomization } from '../schema';
import type { LetterTheme } from '../themes';
import type { PaletteType, FontType } from '../hooks/use-theme';
import { ColorPicker } from './ColorPicker';
import { FontSelector } from './FontSelector';

type ThemeCustomizerProps = {
    theme: LetterTheme;
    themeCustomization: LoveLetterThemeCustomization;
    getAvailableColors: (type: PaletteType) => string[];
    getAvailableFonts: (type: FontType) => string[];
    setPaperColor: (color: string) => void;
    setInkColor: (color: string) => void;
    setSealColor: (color: string) => void;
    setHeadingFont: (font: string) => void;
    setBodyFont: (font: string) => void;
    setSignatureStyle: (style: SignatureStyle) => void;
    setAnimationSpeed: (speed: AnimationSpeed) => void;
    toggleSounds: (enabled: boolean) => void;
    toggleBorders: (show: boolean) => void;
    toggleDropCap: (show: boolean) => void;
    toggleFlourishes: (show: boolean) => void;
};

type AccordionSection = 'colors' | 'typography' | 'signature' | 'effects';

function ToggleRow({
    icon: Icon,
    label,
    checked,
    onChange,
}: {
    icon: React.ElementType;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className="flex w-full items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
        >
            <div className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 text-stone-500" />
                <span className="text-sm text-stone-300">{label}</span>
            </div>
            <div
                className={cn(
                    'relative h-5 w-9 rounded-full transition-colors duration-200',
                    checked ? 'bg-rose-500' : 'bg-white/10'
                )}
            >
                <div
                    className={cn(
                        'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                        checked ? 'translate-x-4' : 'translate-x-0.5'
                    )}
                />
            </div>
        </button>
    );
}

function AccordionHeader({
    icon: Icon,
    title,
    isOpen,
    onClick,
}: {
    icon: React.ElementType;
    title: string;
    isOpen: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'flex w-full items-center justify-between rounded-xl px-4 py-3',
                'transition-all duration-300',
                isOpen
                    ? 'bg-white/[0.04]'
                    : 'bg-transparent hover:bg-white/[0.02]'
            )}
        >
            <div className="flex items-center gap-3">
                <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300',
                    isOpen
                        ? 'bg-rose-500/20 ring-1 ring-rose-500/30'
                        : 'bg-white/5 ring-1 ring-white/10'
                )}>
                    <Icon className={cn(
                        'h-4 w-4 transition-colors duration-300',
                        isOpen ? 'text-rose-400' : 'text-stone-400'
                    )} />
                </div>
                <span className="font-serif text-sm tracking-wide text-white">
                    {title}
                </span>
            </div>
            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
            >
                <ChevronDown className="h-4 w-4 text-stone-500" />
            </motion.div>
        </button>
    );
}

function ThemeCustomizerComponent({
    theme,
    themeCustomization,
    getAvailableColors,
    getAvailableFonts,
    setPaperColor,
    setInkColor,
    setSealColor,
    setHeadingFont,
    setBodyFont,
    setSignatureStyle,
    setAnimationSpeed,
    toggleSounds,
    toggleBorders,
    toggleDropCap,
    toggleFlourishes,
}: ThemeCustomizerProps) {
    const [openSection, setOpenSection] = useState<AccordionSection | null>('colors');

    const toggleSection = (section: AccordionSection) => {
        setOpenSection(openSection === section ? null : section);
    };

    const signatureOptions: { value: SignatureStyle; label: string }[] = [
        { value: 'handwritten', label: 'Handwritten' },
        { value: 'typed', label: 'Typed' },
        { value: 'initials', label: 'Initials' },
    ];

    const speedOptions: { value: AnimationSpeed; label: string }[] = [
        { value: 'slow', label: 'Slow' },
        { value: 'normal', label: 'Normal' },
        { value: 'fast', label: 'Fast' },
    ];

    return (
        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.02] p-2">
            <div>
                <AccordionHeader
                    icon={Palette}
                    title="Colors"
                    isOpen={openSection === 'colors'}
                    onClick={() => toggleSection('colors')}
                />
                <AnimatePresence>
                    {openSection === 'colors' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-5 px-4 pb-4 pt-3">
                                <ColorPicker
                                    label="Paper"
                                    colors={getAvailableColors('paper')}
                                    selected={themeCustomization.paper_color}
                                    onChange={setPaperColor}
                                />
                                <ColorPicker
                                    label="Ink"
                                    colors={getAvailableColors('ink')}
                                    selected={themeCustomization.ink_color}
                                    onChange={setInkColor}
                                />
                                <ColorPicker
                                    label="Seal"
                                    colors={getAvailableColors('seal')}
                                    selected={themeCustomization.seal_color}
                                    onChange={setSealColor}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div>
                <AccordionHeader
                    icon={Type}
                    title="Typography"
                    isOpen={openSection === 'typography'}
                    onClick={() => toggleSection('typography')}
                />
                <AnimatePresence>
                    {openSection === 'typography' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-5 px-4 pb-4 pt-3">
                                <FontSelector
                                    label="Heading Font"
                                    fonts={getAvailableFonts('heading')}
                                    selected={themeCustomization.heading_font}
                                    onChange={setHeadingFont}
                                />
                                <FontSelector
                                    label="Body Font"
                                    fonts={getAvailableFonts('body')}
                                    selected={themeCustomization.body_font}
                                    onChange={setBodyFont}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div>
                <AccordionHeader
                    icon={PenTool}
                    title="Signature Style"
                    isOpen={openSection === 'signature'}
                    onClick={() => toggleSection('signature')}
                />
                <AnimatePresence>
                    {openSection === 'signature' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-4 pt-3">
                                <div className="grid grid-cols-3 gap-2">
                                    {signatureOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setSignatureStyle(option.value)}
                                            className={cn(
                                                'rounded-lg border px-3 py-2.5 text-sm transition-all duration-200',
                                                themeCustomization.signature_style === option.value
                                                    ? 'border-rose-500/50 bg-rose-500/10 text-white'
                                                    : 'border-white/10 bg-white/[0.02] text-stone-400 hover:border-white/20 hover:text-white'
                                            )}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div>
                <AccordionHeader
                    icon={Wand2}
                    title="Effects"
                    isOpen={openSection === 'effects'}
                    onClick={() => toggleSection('effects')}
                />
                <AnimatePresence>
                    {openSection === 'effects' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-5 px-4 pb-4 pt-3">
                                <div className="space-y-2">
                                    <label className="block font-serif text-sm tracking-wide text-stone-400">
                                        Animation Speed
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {speedOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setAnimationSpeed(option.value)}
                                                className={cn(
                                                    'rounded-lg border px-3 py-2.5 text-sm transition-all duration-200',
                                                    themeCustomization.animation_speed === option.value
                                                        ? 'border-rose-500/50 bg-rose-500/10 text-white'
                                                        : 'border-white/10 bg-white/[0.02] text-stone-400 hover:border-white/20 hover:text-white'
                                                )}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block font-serif text-sm tracking-wide text-stone-400">
                                        Decorations
                                    </label>

                                    <div className="space-y-2">
                                        <ToggleRow
                                            icon={Volume2}
                                            label="Sounds"
                                            checked={themeCustomization.sounds_enabled}
                                            onChange={toggleSounds}
                                        />
                                        <ToggleRow
                                            icon={Frame}
                                            label="Borders"
                                            checked={themeCustomization.show_borders}
                                            onChange={toggleBorders}
                                        />
                                        <ToggleRow
                                            icon={Sparkles}
                                            label="Drop Cap"
                                            checked={themeCustomization.show_drop_cap}
                                            onChange={toggleDropCap}
                                        />
                                        <ToggleRow
                                            icon={Flower2}
                                            label="Flourishes"
                                            checked={themeCustomization.show_flourishes}
                                            onChange={toggleFlourishes}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export const ThemeCustomizer = memo(ThemeCustomizerComponent);
