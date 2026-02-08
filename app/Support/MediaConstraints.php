<?php

namespace App\Support;

final class MediaConstraints
{
    public const IMAGE_MAX_SIZE_KB = 10240;

    public const AUDIO_MAX_SIZE_KB = 15360;

    public const IMAGE_MAX_WIDTH = 1920;

    public const THUMBNAIL_WIDTH = 400;

    public const IMAGE_QUALITY = 85;

    public const AUDIO_MAX_DURATION_SECONDS = 30;

    public const MIN_IMAGES = 3;

    public const MAX_IMAGES = 10;

    public const IMAGE_MIMES = ['jpeg', 'png', 'webp', 'gif'];

    public const AUDIO_MIMES = ['mp3', 'wav', 'ogg', 'm4a', 'mp4'];

    public static function getImageMimesString(): string
    {
        return implode(',', self::IMAGE_MIMES);
    }

    public static function getAudioMimesString(): string
    {
        return implode(',', self::AUDIO_MIMES);
    }

    public static function getImageMaxSizeMB(): float
    {
        return self::IMAGE_MAX_SIZE_KB / 1024;
    }

    public static function getAudioMaxSizeMB(): float
    {
        return self::AUDIO_MAX_SIZE_KB / 1024;
    }
}
