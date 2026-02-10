import { memo, useRef, useLayoutEffect, useMemo, useState } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';

import { parseText, splitTextForAnimation } from '../lib/text-animation-utils';

type TypewriterRevealProps = {
    text: string;
    font: string;
    color: string;
    onStart?: () => void;
    onComplete: () => void;
    speedMultiplier: number;
    reducedMotion?: boolean;
};

function TypewriterReveal({
    text,
    font,
    color,
    onStart,
    onComplete,
    speedMultiplier,
    reducedMotion = false,
}: TypewriterRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const hasStartedRef = useRef(false);
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    const segments = useMemo(() => parseText(text), [text]);

    useLayoutEffect(() => {
        if (reducedMotion) {
            onStart?.();
            const timeout = setTimeout(() => {
                onComplete();
            }, 600 * speedMultiplier);
            return () => clearTimeout(timeout);
        }

        const chars = containerRef.current?.querySelectorAll('.typewriter-char');
        const cursor = cursorRef.current;

        if (!chars || chars.length === 0) {
            onComplete();
            return;
        }

        const ctx = gsap.context(() => {
            gsap.set(chars, { opacity: 0 });

            const tl = gsap.timeline({
                onComplete: () => {
                    setIsTypingComplete(true);

                    if (cursor) {
                        gsap.to(cursor, {
                            opacity: 0,
                            duration: 0.3,
                            ease: 'power2.out',
                            onComplete: () => {
                                onComplete();
                            },
                        });
                    } else {
                        onComplete();
                    }
                },
            });

            const baseDelay = 0.05 * speedMultiplier;

            chars.forEach((char, index) => {
                const variation = 1 + (Math.random() * 0.4 - 0.2);
                const charDelay = baseDelay * variation;

                tl.to(
                    char,
                    {
                        opacity: 1,
                        duration: 0.01,
                        ease: 'none',
                        onStart: () => {
                            if (!hasStartedRef.current) {
                                hasStartedRef.current = true;
                                onStart?.();
                            }
                        },
                    },
                    index === 0 ? 0 : `+=${charDelay}`
                );
            });
        }, containerRef);

        return () => {
            ctx.revert();
            hasStartedRef.current = false;
            setIsTypingComplete(false);
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
                .typewriter-char {
                    display: inline;
                    will-change: opacity;
                }

                .typewriter-cursor {
                    display: inline-block;
                    width: 0.6em;
                    height: 1.1em;
                    background-color: currentColor;
                    margin-left: 1px;
                    vertical-align: text-bottom;
                }

                .typewriter-cursor--blinking {
                    animation: cursorBlink 0.7s ease-in-out infinite;
                }

                @keyframes cursorBlink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `}</style>

            <div className="leading-[1.8] tracking-wide">
                {segments.map((segment, segmentIndex) => {
                    if (segment.type === 'linebreak') {
                        return <br key={`br-${segmentIndex}`} />;
                    }

                    const wordSegments = splitTextForAnimation(segment.content || '');

                    return (
                        <span key={`segment-${segmentIndex}`}>
                            {wordSegments.map((wordSeg, wordIndex) => {
                                if (wordSeg.type === 'space') {
                                    return (
                                        <span
                                            key={`space-${segmentIndex}-${wordIndex}`}
                                            className="typewriter-char"
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
                                        {wordSeg.chars.map((char, charIndex) => (
                                            <span
                                                key={`char-${segmentIndex}-${wordIndex}-${charIndex}`}
                                                className="typewriter-char"
                                            >
                                                {char}
                                            </span>
                                        ))}
                                    </span>
                                );
                            })}
                        </span>
                    );
                })}

                <span
                    ref={cursorRef}
                    className={`typewriter-cursor ${!isTypingComplete ? 'typewriter-cursor--blinking' : ''}`}
                    aria-hidden="true"
                />
            </div>

            <span className="sr-only">{text}</span>
        </div>
    );
}

export default memo(TypewriterReveal);
