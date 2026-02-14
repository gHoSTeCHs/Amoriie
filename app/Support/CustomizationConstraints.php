<?php

namespace App\Support;

final class CustomizationConstraints
{
    public const TITLE_MAX_LENGTH = 50;

    public const NAME_MAX_LENGTH = 50;

    public const CAPTION_MAX_LENGTH = 150;

    public const MESSAGE_MAX_LENGTH = 300;

    public const ASK_TEXT_MAX_LENGTH = 100;

    public const ROTATION_MIN = -15;

    public const ROTATION_MAX = 15;

    public const VALID_BACKGROUNDS = [
        'cork-board',
        'soft-pink',
        'midnight-blue',
        'cream-linen',
    ];

    public const VALID_POLAROID_STYLES = [
        'classic',
        'vintage',
        'instant',
    ];

    public const VALID_HANDWRITING_FONTS = [
        'dancing-script',
        'caveat',
        'kalam',
        'satisfy',
        'pacifico',
        'permanent-marker',
    ];

    public const LETTER_TEXT_MIN_LENGTH = 50;

    public const LETTER_TEXT_MAX_LENGTH = 2000;

    public const VALID_LOVE_LETTER_THEMES = [
        'midnight-candlelight',
        'vintage-telegram',
        'royal-elegance',
        'garden-romance',
        'modern-minimal',
        'parisian-cafe',
    ];

    public const VALID_SIGNATURE_STYLES = ['handwritten', 'typed', 'initials'];

    public const VALID_ANIMATION_SPEEDS = ['slow', 'normal', 'fast'];

    public const VALID_NO_BUTTON_BEHAVIORS = ['dodge', 'shrink-grow', 'plead', 'simple'];
}
