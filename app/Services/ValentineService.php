<?php

namespace App\Services;

use App\Enums\ValentineResponse;

use App\Models\Valentine;
use App\Services\Contracts\MediaServiceInterface;
use App\Services\Contracts\ValentineServiceInterface;
use App\Support\CacheConfig;
use App\Support\ViewerSections;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class ValentineService implements ValentineServiceInterface
{
    public const EXPIRES_IN_DAYS = 90;

    public function __construct(
        protected MediaServiceInterface $mediaService,
        protected R2StorageService $r2Storage
    ) {}

    /**
     * @param  array<string, mixed>  $data
     * @param  array<UploadedFile>  $mediaFiles
     *
     * @throws Throwable
     */
    public function createValentine(array $data, array $mediaFiles = []): Valentine
    {
        $valentine = retry(3, function () use ($data, $mediaFiles) {
            return DB::transaction(function () use ($data, $mediaFiles) {
                $valentine = Valentine::query()->create([
                    'template_id' => $data['template_id'],
                    'slug' => $data['slug'],
                    'recipient_name' => $data['recipient_name'],
                    'sender_name' => $data['sender_name'] ?? null,
                    'creator_email' => $data['creator_email'] ?? null,
                    'notify_on_response' => $data['notify_on_response'] ?? false,
                    'customizations' => $this->prepareCustomizations($data['customizations'] ?? []),
                    'stats_secret' => $this->generateStatsSecret(),
                    'expires_at' => now()->addDays(self::EXPIRES_IN_DAYS),
                    'published_at' => now(),
                ]);

                $mediaUrls = $this->processMediaFiles($valentine, $mediaFiles, $data);

                if (! empty($mediaUrls['images']) || $mediaUrls['audio']) {
                    $this->updateCustomizationsWithMediaUrls($valentine, $mediaUrls);
                }

                return $valentine->fresh();
            });
        }, 100);

        return $valentine;
    }

    public function findBySlug(string $slug): ?Valentine
    {
        return Valentine::query()
            ->bySlug($slug)
            ->active()
            ->first();
    }

    public function findByStatsSecret(string $secret): ?Valentine
    {
        return Valentine::query()
            ->byStatsSecret($secret)
            ->first();
    }

    public function recordView(Valentine $valentine, ?string $fingerprint): void
    {
        $valentine->increment('view_count');

        if ($fingerprint) {
            $cacheKey = "valentine_view_{$valentine->id}_{$fingerprint}";

            if (Cache::add($cacheKey, true, now()->addDays(CacheConfig::VIEW_TTL_DAYS))) {
                $valentine->increment('unique_view_count');
            }
        }

        if (! $valentine->first_viewed_at) {
            $valentine->update(['first_viewed_at' => now()]);
        }
    }

    public function recordProgress(
        Valentine $valentine,
        string $section,
        ?int $memoryIndex,
        ?string $fingerprint
    ): void {
        $currentProgress = ViewerSections::getOrder($section);

        if ($currentProgress > ($valentine->furthest_progress ?? 0)) {
            $valentine->update([
                'furthest_progress' => $currentProgress,
                'last_section_reached' => $section,
            ]);
        }

        if (ViewerSections::isTerminal($section)) {
            $valentine->update(['completed' => true]);
        }
    }

    public function recordResponse(Valentine $valentine, string $response): void
    {
        if ($valentine->response !== null) {
            return;
        }

        $responseEnum = ValentineResponse::tryFrom($response);
        if (! $responseEnum) {
            return;
        }

        $valentine->update([
            'response' => $responseEnum,
            'responded_at' => now(),
            'completed' => true,
        ]);
    }

    public function publish(Valentine $valentine): Valentine
    {
        if (! $valentine->isPublished()) {
            $valentine->update([
                'published_at' => now(),
            ]);
        }

        return $valentine->fresh();
    }

    public function generateStatsSecret(): string
    {
        return Str::random(32);
    }

    /**
     * @param  array<string, mixed>  $customizations
     * @return array<string, mixed>
     */
    protected function prepareCustomizations(array $customizations): array
    {
        if (isset($customizations['memories']) && is_array($customizations['memories'])) {
            foreach ($customizations['memories'] as $index => $memory) {
                unset($customizations['memories'][$index]['image_file']);
            }
        }

        if (isset($customizations['audio'])) {
            unset(
                $customizations['audio']['trimmed_blob'],
                $customizations['audio']['background_music_file']
            );
        }

        if (isset($customizations['yes_response'])) {
            unset($customizations['yes_response']['reveal_photo_file']);
        }

        return $customizations;
    }

    /**
     * @param  array<UploadedFile>  $mediaFiles
     * @param  array<string, mixed>  $data
     * @return array{images: array<int, string>, audio: string|null}
     *
     * @throws Exception
     */
    protected function processMediaFiles(Valentine $valentine, array $mediaFiles, array $data): array
    {
        $mediaUrls = ['images' => [], 'audio' => null];
        $uploadedMedia = [];

        try {
            $images = $mediaFiles['images'] ?? [];
            $imageMetadata = $data['image_metadata'] ?? [];

            foreach ($images as $index => $image) {
                if ($image instanceof UploadedFile) {
                    $metadata = $imageMetadata[$index] ?? [];
                    $sortOrder = (int) ($metadata['sort_order'] ?? $index);
                    $metadata['sort_order'] = $sortOrder;

                    $media = $this->mediaService->uploadImage($valentine, $image, $metadata);
                    $uploadedMedia[] = $media;
                    $mediaUrls['images'][$sortOrder] = $this->r2Storage->getPublicUrl($media->path);
                }
            }

            $audio = $mediaFiles['audio'] ?? null;
            if ($audio instanceof UploadedFile) {
                $audioMetadata = $data['audio_metadata'] ?? [];
                $media = $this->mediaService->uploadAudio($valentine, $audio, $audioMetadata);
                $uploadedMedia[] = $media;
                $mediaUrls['audio'] = $this->r2Storage->getPublicUrl($media->path);
            }

            return $mediaUrls;
        } catch (Exception $e) {
            foreach ($uploadedMedia as $media) {
                try {
                    $this->r2Storage->delete($media->path);
                    $media->delete();
                } catch (Exception $cleanupError) {
                    Log::warning('Failed to cleanup media during valentine creation rollback', [
                        'media_id' => $media->id ?? null,
                        'media_path' => $media->path ?? null,
                        'original_error' => $e->getMessage(),
                        'cleanup_error' => $cleanupError->getMessage(),
                    ]);
                }
            }
            throw $e;
        }
    }

    /**
     * @param  array{images: array<int, string>, audio: string|null}  $mediaUrls
     */
    /**
     * @param  array{images: array<int, string>, audio: string|null}  $mediaUrls
     */
    protected function updateCustomizationsWithMediaUrls(Valentine $valentine, array $mediaUrls): void
    {
        $customizations = $valentine->customizations ?? [];

        if (! empty($mediaUrls['images']) && isset($customizations['memories'])) {
            foreach ($customizations['memories'] as $index => &$memory) {
                if (isset($mediaUrls['images'][$index])) {
                    $memory['image'] = $mediaUrls['images'][$index];
                }
            }
            unset($memory);
        }

        if ($mediaUrls['audio'] && isset($customizations['audio'])) {
            $customizations['audio']['background_music'] = $mediaUrls['audio'];
        }

        $valentine->update(['customizations' => $customizations]);
    }
}
