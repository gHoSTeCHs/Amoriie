import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useMemo } from 'react';

type FloatingHeartsProps = {
    count?: number;
};

type HeartConfig = {
    id: number;
    size: number;
    x: number;
    delay: number;
    duration: number;
    opacity: number;
};

function generateHearts(count: number): HeartConfig[] {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        size: Math.random() * 16 + 12,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 15,
        opacity: Math.random() * 0.15 + 0.05,
    }));
}

export function FloatingHearts({ count = 12 }: FloatingHeartsProps) {
    const hearts = useMemo(() => generateHearts(count), [count]);

    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    className="absolute bottom-0"
                    style={{
                        left: `${heart.x}%`,
                    }}
                    initial={{ y: '100vh', opacity: 0 }}
                    animate={{
                        y: '-100vh',
                        opacity: [0, heart.opacity, heart.opacity, 0],
                    }}
                    transition={{
                        duration: heart.duration,
                        delay: heart.delay,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    <motion.div
                        animate={{
                            x: [0, 20, -20, 0],
                            rotate: [0, 15, -15, 0],
                        }}
                        transition={{
                            duration: heart.duration / 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <Heart
                            className="fill-rose-500 text-rose-500"
                            style={{
                                width: heart.size,
                                height: heart.size,
                            }}
                        />
                    </motion.div>
                </motion.div>
            ))}
        </div>
    );
}
