import { useCallback, useState } from 'react';
import { nanoid } from 'nanoid';
import { store } from '@/actions/App/Http/Controllers/ValentineController';
import type { PublishResult, UploadItem } from '@/types/publish';
import type { PolaroidCustomizations } from '@/templates/polaroid-memories/schema';
import { apiPostFormData, ApiError, getErrorMessage } from '@/lib/api-client';

type PublishOptions = {
    templateId: string;
    slug: string;
    customizations: PolaroidCustomizations;
    creatorEmail?: string;
    notifyOnResponse?: boolean;
};

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

    const collectMediaFiles = useCallback((customizations: PolaroidCustomizations) => {
        const items: UploadItem[] = [];
        const files: { images: Array<{ file: File; memoryIndex: number }>; audio: File | null } = { images: [], audio: null };

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

        if (customizations.audio.trimmed_blob || customizations.audio.background_music_file) {
            const id = nanoid();
            const audioFile =
                customizations.audio.trimmed_blob instanceof Blob
                    ? new File(
                          [customizations.audio.trimmed_blob],
                          customizations.audio.filename || 'background-music.mp3',
                          { type: 'audio/mpeg' }
                      )
                    : customizations.audio.background_music_file;

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
            formData.append('recipient_name', options.customizations.recipient_name);
            formData.append('sender_name', options.customizations.sender_name);

            if (options.creatorEmail) {
                formData.append('creator_email', options.creatorEmail);
            }

            formData.append('notify_on_response', options.notifyOnResponse ? '1' : '0');

            const cleanCustomizations = {
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
            setUploadItems(items);

            const fileSizes = items.map((item, index) => {
                if (item.type === 'image') return files.images[index]?.file.size || 0;
                return files.audio?.size || 0;
            });
            const totalSize = fileSizes.reduce((a, b) => a + b, 0);

            items.forEach((item) => updateItemStatus(item.id, 'uploading'));

            const formData = buildFormData(options, files);

            try {
                const response = await apiPostFormData<{ valentine: PublishResult['valentine'] }>(
                    store.url(),
                    formData,
                    {
                        onProgress: (overallProgress) => {
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

                items.forEach((item) => updateItemStatus(item.id, 'complete'));
                const publishResult: PublishResult = {
                    success: true,
                    valentine: response.valentine,
                };
                setResult(publishResult);
                setIsPublishing(false);
                return publishResult;
            } catch (error) {
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
