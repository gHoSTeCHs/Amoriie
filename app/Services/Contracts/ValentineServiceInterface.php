<?php

namespace App\Services\Contracts;

use App\Models\Valentine;

interface ValentineServiceInterface
{
    /**
     * Create and immediately publish a new valentine.
     *
     * Note: In MVP, valentines are published immediately upon creation.
     * The separate publish() method exists for future draft functionality.
     *
     * @param  array<string, mixed>  $data
     * @param  array<\Illuminate\Http\UploadedFile>  $mediaFiles
     */
    public function createValentine(array $data, array $mediaFiles = []): Valentine;

    public function findBySlug(string $slug): ?Valentine;

    public function findByStatsSecret(string $secret): ?Valentine;

    public function recordView(Valentine $valentine, ?string $fingerprint): void;

    public function recordProgress(
        Valentine $valentine,
        string $section,
        ?int $memoryIndex,
        ?string $fingerprint
    ): void;

    /**
     * @param  string  $response  The response value ('yes' or 'no') - converted to enum internally
     */
    public function recordResponse(Valentine $valentine, string $response): void;

    /**
     * Publish a draft valentine.
     *
     * Note: Currently unused in MVP as createValentine() publishes immediately.
     * Reserved for future draft/preview functionality.
     */
    public function publish(Valentine $valentine): Valentine;

    public function generateStatsSecret(): string;
}
