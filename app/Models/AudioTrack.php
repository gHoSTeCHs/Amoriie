<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class AudioTrack extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'artist',
        'duration_seconds',
        'file_path',
        'category',
        'mood',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'duration_seconds' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function getUrl(): string
    {
        return Storage::disk('r2')->url($this->file_path);
    }

    public function getFormattedDuration(): string
    {
        $minutes = intdiv($this->duration_seconds, 60);
        $seconds = $this->duration_seconds % 60;

        return sprintf('%d:%02d', $minutes, $seconds);
    }

    /**
     * @param  Builder<AudioTrack>  $query
     * @return Builder<AudioTrack>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<AudioTrack>  $query
     * @return Builder<AudioTrack>
     */
    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    /**
     * @param  Builder<AudioTrack>  $query
     * @return Builder<AudioTrack>
     */
    public function scopeByMood(Builder $query, string $mood): Builder
    {
        return $query->where('mood', $mood);
    }
}
