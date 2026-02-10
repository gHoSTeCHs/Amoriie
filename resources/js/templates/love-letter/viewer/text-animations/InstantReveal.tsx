import { memo, useLayoutEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

import { parseText } from '../lib/text-animation-utils';

type InstantRevealProps = {
    text: string;
    font: string;
    color: string;
    onStart?: () => void;
    onComplete: () => void;
    speedMultiplier: number;
    reducedMotion?: boolean;
};

function InstantReveal({
    text,
    font,
    color,
    onStart,
    onComplete,
    speedMultiplier,
    reducedMotion = false,
}: InstantRevealProps) {
    const segments = useMemo(() => parseText(text), [text]);
    const duration = 0.2 * speedMultiplier;

    useLayoutEffect(() => {
        onStart?.();
    }, [onStart]);

    return (
        <motion.div
            className="px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: reducedMotion ? 0.1 : duration,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            onAnimationComplete={() => onComplete()}
            style={{
                fontFamily: font,
                color: color,
            }}
        >
            <div className="leading-relaxed tracking-wide">
                {segments.map((segment, index) => {
                    if (segment.type === 'linebreak') {
                        return <br key={`br-${index}`} />;
                    }
                    return (
                        <span key={`segment-${index}`} className="leading-[1.8]">
                            {segment.content}
                        </span>
                    );
                })}
            </div>

            <span className="sr-only">{text}</span>
        </motion.div>
    );
}

export default memo(InstantReveal);
