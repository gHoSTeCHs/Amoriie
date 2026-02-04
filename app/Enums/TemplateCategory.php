<?php

namespace App\Enums;

enum TemplateCategory: string
{
    case Storybook = 'storybook';
    case Interactive = 'interactive';

    /**
     * Get all category values as an array.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get the human-readable label for this category.
     */
    public function label(): string
    {
        return match ($this) {
            self::Storybook => 'Storybook',
            self::Interactive => 'Interactive',
        };
    }

    /**
     * Get the description for this category.
     */
    public function description(): string
    {
        return match ($this) {
            self::Storybook => 'Narrative-driven experiences with pages and chapters',
            self::Interactive => 'Game-like experiences with user participation',
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
