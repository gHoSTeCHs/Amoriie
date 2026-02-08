<?php

namespace App\Services;

use App\Models\Valentine;
use App\Services\Contracts\SlugServiceInterface;
use App\Support\SlugConstraints;
use Illuminate\Support\Str;

class SlugService implements SlugServiceInterface
{
    /** @var array<string> */
    protected array $reservedSlugs;

    /** @var array<string> */
    protected array $romanticSuffixes;

    public function __construct()
    {
        $this->reservedSlugs = config('slugs.reserved', []);
        $this->romanticSuffixes = config('slugs.romantic_suffixes', []);
    }

    public function isAvailable(string $slug): bool
    {
        $normalized = $this->normalize($slug);

        if (empty($normalized)) {
            return false;
        }

        $validation = $this->validate($normalized);
        if (! $validation['valid']) {
            return false;
        }

        return ! Valentine::query()
            ->withTrashed()
            ->where('slug', $normalized)
            ->exists();
    }

    public function generateSuggestions(string $name, int $count = 5): array
    {
        $baseName = $this->normalize($name);

        if (empty($baseName)) {
            $baseName = 'valentine';
        }

        $suggestions = [];
        $attempts = 0;
        $maxAttempts = $count * 5;

        while (count($suggestions) < $count && $attempts < $maxAttempts) {
            $attempts++;
            $candidate = $this->generateCandidate($baseName, $attempts);

            if ($this->isAvailable($candidate) && ! in_array($candidate, $suggestions, true)) {
                $suggestions[] = $candidate;
            }
        }

        return array_slice($suggestions, 0, $count);
    }

    public function normalize(string $slug): string
    {
        $normalized = Str::lower($slug);
        $normalized = preg_replace('/[^a-z0-9\-\s]/', '', $normalized) ?? '';
        $normalized = preg_replace('/[\s]+/', '-', $normalized) ?? '';
        $normalized = preg_replace('/-+/', '-', $normalized) ?? '';
        $normalized = trim($normalized, '-');

        return Str::limit($normalized, SlugConstraints::MAX_LENGTH, '');
    }

    /**
     * @return array{valid: bool, errors: array<string>}
     */
    public function validate(string $slug): array
    {
        $errors = [];
        $normalized = $this->normalize($slug);

        if (strlen($normalized) < SlugConstraints::MIN_LENGTH) {
            $errors[] = 'Slug must be at least '.SlugConstraints::MIN_LENGTH.' characters';
        }

        if (strlen($normalized) > SlugConstraints::MAX_LENGTH) {
            $errors[] = 'Slug cannot exceed '.SlugConstraints::MAX_LENGTH.' characters';
        }

        if (! preg_match(SlugConstraints::PATTERN, $normalized)) {
            $errors[] = 'Slug must start and end with a letter or number';
        }

        if ($this->isReservedSlug($normalized)) {
            $errors[] = 'This slug is reserved';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    protected function isReservedSlug(string $slug): bool
    {
        foreach ($this->reservedSlugs as $reserved) {
            if ($slug === $reserved) {
                return true;
            }

            if (str_starts_with($slug, $reserved.'-')) {
                return true;
            }

            if (preg_match('/^'.preg_quote($reserved, '/').'\d+$/', $slug)) {
                return true;
            }
        }

        return false;
    }

    protected function generateCandidate(string $baseName, int $attempt): string
    {
        $strategy = $attempt % 4;

        return match ($strategy) {
            0 => $baseName.$this->romanticSuffixes[array_rand($this->romanticSuffixes)],
            1 => $baseName.'-'.random_int(1, 99),
            2 => $this->romanticSuffixes[array_rand($this->romanticSuffixes)].'-'.$baseName,
            3 => $baseName.'-'.Str::random(4),
            default => $baseName.'-'.random_int(100, 999),
        };
    }
}
