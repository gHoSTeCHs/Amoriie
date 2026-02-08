import { Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import { Clock, Heart, Home, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

import { VALENTINE_CONFIG } from '@/lib/constraints';

type ExpiredScreenProps = {
    recipientName?: string;
};

type FallingPetal = {
    id: number;
    x: number;
    delay: number;
    duration: number;
    size: number;
    rotation: number;
};

function FallingPetals() {
    const [petals, setPetals] = useState<FallingPetal[]>([]);
    const [viewportHeight, setViewportHeight] = useState(800);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        setViewportHeight(window.innerHeight);

        const generated: FallingPetal[] = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 8,
            duration: 12 + Math.random() * 8,
            size: 10 + Math.random() * 14,
            rotation: Math.random() * 360,
        }));
        setPetals(generated);
    }, []);

    if (shouldReduceMotion) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
            {petals.map((petal) => (
                <motion.div
                    key={petal.id}
                    className="absolute text-rose-500/20"
                    style={{
                        left: `${petal.x}%`,
                        top: '-30px',
                        fontSize: petal.size,
                    }}
                    animate={{
                        y: [0, viewportHeight + 100],
                        x: [0, Math.sin(petal.id * 0.5) * 80],
                        rotate: [petal.rotation, petal.rotation + 360],
                        opacity: [0.3, 0.15, 0],
                    }}
                    transition={{
                        duration: petal.duration,
                        delay: petal.delay,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    <Heart fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
}

export function ExpiredScreen({ recipientName }: ExpiredScreenProps) {
    const shouldReduceMotion = useReducedMotion();
    const personalizedMessage = recipientName
        ? `The valentine for ${recipientName} is no longer available`
        : 'This valentine is no longer available';

    return (
        <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#0c0607] px-6 py-12">
            <FallingPetals />

            <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 30%, rgba(159,18,57,0.15) 0%, transparent 60%)',
                }}
            />

            <div className="absolute left-1/4 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-900/20 blur-3xl" aria-hidden="true" />
            <div className="absolute bottom-1/4 right-1/4 h-48 w-48 translate-x-1/2 translate-y-1/2 rounded-full bg-pink-900/15 blur-3xl" aria-hidden="true" />

            <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? undefined : { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
                className="relative z-10 max-w-md text-center"
            >
                <motion.div
                    initial={shouldReduceMotion ? undefined : { scale: 0.8, opacity: 0 }}
                    animate={shouldReduceMotion ? undefined : { scale: 1, opacity: 1 }}
                    transition={shouldReduceMotion ? undefined : { delay: 0.2, duration: 0.6, type: 'spring' as const, stiffness: 200 }}
                    className="relative mx-auto mb-8 inline-flex"
                >
                    <div className={`absolute inset-0 rounded-full bg-rose-500/20 blur-xl ${shouldReduceMotion ? '' : 'animate-pulse'}`} aria-hidden="true" />
                    <div className="relative rounded-full border border-rose-500/20 bg-gradient-to-br from-rose-950/60 to-rose-900/40 p-6 backdrop-blur-sm">
                        <Clock className="h-12 w-12 text-rose-400" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    {!shouldReduceMotion && (
                        <motion.div
                            className="absolute -right-1 -top-1"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            aria-hidden="true"
                        >
                            <Sparkles className="h-5 w-5 text-rose-300/60" />
                        </motion.div>
                    )}
                </motion.div>

                <motion.h1
                    initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                    transition={shouldReduceMotion ? undefined : { delay: 0.3 }}
                    className="mb-4 text-3xl text-white md:text-4xl"
                    style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 500,
                    }}
                >
                    This Valentine Has Expired
                </motion.h1>

                <motion.p
                    initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                    transition={shouldReduceMotion ? undefined : { delay: 0.4 }}
                    className="mb-3 text-lg text-rose-100/70"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                    {personalizedMessage}
                </motion.p>

                <motion.p
                    initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                    transition={shouldReduceMotion ? undefined : { delay: 0.5 }}
                    className="mb-10 text-sm text-rose-100/40"
                >
                    Valentines are available for {VALENTINE_CONFIG.EXPIRATION_DAYS} days after creation
                </motion.p>

                <motion.div
                    initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                    transition={shouldReduceMotion ? undefined : { delay: 0.6 }}
                    className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                >
                    <Link
                        href="/create"
                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-7 py-3.5 font-medium text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-xl hover:shadow-rose-500/30"
                    >
                        <Heart className="h-4 w-4" fill="currentColor" />
                        <span className="relative z-10">Create Your Own Valentine</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/5 px-6 py-3 text-sm text-rose-100/80 transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-white"
                    >
                        <Home className="h-4 w-4" />
                        Go Home
                    </Link>
                </motion.div>
            </motion.div>

            <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                transition={shouldReduceMotion ? undefined : { delay: 1 }}
                className="absolute bottom-6 flex items-center gap-1.5 text-xs text-rose-100/30"
            >
                <Heart className="h-3 w-3 fill-current text-rose-400/50" aria-hidden="true" />
                <span>Amoriie</span>
            </motion.div>
        </div>
    );
}
