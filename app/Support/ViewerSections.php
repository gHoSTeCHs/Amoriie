<?php

namespace App\Support;

final class ViewerSections
{
    public const INTRO = 'intro';

    public const MEMORIES = 'memories';

    public const FINAL = 'final';

    public const CELEBRATION = 'celebration';

    public const DECLINED = 'declined';

    public const SECTION_ORDER = [
        self::INTRO => 0,
        self::MEMORIES => 1,
        self::FINAL => 2,
        self::CELEBRATION => 3,
        self::DECLINED => 3,
    ];

    public const TERMINAL_SECTIONS = [
        self::CELEBRATION,
        self::DECLINED,
    ];

    public static function isTerminal(string $section): bool
    {
        return in_array($section, self::TERMINAL_SECTIONS, true);
    }

    public static function getOrder(string $section): int
    {
        return self::SECTION_ORDER[$section] ?? 0;
    }

    public static function getAllSections(): array
    {
        return array_keys(self::SECTION_ORDER);
    }
}
