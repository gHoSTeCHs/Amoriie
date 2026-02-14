import { useCallback, useState } from 'react';
import { nanoid } from 'nanoid';
import { store } from '@/actions/App/Http/Controllers/ValentineController';
import type { PublishResult, UploadItem } from '@/types/publish';
import type { PolaroidCustomizations } from '@/templates/polaroid-memories/schema';
import type { LoveLetterCustomizations } from '@/templates/love-letter/schema';
import type { AnyTemplateCustomizations } from '@/types/customizations';
import { apiPostFormData, ApiError, getErrorMessage } from '@/lib/api-client';

type PublishOptions = {
    templateId: string;
    slug: string;
    customizations: AnyTemplateCustomizations;
    creatorEmail?: string;
    notifyOnResponse?: boolean;
};

function isPolaroidCustomizations(c: AnyTemplateCustomizations): c is PolaroidCustomizations {
    return 'memories' in c && Array.isArray((c as PolaroidCustomizations).memories);
}

function isLoveLetterCustomizations(c: AnyTemplateCustomizations): c is LoveLetterCustomizations {
    return 'letter_text' in c && 'theme_id' in c;
}

type UsePublishReturn = {
    isPublishing: boolean;
    uploadItems: UploadItem[];
    result: PublishResult | null;
    publish: (options: PublishOptions) => Promise<PublishResult>;
    resetPublish: () => void;
};

