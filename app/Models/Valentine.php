<?php

namespace App\Models;

use App\Concerns\HasUuid;
use App\Enums\ValentineResponse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Valentine extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'template_id',
        'slug',
        'recipient_name',
        'sender_name',
        'creator_email',
        'notify_on_response',
        'customizations',
        'stats_secret',
        'response',
        'responded_at',
        'expires_at',
        'view_count',
        'unique_view_count',
        'first_viewed_at',
        'total_time_spent_seconds',
        'last_section_reached',
        'completed',
        'og_image_path',
        'furthest_progress',
        'published_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'customizations' => 'array',
            'notify_on_response' => 'boolean',
            'response' => ValentineResponse::class,
            'responded_at' => 'datetime',
            'expires_at' => 'datetime',
            'view_count' => 'integer',
            'unique_view_count' => 'integer',
            'first_viewed_at' => 'datetime',
            'total_time_spent_seconds' => 'integer',
            'completed' => 'boolean',
            'furthest_progress' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Template, $this>
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    /**
     * @return HasMany<Media, $this>
     */
    public function media(): HasMany
    {
        return $this->hasMany(Media::class)->orderBy('sort_order');
    }

    /**
     * @return HasMany<Media, $this>
     */
    public function images(): HasMany
    {
        return $this->media()->where('type', 'image');
    }

    /**
     * @return HasMany<Media, $this>
     */
    public function audio(): HasMany
    {
        return $this->media()->where('type', 'audio');
    }

    /**
     * @param  Builder<Valentine>  $query
     * @return Builder<Valentine>
     */
    public function scopeBySlug(Builder $query, string $slug): Builder
    {
        return $query->where('slug', $slug);
    }

    /**
     * @param  Builder<Valentine>  $query
     * @return Builder<Valentine>
     */
    public function scopeByStatsSecret(Builder $query, string $secret): Builder
    {
        return $query->where('stats_secret', $secret);
    }

    /**
     * @param  Builder<Valentine>  $query
     * @return Builder<Valentine>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->whereNotNull('published_at');
    }

    /**
     * @param  Builder<Valentine>  $query
     * @return Builder<Valentine>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->published()
            ->where(function (Builder $q): void {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    /**
     * @param  Builder<Valentine>  $query
     * @return Builder<Valentine>
     */
    public function scopeExpired(Builder $query): Builder
    {
        return $query->whereNotNull('expires_at')
            ->where('expires_at', '<=', now());
    }

    /**
     * @param  Builder<Valentine>  $query
     * @return Builder<Valentine>
     */
    public function scopeResponded(Builder $query): Builder
    {
        return $query->whereNotNull('response');
    }

    /**
     * @param  Builder<Valentine>  $query
     * @return Builder<Valentine>
     */
    public function scopeUnresponded(Builder $query): Builder
    {
        return $query->whereNull('response');
    }

    public function isPublished(): bool
    {
        return $this->published_at !== null;
    }

    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function hasResponded(): bool
    {
        return $this->response !== null;
    }

    public function getPublicUrl(): string
    {
        return url("/for/{$this->slug}");
    }

    public function getStatsUrl(): string
    {
        return url("/stats/{$this->stats_secret}");
    }
}
