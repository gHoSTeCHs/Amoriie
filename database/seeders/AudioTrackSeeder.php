<?php

namespace Database\Seeders;

use App\Models\AudioTrack;
use Illuminate\Database\Seeder;

class AudioTrackSeeder extends Seeder
{
    public function run(): void
    {
        AudioTrack::query()->upsert([
            [
                'id' => 1,
                'name' => 'Tender Moments',
                'artist' => 'Ashot Danielyan',
                'duration_seconds' => 198,
                'file_path' => 'audio/library/tender-moments.mp3',
                'category' => 'romantic',
                'mood' => 'gentle',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => 'Sweet Memories',
                'artist' => 'Litesaturation',
                'duration_seconds' => 138,
                'file_path' => 'audio/library/sweet-memories.mp3',
                'category' => 'romantic',
                'mood' => 'nostalgic',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name' => 'Heart Flutter',
                'artist' => 'AlexGrohl',
                'duration_seconds' => 186,
                'file_path' => 'audio/library/heart-flutter.mp3',
                'category' => 'romantic',
                'mood' => 'playful',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'name' => 'Forever Yours',
                'artist' => 'UniqueCreativeAudio',
                'duration_seconds' => 221,
                'file_path' => 'audio/library/forever-yours.mp3',
                'category' => 'romantic',
                'mood' => 'emotional',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ], ['id'], ['name', 'artist', 'duration_seconds', 'file_path', 'category', 'mood', 'is_active', 'updated_at']);
    }
}
