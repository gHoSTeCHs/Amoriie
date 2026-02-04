<?php

namespace App\Enums;

enum ValentineResponse: string
{
    case Yes = 'yes';
    case No = 'no';

    /**
     * Get all response values as an array.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get the human-readable label for this response.
     */
    public function label(): string
    {
        return match ($this) {
            self::Yes => 'Yes',
            self::No => 'No',
        };
    }

    /**
     * Get the emoji representation of this response.
     */
    public function emoji(): string
    {
        return match ($this) {
            self::Yes => '💕',
            self::No => '💔',
        };
    }

    /**
     * Check if this is an affirmative response.
     */
    public function isAffirmative(): bool
    {
        return $this === self::Yes;
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
