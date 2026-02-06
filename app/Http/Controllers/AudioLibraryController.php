<?php

namespace App\Http\Controllers;

use App\Models\AudioTrack;
use Illuminate\Http\JsonResponse;

class AudioLibraryController extends Controller
{
    public function index(): JsonResponse
    {
        $tracks = AudioTrack::query()
            ->active()
            ->orderBy('category')
            ->orderBy('name')
            ->get()
            ->map(fn (AudioTrack $track) => [
                'id' => $track->id,
                'name' => $track->name,
                'artist' => $track->artist,
                'duration' => $track->duration_seconds,
                'formattedDuration' => $track->getFormattedDuration(),
                'url' => $track->getUrl(),
                'category' => $track->category,
                'mood' => $track->mood,
            ]);

        return response()->json(['tracks' => $tracks]);
    }
}
