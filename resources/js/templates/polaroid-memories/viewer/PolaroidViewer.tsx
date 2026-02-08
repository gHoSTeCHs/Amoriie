import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Watermark } from '@/components/shared/Watermark';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import { useFontPreload } from '@/hooks/use-font-preload';
import { useValentineProgress } from '@/hooks/use-valentine-progress';
import type { ViewerResponse, ViewerStage } from '@/types/viewer';
import { useViewerTheme } from '../hooks/use-viewer-theme';
import type { PolaroidCustomizations } from '../schema';
import { CelebrationScreen } from './CelebrationScreen';
import { DeclinedScreen } from './DeclinedScreen';
import { FinalScreen } from './FinalScreen';
import { IntroScreen } from './IntroScreen';
import { PolaroidStack } from './PolaroidStack';

export type PolaroidViewerProps = {
    customizations: PolaroidCustomizations;
    slug: string;
    onResponse?: (response: ViewerResponse) => void;
};

export function PolaroidViewer({
    customizations,
    slug,
    onResponse,
}: PolaroidViewerProps) {
    const [stage, setStage] = useState<ViewerStage>('intro');

    // console.log(customizations)

    const theme = useViewerTheme(customizations.theme);
    const { isLoaded: fontLoaded } = useFontPreload({
        fontUrl: theme.fontUrl,
        fontFamily: theme.fontFamily,
    });

    const hasAudio = Boolean(customizations.audio?.background_music);
    const audio = useAudioPlayer({
        src: customizations.audio?.background_music || null,
        loop: true,
        volume: 0.6,
    });

    const { trackProgress, trackResponse } = useValentineProgress({ slug });

    const validMemories = (customizations.memories ?? []).filter(
        (m) => m.image,
    );

    const handleStart = useCallback(() => {
        if (hasAudio && audio.isReady) {
            audio.play();
        }

        if (validMemories.length === 0) {
            setStage('final');
            trackProgress('final');
        } else {
            setStage('memories');
            trackProgress('memories', 0);
        }
    }, [hasAudio, audio, trackProgress, validMemories.length]);

    const handleMemoriesProgress = useCallback(
        (index: number) => {
            trackProgress('memories', index);
        },
        [trackProgress],
    );

    const handleMemoriesComplete = useCallback(() => {
        setStage('final');
        trackProgress('final');
    }, [trackProgress]);

    const handleResponse = useCallback(
        async (response: ViewerResponse) => {
            await trackResponse(response);
            onResponse?.(response);

            if (response === 'yes') {
                setStage('celebration');
                trackProgress('celebration');
            } else {
                setStage('declined');
                trackProgress('declined');
            }
        },
        [trackResponse, trackProgress, onResponse],
    );

    if (!fontLoaded) {
        return (
            <div className={`min-h-dvh ${theme.backgroundClass}`}>
                <div className="flex min-h-dvh items-center justify-center">
                    <motion.div
                        className="h-8 w-8 rounded-full border-2 border-rose-400 border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={`relative min-h-dvh ${theme.backgroundClass}`}>
            {hasAudio && stage !== 'intro' && (
                <motion.button
                    onClick={audio.toggleMute}
                    className={`fixed top-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm transition-colors ${
                        theme.isDarkBackground
                            ? 'bg-white/10 text-white hover:bg-white/20'
                            : 'bg-black/10 text-stone-700 hover:bg-black/20'
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    aria-label={audio.isMuted ? 'Unmute' : 'Mute'}
                >
                    {audio.isMuted ? (
                        <VolumeX className="h-5 w-5" />
                    ) : (
                        <Volume2 className="h-5 w-5" />
                    )}
                </motion.button>
            )}

            <AnimatePresence mode="wait">
                {stage === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <IntroScreen
                            title={customizations.title ?? ''}
                            recipientName={
                                customizations.recipient_name ?? 'You'
                            }
                            hasAudio={hasAudio}
                            theme={theme}
                            onStart={handleStart}
                        />
                    </motion.div>
                )}

                {stage === 'memories' && (
                    <motion.div
                        key="memories"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <PolaroidStack
                            memories={validMemories}
                            theme={theme}
                            onProgress={handleMemoriesProgress}
                            onComplete={handleMemoriesComplete}
                        />
                    </motion.div>
                )}

                {stage === 'final' && (
                    <motion.div
                        key="final"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <FinalScreen
                            recipientName={
                                customizations.recipient_name ?? 'You'
                            }
                            senderName={customizations.sender_name ?? ''}
                            finalMessage={customizations.final_message}
                            theme={theme}
                            onResponse={handleResponse}
                        />
                    </motion.div>
                )}

                {stage === 'celebration' && (
                    <motion.div
                        key="celebration"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <CelebrationScreen
                            yesResponse={customizations.yes_response}
                            theme={theme}
                        />
                    </motion.div>
                )}

                {stage === 'declined' && (
                    <motion.div
                        key="declined"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <DeclinedScreen theme={theme} />
                    </motion.div>
                )}
            </AnimatePresence>

            <Watermark
                variant={theme.isDarkBackground ? 'dark' : 'light'}
                position="bottom-center"
                delay={2}
            />
        </div>
    );
}
