<?php

namespace App\Services\Contracts;

use App\Enums\ValentineResponse;
use App\Models\Valentine;

interface ValentineServiceInterface
{
    /**
     * Create a new valentine.
     *
     * @param  array<string, mixed>  $data
     * @param  array<\Illuminate\Http\UploadedFile>  $mediaFiles
     */
    public function createValentine(array $data, array $mediaFiles = []): Valentine;

    /**
     * Find a valentine by its public slug.
     */
    public function findBySlug(string $slug): ?Valentine;

    /**
     * Find a valentine by its stats secret.
     */
    public function findByStatsSecret(string $secret): ?Valentine;

    /**
     * Record a view for a valentine.
     */
    public function recordView(Valentine $valentine, string $fingerprint): void;

    /**
     * Record progress through the valentine experience.
     */
    public function recordProgress(
        Valentine $valentine,
        int $timeSpent,
        ?string $lastSection,
        bool $completed
    ): void;

    /**
     * Record the recipient's response.
     */
    public function recordResponse(Valentine $valentine, ValentineResponse $response): void;

    /**
     * Publish a valentine (makes it accessible via slug).
     */
    public function publish(Valentine $valentine): Valentine;

    /**
     * Generate a unique stats secret.
     */
    public function generateStatsSecret(): string;
}
