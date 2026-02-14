import { memo, useRef, useLayoutEffect, useMemo, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { motion } from 'framer-motion';

import { parseText } from '../lib/text-animation-utils';

gsap.registerPlugin(ScrollToPlugin);

type FadeLinesRevealProps = {
    text: string;
    font: string;
    color: string;
    scrollContainerRef?: RefObject<HTMLDivElement | null>;
    onStart?: () => void;
    onComplete: () => void;
    speedMultiplier: number;
    reducedMotion?: boolean;
};

function FadeLinesReveal({
    text,
    font,
    color,
    scrollContainerRef,
    onStart,
    onComplete,
    speedMultiplier,
    reducedMotion = false,
}: FadeLinesRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const hasStartedRef = useRef(false);

    const segments = useMemo(() => parseText(text), [text]);

    const lines = useMemo(() => {
        return segments.filter((segment) => segment.type === 'paragraph');
    }, [segments]);

    useLayoutEffect(() => {
        if (reducedMotion) {
            onStart?.();
            const timeout = setTimeout(() => {
                onComplete();
            }, 600 * speedMultiplier);
            return () => clearTimeout(timeout);
        }

        const lineElements = containerRef.current?.querySelectorAll('.fade-line');
        if (!lineElements || lineElements.length === 0) {
            onComplete();
            return;
        }

        const ctx = gsap.context(() => {
            gsap.set(lineElements, {
                opacity: 0,
                y: 15,
            });

            let staggerIndex = 0;

            gsap.to(lineElements, {
                opacity: 1,
                y: 0,
                duration: 0.5 * speedMultiplier,
                stagger: {
                    each: 0.25 * speedMultiplier,
                    onStart: function () {
                        if (!hasStartedRef.current) {
                            hasStartedRef.current = true;
                            onStart?.();
                        }
                        const container = scrollContainerRef?.current;
                        const lineEl = lineElements[staggerIndex++] as HTMLElement;
                        if (container && lineEl) {
                            const lineBottom = lineEl.offsetTop + lineEl.offsetHeight;
                            const visibleBottom = container.scrollTop + container.clientHeight;
                            if (lineBottom > visibleBottom - 40) {
                                gsap.to(container, {
                                    scrollTo: { y: lineBottom - container.clientHeight + 80 },
                                    duration: 0.4,
                                    ease: 'power2.out',
                                    overwrite: true,
                                });
                            }
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
                        <span key={`line-${index}`} className="block leading-[1.9]">
                            {segment.content}
                        </span>
                    );
                })}
            </motion.div>
        );
    }

    let lineIndex = 0;

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
                .fade-line {
                    display: block;
                    will-change: opacity, transform;
                    line-height: 1.9;
                    letter-spacing: 0.02em;
                }
            `}</style>

            {segments.map((segment, segmentIndex) => {
                if (segment.type === 'linebreak') {
                    return <br key={`br-${segmentIndex}`} />;
                }

                const currentLineIndex = lineIndex++;

                return (
                    <span
                        key={`line-${segmentIndex}`}
                        className="fade-line"
                        data-line-index={currentLineIndex}
                    >
                        {segment.content}
                    </span>
                );
            })}

            <span className="sr-only">{text}</span>
        </div>
    );
}

export default memo(FadeLinesReveal);
