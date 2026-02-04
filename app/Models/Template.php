<?php

namespace App\Models;

use App\Enums\TemplateCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Template extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'name',
        'category',
        'description',
        'thumbnail_url',
        'preview_url',
        'schema',
        'default_customizations',
        'is_active',
        'is_premium',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'category' => TemplateCategory::class,
            'schema' => 'array',
            'default_customizations' => 'array',
            'is_active' => 'boolean',
            'is_premium' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * @return HasMany<Valentine, $this>
     */
    public function valentines(): HasMany
    {
        return $this->hasMany(Valentine::class);
    }

    /**
     * @param  Builder<Template>  $query
     * @return Builder<Template>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<Template>  $query
     * @return Builder<Template>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * @param  Builder<Template>  $query
     * @return Builder<Template>
     */
    public function scopeByCategory(Builder $query, TemplateCategory $category): Builder
    {
        return $query->where('category', $category);
    }

    /**
     * @param  Builder<Template>  $query
     * @return Builder<Template>
     */
    public function scopeFree(Builder $query): Builder
    {
        return $query->where('is_premium', false);
    }

    /**
     * @param  Builder<Template>  $query
     * @return Builder<Template>
     */
    public function scopePremium(Builder $query): Builder
    {
        return $query->where('is_premium', true);
    }
}
