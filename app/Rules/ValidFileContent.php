<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

class ValidFileContent implements ValidationRule
{
    /** @var array<string, list<list<int>>> */
    private const IMAGE_SIGNATURES = [
        'jpeg' => [[0xFF, 0xD8, 0xFF]],
        'png' => [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
        'gif' => [[0x47, 0x49, 0x46, 0x38]],
    ];

    /** @var array<string, list<list<int>>> */
    private const AUDIO_SIGNATURES = [
        'mp3' => [
            [0xFF, 0xFB],
            [0xFF, 0xF3],
            [0xFF, 0xF2],
            [0x49, 0x44, 0x33],
        ],
        'ogg' => [[0x4F, 0x67, 0x67, 0x53]],
    ];

    public function __construct(
        private string $type = 'image'
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $value instanceof UploadedFile || ! $value->isValid()) {
            return;
        }

        $path = $value->getRealPath();
        if ($path === false || ! file_exists($path)) {
            return;
        }

        $handle = fopen($path, 'rb');
        if ($handle === false) {
            $fail('Unable to read file content for verification.');

            return;
        }

        $header = fread($handle, 16);
        fclose($handle);

        if ($header === false || strlen($header) < 2) {
            $fail('The :attribute file appears to be empty or unreadable.');

            return;
        }

        $bytes = array_values(unpack('C*', $header));

        if (! $this->matchesExpectedContent($bytes)) {
            $fail('The :attribute file content does not match its declared type.');
        }
    }

    /** @param list<int> $bytes */
    private function matchesExpectedContent(array $bytes): bool
    {
        return match ($this->type) {
            'image' => $this->matchesImageSignature($bytes),
            'audio' => $this->matchesAudioSignature($bytes),
            default => true,
        };
    }

    /** @param list<int> $bytes */
    private function matchesImageSignature(array $bytes): bool
    {
        foreach (self::IMAGE_SIGNATURES as $signatures) {
            foreach ($signatures as $signature) {
                if ($this->bytesMatch($bytes, $signature)) {
                    return true;
                }
            }
        }

        return $this->isWebP($bytes);
    }

    /** @param list<int> $bytes */
    private function matchesAudioSignature(array $bytes): bool
    {
        foreach (self::AUDIO_SIGNATURES as $signatures) {
            foreach ($signatures as $signature) {
                if ($this->bytesMatch($bytes, $signature)) {
                    return true;
                }
            }
        }

        return $this->isWav($bytes) || $this->isM4a($bytes);
    }

    /**
     * WebP: RIFF....WEBP (bytes 0-3 = RIFF, bytes 8-11 = WEBP)
     *
     * @param list<int> $bytes
     */
    private function isWebP(array $bytes): bool
    {
        if (count($bytes) < 12) {
            return false;
        }

        return $this->bytesMatch($bytes, [0x52, 0x49, 0x46, 0x46])
            && $bytes[8] === 0x57 && $bytes[9] === 0x45
            && $bytes[10] === 0x42 && $bytes[11] === 0x50;
    }

    /**
     * WAV: RIFF....WAVE (bytes 0-3 = RIFF, bytes 8-11 = WAVE)
     *
     * @param list<int> $bytes
     */
    private function isWav(array $bytes): bool
    {
        if (count($bytes) < 12) {
            return false;
        }

        return $this->bytesMatch($bytes, [0x52, 0x49, 0x46, 0x46])
            && $bytes[8] === 0x57 && $bytes[9] === 0x41
            && $bytes[10] === 0x56 && $bytes[11] === 0x45;
    }

    /**
     * M4A/MP4: "ftyp" at offset 4 (bytes 4-7 = 0x66 0x74 0x79 0x70)
     *
     * @param list<int> $bytes
     */
    private function isM4a(array $bytes): bool
    {
        if (count($bytes) < 8) {
            return false;
        }

        return $bytes[4] === 0x66 && $bytes[5] === 0x74
            && $bytes[6] === 0x79 && $bytes[7] === 0x70;
    }

    /**
     * @param list<int> $bytes
     * @param list<int> $signature
     */
    private function bytesMatch(array $bytes, array $signature): bool
    {
        if (count($bytes) < count($signature)) {
            return false;
        }

        foreach ($signature as $i => $byte) {
            if ($bytes[$i] !== $byte) {
                return false;
            }
        }

        return true;
    }
}
