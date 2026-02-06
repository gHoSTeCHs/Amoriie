<?php

namespace App\Enums;

enum MediaType: string
{
    case Image = 'image';
    case Audio = 'audio';

    /**
     * Get all media type values as an array.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get the human-readable label for this media type.
     */
    public function label(): string
    {
        return match ($this) {
            self::Image => 'Image',
            self::Audio => 'Audio',
        };
    }

    /**
     * Get the allowed MIME types for this media type.
     *
     * @return array<string>
     */
    public function allowedMimeTypes(): array
    {
        return match ($this) {
            self::Image => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
            self::Audio => ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a', 'audio/m4a'],
        };
    }

    /**
     * Get the maximum file size in bytes for this media type.
     */
    public function maxSizeBytes(): int
    {
        return match ($this) {
            self::Image => 10 * 1024 * 1024,
            self::Audio => 15 * 1024 * 1024,
        };
    }

    /**
     * Get options array for form selects.
     *
     * @return array<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(fn ($case) => [
            'value' => $case->value,
            'label' => $case->label(),
        ], self::cases());
    }
}
