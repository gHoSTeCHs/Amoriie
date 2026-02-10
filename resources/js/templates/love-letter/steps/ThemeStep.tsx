import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Palette, Paintbrush } from 'lucide-react';

import { StepValidationAlert } from '@/components/shared/StepValidationAlert';
import { getAllThemes } from '../themes';
import { ThemeCard } from '../components/ThemeCard';
import { ThemeCustomizer } from '../components/ThemeCustomizer';
import { useTheme } from '../hooks/use-theme';
import { useLoveLetterValidation } from '../hooks/use-love-letter-validation';

export function ThemeStep() {
    const {
        theme,
        themeId,
        themeCustomization,
        changeTheme,
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
    } = useTheme();

    const validation = useLoveLetterValidation('style');
    const themes = useMemo(() => getAllThemes(), []);

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 ring-1 ring-rose-500/30">
                        <Palette className="h-4 w-4 text-rose-400" />
                    </div>
                    <h3 className="font-serif text-lg tracking-wide text-white">
                        Choose Your Theme
                    </h3>
                </div>

                <p className="font-serif text-sm leading-relaxed text-stone-400">
                    Each theme sets the mood with unique colors, typography, and animations.
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {themes.map((t, index) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                            }}
                        >
                            <ThemeCard
                                theme={t}
                                isSelected={t.id === themeId}
                                onSelect={() => changeTheme(t.id)}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            {themeId && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 ring-1 ring-violet-500/30">
                            <Paintbrush className="h-4 w-4 text-violet-400" />
                        </div>
                        <h3 className="font-serif text-lg tracking-wide text-white">
                            Customize Your Theme
                        </h3>
                    </div>

                    <p className="font-serif text-sm leading-relaxed text-stone-400">
                        Fine-tune the details to make it uniquely yours.
                    </p>

                    <ThemeCustomizer
                        theme={theme}
                        themeCustomization={themeCustomization}
                        getAvailableColors={getAvailableColors}
                        getAvailableFonts={getAvailableFonts}
                        setPaperColor={setPaperColor}
                        setInkColor={setInkColor}
                        setSealColor={setSealColor}
                        setHeadingFont={setHeadingFont}
                        setBodyFont={setBodyFont}
                        setSignatureStyle={setSignatureStyle}
                        setAnimationSpeed={setAnimationSpeed}
                        toggleSounds={toggleSounds}
                        toggleBorders={toggleBorders}
                        toggleDropCap={toggleDropCap}
                        toggleFlourishes={toggleFlourishes}
                    />
                </motion.div>
            )}

            <StepValidationAlert
                errors={validation.errors}
                warnings={validation.warnings}
            />
        </div>
    );
}
