<?php

namespace App\Models;

use App\Concerns\HasUuid;
use App\Enums\MediaType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    use HasFactory, HasUuid;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'valentine_id',
        'type',
        'path',
        'disk',
        'original_filename',
        'mime_type',
        'size',
        'width',
        'height',
        'duration',
        'metadata',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => MediaType::class,
            'size' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
            'duration' => 'integer',
            'metadata' => 'array',
            'sort_order' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Valentine, $this>
     */
    public function valentine(): BelongsTo
    {
        return $this->belongsTo(Valentine::class);
    }

    /**
     * @param  Builder<Media>  $query
     * @return Builder<Media>
     */
    public function scopeImages(Builder $query): Builder
    {
        return $query->where('type', MediaType::Image);
    }

    /**
     * @param  Builder<Media>  $query
     * @return Builder<Media>
     */
    public function scopeAudio(Builder $query): Builder
    {
        return $query->where('type', MediaType::Audio);
    }

    /**
     * @param  Builder<Media>  $query
     * @return Builder<Media>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order');
    }

    public function getUrl(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    public function getTemporaryUrl(int $minutes = 60): string
    {
        return Storage::disk($this->disk)->temporaryUrl(
            $this->path,
            now()->addMinutes($minutes)
        );
    }

    public function isImage(): bool
    {
        return $this->type === MediaType::Image;
    }

    public function isAudio(): bool
    {
        return $this->type === MediaType::Audio;
    }

    /**
     * Get the human-readable file size.
     */
    public function getFormattedSize(): string
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB'];
        $unitIndex = 0;

        while ($bytes >= 1024 && $unitIndex < count($units) - 1) {
            $bytes /= 1024;
            $unitIndex++;
        }

        return round($bytes, 2).' '.$units[$unitIndex];
    }
}
