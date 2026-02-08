<?php

namespace App\Support;

final class SlugConstraints
{
    public const MIN_LENGTH = 2;

    public const MAX_LENGTH = 50;

    public const PATTERN = '/^[a-z0-9][a-z0-9\-]*[a-z0-9]$|^[a-z0-9]$/';

    public static function getValidationRule(): string
    {
        return 'regex:'.self::PATTERN;
    }
}
