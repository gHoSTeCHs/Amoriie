import { ThemeSelector } from '../components/ThemeSelector';
import { usePolaroidCustomizations } from '../hooks/use-polaroid-customizations';

export function StyleStep() {
    const { customizations, setTheme } = usePolaroidCustomizations();

    return (
        <div className="space-y-6">
            <ThemeSelector
                theme={customizations.theme}
                onChange={setTheme}
            />

            <p className="text-center text-sm text-white/40">
                Your choices will be applied to all polaroids
            </p>
        </div>
    );
}
