<?php

namespace App\Services\Contracts;

use App\Models\Media;
use App\Models\Valentine;
use Illuminate\Http\UploadedFile;

interface MediaServiceInterface
{
    /**
     * Upload an image for a valentine.
     *
     * @param  array<string, mixed>  $metadata
     */
    public function uploadImage(
        Valentine $valentine,
        UploadedFile $file,
        array $metadata = []
    ): Media;

    /**
     * Upload an audio file for a valentine.
     *
     * @param  array<string, mixed>  $metadata
     */
    public function uploadAudio(
        Valentine $valentine,
        UploadedFile $file,
        array $metadata = []
    ): Media;

    /**
     * Delete a single media item.
     */
    public function deleteMedia(Media $media): bool;

    /**
     * Delete all media for a valentine.
     */
    public function deleteAllForValentine(Valentine $valentine): int;
}
