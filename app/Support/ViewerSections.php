<?php

namespace App\Support;

final class ViewerSections
{
    public const INTRO = 'intro';

    public const ENVELOPE = 'envelope';

    public const LETTER = 'letter';

    public const MEMORIES = 'memories';

    public const FINAL = 'final';

    public const CELEBRATION = 'celebration';

    public const DECLINED = 'declined';

    public const SECTION_ORDER = [
        self::INTRO => 0,
        self::ENVELOPE => 1,
        self::LETTER => 2,
        self::MEMORIES => 3,
        self::FINAL => 4,
        self::CELEBRATION => 5,
        self::DECLINED => 5,
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
