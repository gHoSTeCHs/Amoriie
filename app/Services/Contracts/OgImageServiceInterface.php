<?php

namespace App\Services\Contracts;

use App\Models\Valentine;

interface OgImageServiceInterface
{
    /**
     * Generate an OG image for the given valentine.
     *
     * @return string The R2 storage path of the generated image
     */
    public function generate(Valentine $valentine): string;

    /**
     * Get the public URL for the valentine's OG image.
     */
    public function getPublicUrl(Valentine $valentine): ?string;

    /**
     * Check if an OG image exists for the valentine.
     */
    public function exists(Valentine $valentine): bool;

    /**
     * Delete the OG image for the valentine.
     */
    public function delete(Valentine $valentine): bool;
}
