import { memo, useRef, useLayoutEffect, useMemo } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';

import { parseText, splitTextForAnimation } from '../lib/text-animation-utils';

type InkBleedRevealProps = {
    text: string;
    font: string;
    color: string;
    onStart?: () => void;
    onComplete: () => void;
    speedMultiplier: number;
    reducedMotion?: boolean;
};

function InkBleedReveal({
    text,
    font,
    color,
    onStart,
    onComplete,
    speedMultiplier,
    reducedMotion = false,
}: InkBleedRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const hasStartedRef = useRef(false);

    const segments = useMemo(() => parseText(text), [text]);

    const totalChars = useMemo(() => {
        return segments.reduce((count, segment) => {
            if (segment.type === 'paragraph' && segment.content) {
                return count + segment.content.length;
            }
            return count;
        }, 0);
    }, [segments]);

    useLayoutEffect(() => {
        if (reducedMotion) {
            onStart?.();
            const timeout = setTimeout(() => {
                onComplete();
            }, 600 * speedMultiplier);
            return () => clearTimeout(timeout);
        }

        const chars = containerRef.current?.querySelectorAll('.ink-char');
        if (!chars || chars.length === 0) {
            onComplete();
            return;
        }

        const ctx = gsap.context(() => {
            gsap.set(chars, {
                opacity: 0,
                filter: 'blur(4px)',
                scale: 0.8,
                display: 'inline-block',
            });

            gsap.to(chars, {
                opacity: 1,
                filter: 'blur(0px)',
                scale: 1,
                duration: 0.15 * speedMultiplier,
                stagger: {
                    each: 0.02 * speedMultiplier,
                    onStart: function () {
                        if (!hasStartedRef.current) {
                            hasStartedRef.current = true;
                            onStart?.();
                        }
                    },
                },
                ease: 'power2.out',
                onComplete: () => {
                    onComplete();
                },
            });
        }, containerRef);

        return () => {
            ctx.revert();
            hasStartedRef.current = false;
        };
    }, [text, speedMultiplier, reducedMotion, onStart, onComplete]);

    if (reducedMotion) {
        return (
            <motion.div
                ref={containerRef}
                className="px-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 * speedMultiplier }}
                style={{
                    fontFamily: font,
                    color: color,
                }}
            >
                {segments.map((segment, index) => {
                    if (segment.type === 'linebreak') {
                        return <br key={`br-${index}`} />;
                    }
                    return (
                        <span key={`p-${index}`} className="leading-relaxed">
                            {segment.content}
                        </span>
                    );
                })}
            </motion.div>
        );
    }

    let charIndex = 0;

    return (
        <div
            ref={containerRef}
            className="px-2"
            style={{
                fontFamily: font,
                color: color,
            }}
        >
            <style>{`
                .ink-char {
                    display: inline-block;
                    will-change: opacity, filter, transform;
                    transform-origin: center bottom;
                }

                .ink-char-space {
                    width: 0.3em;
                }
            `}</style>

            {segments.map((segment, segmentIndex) => {
                if (segment.type === 'linebreak') {
                    return <br key={`br-${segmentIndex}`} />;
                }

                const wordSegments = splitTextForAnimation(segment.content || '');

                return (
                    <span
                        key={`segment-${segmentIndex}`}
                        className="leading-[1.9] tracking-wide"
                    >
                        {wordSegments.map((wordSeg, wordIndex) => {
                            if (wordSeg.type === 'space') {
                                const currentCharIndex = charIndex++;
                                return (
                                    <span
                                        key={`space-${segmentIndex}-${wordIndex}`}
                                        className="ink-char ink-char-space"
                                        style={{
                                            animationDelay: `${currentCharIndex * 0.02 * speedMultiplier}s`,
                                        }}
                                        aria-hidden="true"
                                    >
                                        {' '}
                                    </span>
                                );
                            }

                            return (
                                <span
                                    key={`word-${segmentIndex}-${wordIndex}`}
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    {wordSeg.chars.map((char, i) => {
                                        const currentCharIndex = charIndex++;
                                        return (
                                            <span
                                                key={`char-${segmentIndex}-${wordIndex}-${i}`}
                                                className="ink-char"
                                                style={{
                                                    animationDelay: `${currentCharIndex * 0.02 * speedMultiplier}s`,
                                                }}
                                            >
                                                {char}
                                            </span>
                                        );
                                    })}
                                </span>
                            );
                        })}
                    </span>
                );
            })}

            {/* Screen reader accessible version */}
            <span className="sr-only">{text}</span>
        </div>
    );
}

export default memo(InkBleedReveal);
