<?php

namespace App\Services;

use App\Enums\MediaType;
use App\Models\Media;
use App\Models\Valentine;
use App\Services\Contracts\MediaServiceInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class MediaService implements MediaServiceInterface
{
    public function __construct(
        protected R2StorageService $r2Storage,
        protected ImageProcessingService $imageProcessor
    ) {}

    /**
     * @param  array<string, mixed>  $metadata
     */
    public function uploadImage(
        Valentine $valentine,
        UploadedFile $file,
        array $metadata = []
    ): Media {
        $cropData = $metadata['crop'] ?? [];

        $processed = empty($cropData)
            ? $this->imageProcessor->processImage($file)
            : $this->imageProcessor->processImageWithCrop($file, $cropData);

        $mediaId = Str::uuid()->toString();

        $fullPath = $this->r2Storage->uploadContent(
            $processed['full'],
            $valentine->id,
            'images',
            "{$mediaId}_full.webp"
        );

        $this->r2Storage->uploadContent(
            $processed['thumbnail'],
            $valentine->id,
            'images',
            "{$mediaId}_thumb.webp"
        );

        $this->r2Storage->uploadContent(
            $processed['og'],
            $valentine->id,
            'images',
            "{$mediaId}_og.jpg"
        );

        return Media::query()->create([
            'id' => $mediaId,
            'valentine_id' => $valentine->id,
            'type' => MediaType::Image,
            'original_filename' => $file->getClientOriginalName(),
            'path' => $fullPath,
            'disk' => 'r2',
            'mime_type' => 'image/webp',
            'size' => strlen($processed['full']),
            'width' => $processed['width'],
            'height' => $processed['height'],
            'metadata' => [
                'has_thumbnail' => true,
                'has_og' => true,
                ...$metadata,
            ],
            'sort_order' => $metadata['sort_order'] ?? 0,
        ]);
    }

    /**
     * @param  array<string, mixed>  $metadata
     */
    public function uploadAudio(
        Valentine $valentine,
        UploadedFile $file,
        array $metadata = []
    ): Media {
        $mediaId = Str::uuid()->toString();
        $filename = "{$mediaId}.mp3";

        $path = $this->r2Storage->uploadFile(
            $file,
            $valentine->id,
            'audio',
            $filename
        );

        return Media::query()->create([
            'id' => $mediaId,
            'valentine_id' => $valentine->id,
            'type' => MediaType::Audio,
            'original_filename' => $file->getClientOriginalName(),
            'path' => $path,
            'disk' => 'r2',
            'mime_type' => $file->getMimeType() ?? 'audio/mpeg',
            'size' => $file->getSize(),
            'duration' => isset($metadata['duration']) ? (int) $metadata['duration'] : null,
            'metadata' => array_filter([
                'sample_rate' => $metadata['sample_rate'] ?? null,
                'channels' => $metadata['channels'] ?? null,
                'original_duration' => $metadata['original_duration'] ?? null,
                'trim_start' => $metadata['trim_start'] ?? null,
                'trim_end' => $metadata['trim_end'] ?? null,
            ], fn ($v) => $v !== null),
            'sort_order' => $metadata['sort_order'] ?? 0,
        ]);
    }

    public function deleteMedia(Media $media): bool
    {
        $this->r2Storage->delete($media->path);

        if ($media->isImage()) {
            $basePath = dirname($media->path);
            $mediaId = pathinfo($media->path, PATHINFO_FILENAME);
            $mediaId = str_replace('_full', '', $mediaId);

            $this->r2Storage->delete("{$basePath}/{$mediaId}_thumb.webp");
            $this->r2Storage->delete("{$basePath}/{$mediaId}_og.jpg");
        }

        return $media->delete();
    }

    public function deleteAllForValentine(Valentine $valentine): int
    {
        $count = $valentine->media()->count();

        $this->r2Storage->deleteDirectory($valentine->id);

        $valentine->media()->delete();

        return $count;
    }
}
