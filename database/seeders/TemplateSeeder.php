<?php

namespace Database\Seeders;

use App\Enums\TemplateCategory;
use App\Models\Template;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    public function run(): void
    {
        Template::query()->upsert([
            [
                'id' => 'polaroid-memories',
                'name' => 'Polaroid Memories',
                'category' => TemplateCategory::Storybook->value,
                'description' => 'A nostalgic journey through your favorite moments together, presented as scattered polaroid photos with handwritten captions.',
                'thumbnail_url' => null,
                'preview_url' => null,
                'schema' => json_encode([
                    'pages' => [
                        'min' => 3,
                        'max' => 12,
                    ],
                    'theme' => [
                        'color_palettes' => [
                            [
                                'id' => 'warm-rose',
                                'name' => 'Warm Rose',
                                'colors' => [
                                    'primary' => '#be123c',
                                    'secondary' => '#fda4af',
                                    'background' => '#0c0607',
                                    'text' => '#ffffff',
                                    'accent' => '#f43f5e',
                                ],
                            ],
                            [
                                'id' => 'soft-blush',
                                'name' => 'Soft Blush',
                                'colors' => [
                                    'primary' => '#ec4899',
                                    'secondary' => '#f9a8d4',
                                    'background' => '#1a0a10',
                                    'text' => '#fdf2f8',
                                    'accent' => '#db2777',
                                ],
                            ],
                            [
                                'id' => 'vintage-sepia',
                                'name' => 'Vintage Sepia',
                                'colors' => [
                                    'primary' => '#92400e',
                                    'secondary' => '#fcd34d',
                                    'background' => '#1c1917',
                                    'text' => '#fef3c7',
                                    'accent' => '#d97706',
                                ],
                            ],
                        ],
                        'fonts' => [
                            [
                                'id' => 'dancing-script',
                                'name' => 'Dancing Script',
                                'category' => 'script',
                                'url' => 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap',
                            ],
                            [
                                'id' => 'cormorant-garamond',
                                'name' => 'Cormorant Garamond',
                                'category' => 'serif',
                                'url' => 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap',
                            ],
                            [
                                'id' => 'caveat',
                                'name' => 'Caveat',
                                'category' => 'handwriting',
                                'url' => 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap',
                            ],
                        ],
                        'allow_custom_colors' => false,
                    ],
                    'audio' => [
                        'allow_background_music' => true,
                        'max_duration_seconds' => 180,
                    ],
                ]),
                'default_customizations' => json_encode([
                    'style' => 'classic',
                    'background' => 'cork-board',
                    'polaroids' => [],
                    'message' => '',
                    'color_palette' => 'warm-rose',
                    'font' => 'dancing-script',
                ]),
                'is_active' => true,
                'is_premium' => false,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'love-letter',
                'name' => 'Love Letter',
                'category' => TemplateCategory::Interactive->value,
                'description' => 'A heartfelt letter sealed with love, revealed with elegant animations across 6 stunning themes.',
                'thumbnail_url' => null,
                'preview_url' => null,
                'schema' => json_encode([
                    'themes' => [
                        'midnight-candlelight',
                        'vintage-telegram',
                        'royal-elegance',
                        'garden-romance',
                        'modern-minimal',
                        'parisian-cafe',
                    ],
                    'letter' => [
                        'min_length' => 50,
                        'max_length' => 2000,
                    ],
                    'audio' => [
                        'allow_background_music' => true,
                        'max_duration_seconds' => 180,
                    ],
                ]),
                'default_customizations' => json_encode([
                    'theme_id' => 'midnight-candlelight',
                    'letter_text' => '',
                    'letter_date' => null,
                    'customization' => [
                        'paper_color' => '#f5f0e1',
                        'ink_color' => '#2d1810',
                        'seal_color' => '#8b0000',
                        'signature_style' => 'handwritten',
                        'animation_speed' => 'normal',
                        'sounds_enabled' => true,
                        'show_borders' => true,
                        'show_drop_cap' => true,
                        'show_flourishes' => true,
                    ],
                ]),
                'is_active' => true,
                'is_premium' => false,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ], ['id'], ['name', 'category', 'description', 'schema', 'default_customizations', 'is_active', 'is_premium', 'sort_order', 'updated_at']);
    }
}
