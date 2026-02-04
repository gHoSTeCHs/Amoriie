<?php

namespace App\Services\Contracts;

interface SlugServiceInterface
{
    /**
     * Check if a slug is available for use.
     */
    public function isAvailable(string $slug): bool;

    /**
     * Generate slug suggestions based on a name.
     *
     * @return array<string>
     */
    public function generateSuggestions(string $name, int $count = 5): array;

    /**
     * Normalize a slug to the correct format.
     */
    public function normalize(string $slug): string;

    /**
     * Validate a slug format and availability.
     *
     * @return array{valid: bool, errors: array<string>}
     */
    public function validate(string $slug): array;
}
