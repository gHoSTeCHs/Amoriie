import { useState, useCallback, useRef, type RefObject } from 'react';
import type { NoButtonBehavior } from '@/types/viewer';

const MAX_ATTEMPTS = 6;
const SHRINK_FACTOR = 0.85;
const GROW_FACTOR = 1.12;
const MIN_NO_SCALE = 0.3;
const MAX_YES_SCALE = 1.8;

const PLEAD_MESSAGES = [
    'No',
    'Are you sure?',
    'Really sure?',
    'Please reconsider...',
    "You're breaking my heart!",
    'Pretty please? 🥺',
];

type NoButtonPosition = { x: number; y: number } | null;

type UseNoButtonReturn = {
    noAttempts: number;
    noButtonText: string;
    noButtonPosition: NoButtonPosition;
    yesButtonScale: number;
    noButtonScale: number;
    showGracefulDecline: boolean;
    handleNoClick: () => void;
};

function generateDodgePosition(
    containerRef: RefObject<HTMLDivElement | null>,
    buttonWidth: number,
    buttonHeight: number,
): NoButtonPosition {
    const container = containerRef.current;
    if (!container) return null;

    const rect = container.getBoundingClientRect();
    const padding = 8;
    const maxX = rect.width - buttonWidth - padding;
    const maxY = rect.height - buttonHeight - padding;

    return {
        x: Math.max(padding, Math.random() * maxX),
        y: Math.max(padding, Math.random() * maxY),
    };
}

export function useNoButtonBehavior(
    behavior: NoButtonBehavior,
    onDecline: () => void,
    containerRef: RefObject<HTMLDivElement | null>,
): UseNoButtonReturn {
    const [noAttempts, setNoAttempts] = useState(0);
    const [noButtonPosition, setNoButtonPosition] = useState<NoButtonPosition>(null);
    const buttonDimensions = useRef({ width: 120, height: 48 });

    const showGracefulDecline = behavior !== 'simple' && noAttempts >= MAX_ATTEMPTS;

    const noButtonText = behavior === 'plead'
        ? PLEAD_MESSAGES[Math.min(noAttempts, PLEAD_MESSAGES.length - 1)]
        : 'No';

    const noButtonScale = behavior === 'shrink-grow'
        ? Math.max(MIN_NO_SCALE, Math.pow(SHRINK_FACTOR, noAttempts))
        : 1;

    const yesButtonScale = behavior === 'shrink-grow'
        ? Math.min(MAX_YES_SCALE, Math.pow(GROW_FACTOR, noAttempts))
        : 1;

    const handleNoClick = useCallback(() => {
        if (behavior === 'simple') {
            onDecline();
            return;
        }

        const nextAttempts = noAttempts + 1;
        setNoAttempts(nextAttempts);

        if (behavior === 'dodge') {
            const newPos = generateDodgePosition(
                containerRef,
                buttonDimensions.current.width,
                buttonDimensions.current.height,
            );
            setNoButtonPosition(newPos);
        }
    }, [behavior, noAttempts, onDecline, containerRef]);

    return {
        noAttempts,
        noButtonText,
        noButtonPosition,
        yesButtonScale,
        noButtonScale,
        showGracefulDecline,
        handleNoClick,
    };
}
