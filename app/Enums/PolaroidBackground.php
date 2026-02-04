<?php

namespace App\Enums;

enum PolaroidBackground: string
{
    case CorkBoard = 'cork-board';
    case WoodenTable = 'wooden-table';
    case SoftFabric = 'soft-fabric';
    case MinimalWhite = 'minimal-white';

    /**
     * Get all background values as an array.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get the human-readable label for this background type.
     */
    public function label(): string
    {
        return match ($this) {
            self::CorkBoard => 'Cork Board',
            self::WoodenTable => 'Wooden Table',
            self::SoftFabric => 'Soft Fabric',
            self::MinimalWhite => 'Minimal White',
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
