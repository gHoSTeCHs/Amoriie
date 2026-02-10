import { memo, useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useAudioPlayer } from '@/hooks/use-audio-player';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useValentineProgress } from '@/hooks/use-valentine-progress';
import { useViewerTheme } from '../hooks/use-viewer-theme';
import { useViewerSoundManager } from '../hooks/use-viewer-sound-manager';
import { getTheme } from '../themes';
import { getDefaultLoveLetterCustomizations } from '../schema';
import type { LoveLetterCustomizations } from '../schema';
import type { LoveLetterStage, ViewerResponse } from './types';

export type LoveLetterViewerProps = {
    customizations: LoveLetterCustomizations;
    slug?: string;
    onResponse?: (response: ViewerResponse) => void;
};

import AmbientEffects from './AmbientEffects';
import IntroScreen from './IntroScreen';
import EnvelopeOpen from './EnvelopeOpen';
import LetterReveal from './LetterReveal';
import FinalScreen from './FinalScreen';
import CelebrationScreen from './CelebrationScreen';
import DeclinedScreen from './DeclinedScreen';

function isValidCustomizations(data: unknown): data is LoveLetterCustomizations {
    if (!data || typeof data !== 'object') return false;
    const c = data as Record<string, unknown>;
    return (
        typeof c.recipient_name === 'string' &&
        typeof c.sender_name === 'string' &&
        typeof c.letter_text === 'string' &&
        typeof c.theme_id === 'string'
    );
}

const stageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4 },
};

function LoveLetterViewer({ customizations, slug = '' }: LoveLetterViewerProps) {
    const [stage, setStage] = useState<LoveLetterStage>('intro');
    const reducedMotion = useReducedMotion();

    const isValid = isValidCustomizations(customizations);

    const safeCustomizations = useMemo(() => {
        if (isValid) return customizations;
        return getDefaultLoveLetterCustomizations();
    }, [customizations, isValid]);

    const themeConfig = useMemo(
        () => getTheme(safeCustomizations.theme_id),
        [safeCustomizations.theme_id]
    );

    const viewerTheme = useViewerTheme(
        safeCustomizations.theme_id,
        safeCustomizations.customization
    );

    const { trackProgress, trackResponse } = useValentineProgress({ slug, enabled: isValid });

    const soundManager = useViewerSoundManager({
        theme: themeConfig,
        enabled: safeCustomizations.customization.sounds_enabled && isValid,
    });

    const {
        playSound,
        startAmbient,
        stopAmbient,
        isEnabled: soundEnabled,
        setEnabled: setSoundEnabled,
    } = soundManager;

    const hasBackgroundMusic = Boolean(safeCustomizations.audio?.background_music);
    const audioPlayer = useAudioPlayer({
        src: isValid ? safeCustomizations.audio?.background_music || null : null,
        loop: true,
        volume: 0.5,
    });

    const handleIntroStart = useCallback(() => {
        trackProgress('intro');

        if (hasBackgroundMusic) {
            audioPlayer.play();
        }

        startAmbient();
        setStage('envelope');
    }, [trackProgress, hasBackgroundMusic, audioPlayer, startAmbient]);

    const handleSealBreak = useCallback(() => {
        playSound('seal_break');
    }, [playSound]);

    const handleEnvelopeComplete = useCallback(() => {
        trackProgress('envelope');
        setStage('letter');
    }, [trackProgress]);

    const handleTextRevealStart = useCallback(() => {
        playSound('text_reveal');
    }, [playSound]);

    const handleLetterComplete = useCallback(() => {
        trackProgress('letter');
        setStage('final');
    }, [trackProgress]);

    const handleResponse = useCallback(
        async (response: ViewerResponse) => {
            trackProgress('final');
            await trackResponse(response);

            stopAmbient();
            audioPlayer.pause();

            if (response === 'yes') {
                trackProgress('celebration');
                setStage('celebration');
            } else {
                trackProgress('declined');
                setStage('declined');
            }
        },
        [trackProgress, trackResponse, stopAmbient, audioPlayer]
    );

    if (!isValid) {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-stone-900 p-6">
                <div className="text-center">
                    <h1 className="mb-2 text-xl text-stone-100">Unable to Load Letter</h1>
                    <p className="text-stone-400">
                        This letter may have been removed or is unavailable.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative min-h-dvh overflow-hidden"
            style={{ backgroundColor: viewerTheme.backgroundColor }}
        >
            {/* Ambient effects layer */}
            {stage !== 'celebration' && stage !== 'declined' && (
                <AmbientEffects
                    effects={themeConfig.ambient.effects}
                    particleColor={themeConfig.ambient.particle_color}
                    reducedMotion={reducedMotion}
                />
            )}

            {/* Audio mute toggle */}
            {stage !== 'intro' && (hasBackgroundMusic || soundEnabled) && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => {
                        audioPlayer.toggleMute();
                        setSoundEnabled(!soundEnabled);
                    }}
                    className="fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full transition-colors"
                    style={{
                        backgroundColor: viewerTheme.isDarkBackground
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.1)',
                        color: viewerTheme.isDarkBackground ? '#f5f0e1' : '#2d1810',
                    }}
                    aria-label={audioPlayer.isMuted ? 'Unmute' : 'Mute'}
                >
                    {audioPlayer.isMuted || !soundEnabled ? (
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            <line x1="23" y1="9" x2="17" y2="15" />
                            <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                    ) : (
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                        </svg>
                    )}
                </motion.button>
            )}

            {/* Stage content */}
            <AnimatePresence mode="wait">
                {stage === 'intro' && (
                    <motion.div key="intro" {...stageTransition}>
                        <IntroScreen
                            recipientName={safeCustomizations.recipient_name}
                            senderName={safeCustomizations.sender_name}
                            theme={viewerTheme}
                            onStart={handleIntroStart}
                        />
                    </motion.div>
                )}

                {stage === 'envelope' && (
                    <motion.div key="envelope" {...stageTransition}>
                        <EnvelopeOpen
                            animationType={themeConfig.animations.envelope_open}
                            theme={viewerTheme}
                            onSealBreak={handleSealBreak}
                            onComplete={handleEnvelopeComplete}
                            reducedMotion={reducedMotion}
                        />
                    </motion.div>
                )}

                {stage === 'letter' && (
                    <motion.div key="letter" {...stageTransition}>
                        <LetterReveal
                            letterText={safeCustomizations.letter_text}
                            letterDate={safeCustomizations.letter_date}
                            recipientName={safeCustomizations.recipient_name}
                            senderName={safeCustomizations.sender_name}
                            theme={viewerTheme}
                            onTextRevealStart={handleTextRevealStart}
                            onComplete={handleLetterComplete}
                            reducedMotion={reducedMotion}
                        />
                    </motion.div>
                )}

                {stage === 'final' && (
                    <motion.div key="final" {...stageTransition}>
                        <FinalScreen
                            recipientName={safeCustomizations.recipient_name}
                            senderName={safeCustomizations.sender_name}
                            finalMessageText={safeCustomizations.final_message.text}
                            askText={safeCustomizations.final_message.ask_text}
                            theme={viewerTheme}
                            onResponse={handleResponse}
                        />
                    </motion.div>
                )}

                {stage === 'celebration' && (
                    <motion.div key="celebration" {...stageTransition}>
                        <CelebrationScreen
                            message={safeCustomizations.yes_response.message}
                            theme={viewerTheme}
                        />
                    </motion.div>
                )}

                {stage === 'declined' && (
                    <motion.div key="declined" {...stageTransition}>
                        <DeclinedScreen theme={viewerTheme} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default memo(LoveLetterViewer);
