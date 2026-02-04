<?php

namespace App\Enums;

enum PolaroidStyle: string
{
    case Classic = 'classic';
    case Vintage = 'vintage';
    case Modern = 'modern';

    /**
     * Get all style values as an array.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get the human-readable label for this style.
     */
    public function label(): string
    {
        return match ($this) {
            self::Classic => 'Classic',
            self::Vintage => 'Vintage',
            self::Modern => 'Modern',
        };
    }

    /**
     * Get the description for this style.
     */
    public function description(): string
    {
        return match ($this) {
            self::Classic => 'Traditional white-bordered polaroid look',
            self::Vintage => 'Aged, slightly yellowed paper with worn edges',
            self::Modern => 'Clean, minimal with subtle shadows',
        };
    }

    /**
     * Get options array for form selects.
     *
     * @return array<array{value: string, label: string, description: string}>
     */
    public static function options(): array
    {
        return array_map(fn ($case) => [
            'value' => $case->value,
            'label' => $case->label(),
            'description' => $case->description(),
        ], self::cases());
    }
}