export function usePublish(): UsePublishReturn {
    const [isPublishing, setIsPublishing] = useState(false);
    const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
    const [result, setResult] = useState<PublishResult | null>(null);

    const updateItemProgress = useCallback((id: string, progress: number) => {
        setUploadItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, progress, status: 'uploading' } : item
            )
        );
    }, []);

    const updateItemStatus = useCallback(
        (id: string, status: UploadItem['status'], error?: string) => {
            setUploadItems((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? { ...item, status, error, progress: status === 'complete' ? 100 : item.progress }
                        : item
                )
            );
        },
        []
    );

    const collectMediaFiles = useCallback((customizations: AnyTemplateCustomizations) => {
        const items: UploadItem[] = [];
        const files: { images: Array<{ file: File; memoryIndex: number }>; audio: File | null } = { images: [], audio: null };

        if (isPolaroidCustomizations(customizations)) {
            customizations.memories.forEach((memory, memoryIndex) => {
                if (memory.image_file) {
                    const id = nanoid();
                    items.push({
                        id,
                        name: memory.caption || `Photo ${memoryIndex + 1}`,
                        type: 'image',
                        status: 'pending',
                        progress: 0,
                    });
                    files.images.push({ file: memory.image_file, memoryIndex });
                }
            });
        }

        const audioSource = isPolaroidCustomizations(customizations)
            ? customizations.audio
            : isLoveLetterCustomizations(customizations)
              ? customizations.audio
              : null;

        if (audioSource && (audioSource.trimmed_blob || audioSource.background_music_file)) {
            const id = nanoid();
            const audioFile =
                audioSource.trimmed_blob instanceof Blob
                    ? new File(
                          [audioSource.trimmed_blob],
                          audioSource.filename || 'background-music.mp3',
                          { type: 'audio/mpeg' }
                      )
                    : audioSource.background_music_file;

            if (audioFile) {
                items.push({
                    id,
                    name: 'Background Music',
                    type: 'audio',
                    status: 'pending',
                    progress: 0,
                });
                files.audio = audioFile;
            }
        }

        return { items, files };
    }, []);

    const buildFormData = useCallback(
        (
            options: PublishOptions,
            files: { images: Array<{ file: File; memoryIndex: number }>; audio: File | null }
        ): FormData => {
            const formData = new FormData();

            formData.append('template_id', options.templateId);
            formData.append('slug', options.slug);

            if (options.creatorEmail) {
                formData.append('creator_email', options.creatorEmail);
            }

            formData.append('notify_on_response', options.notifyOnResponse ? '1' : '0');

            let cleanCustomizations: Record<string, unknown>;

            if (isPolaroidCustomizations(options.customizations)) {
                formData.append('recipient_name', options.customizations.recipient_name);
                formData.append('sender_name', options.customizations.sender_name);
                cleanCustomizations = {
                    ...options.customizations,
                    memories: options.customizations.memories.map(({ image_file, ...rest }) => rest),
                    audio: {
                        background_music: options.customizations.audio.background_music,
                    },
                    yes_response: {
                        ...options.customizations.yes_response,
                        reveal_photo_file: undefined,
                    },
                };
            } else if (isLoveLetterCustomizations(options.customizations)) {
                formData.append('recipient_name', options.customizations.recipient_name);
                formData.append('sender_name', options.customizations.sender_name);
                cleanCustomizations = {
                    ...options.customizations,
                    audio: {
                        background_music: options.customizations.audio.background_music,
                    },
                };
            } else {
                cleanCustomizations = options.customizations as Record<string, unknown>;
            }

            formData.append('customizations', JSON.stringify(cleanCustomizations));

            files.images.forEach((item, index) => {
                formData.append(`images[${index}]`, item.file);
                formData.append(`image_metadata[${index}][sort_order]`, String(item.memoryIndex));
            });

            if (files.audio) {
                formData.append('audio', files.audio);
            }

            return formData;
        },
        []
    );

    const publish = useCallback(
        async (options: PublishOptions): Promise<PublishResult> => {
            setIsPublishing(true);
            setResult(null);

            const { items, files } = collectMediaFiles(options.customizations);

            const hasMedia = items.length > 0;
            if (!hasMedia) {
                items.push({
                    id: nanoid(),
                    name: 'Creating Valentine',
                    type: 'image',
                    status: 'pending',
                    progress: 0,
                });
            }

            setUploadItems(items);

            const fileSizes = hasMedia
                ? items.map((item, index) => {
                    if (item.type === 'image') return files.images[index]?.file.size || 0;
                    return files.audio?.size || 0;
                })
                : [];
            const totalSize = fileSizes.reduce((a, b) => a + b, 0);

            items.forEach((item) => updateItemStatus(item.id, 'uploading'));

            const formData = buildFormData(options, files);

            let progressInterval: ReturnType<typeof setInterval> | undefined;
            if (!hasMedia) {
                let simulatedProgress = 0;
                progressInterval = setInterval(() => {
                    simulatedProgress = Math.min(simulatedProgress + Math.random() * 15 + 5, 90);
                    items.forEach((item) => updateItemProgress(item.id, Math.round(simulatedProgress)));
                }, 300);
            }

            try {
                const response = await apiPostFormData<{ valentine: PublishResult['valentine'] }>(
                    store.url(),
                    formData,
                    {
                        onProgress: (overallProgress) => {
                            if (!hasMedia) return;

                            const uploadedBytes = (overallProgress / 100) * totalSize;
                            let accumulated = 0;

                            items.forEach((item, index) => {
                                const fileSize = fileSizes[index];
                                const fileEnd = accumulated + fileSize;

                                if (uploadedBytes >= fileEnd) {
                                    updateItemProgress(item.id, 100);
                                } else if (uploadedBytes > accumulated) {
                                    const fileProgress = Math.round(
                                        ((uploadedBytes - accumulated) / fileSize) * 100
                                    );
                                    updateItemProgress(item.id, Math.min(fileProgress, 99));
                                }
                                accumulated = fileEnd;
                            });
                        },
                    }
                );

                if (progressInterval) clearInterval(progressInterval);
                items.forEach((item) => updateItemStatus(item.id, 'complete'));
                const publishResult: PublishResult = {
                    success: true,
                    valentine: response.valentine,
                };
                setResult(publishResult);
                setIsPublishing(false);
                return publishResult;
            } catch (error) {
                if (progressInterval) clearInterval(progressInterval);
                const errorMessage = getErrorMessage(error);
                const errorResult: PublishResult = {
                    success: false,
                    error: errorMessage,
                };
                items.forEach((item) => updateItemStatus(item.id, 'error', errorMessage));
                setResult(errorResult);
                setIsPublishing(false);
                return errorResult;
            }
        },
        [collectMediaFiles, buildFormData, updateItemProgress, updateItemStatus]
    );

    const resetPublish = useCallback(() => {
        setIsPublishing(false);
        setUploadItems([]);
        setResult(null);
    }, []);

    return {
        isPublishing,
        uploadItems,
        result,
        publish,
        resetPublish,
    };
}
