<?php

namespace App\Http\Controllers;

use App\Http\Requests\Slug\CheckSlugRequest;
use App\Http\Requests\Slug\SuggestSlugRequest;
use App\Services\Contracts\SlugServiceInterface;
use Illuminate\Http\JsonResponse;

class SlugController extends Controller
{
    public function __construct(
        private SlugServiceInterface $slugService
    ) {}

    public function check(CheckSlugRequest $request): JsonResponse
    {
        $slug = $request->validated('slug');
        $normalized = $this->slugService->normalize($slug);
        $validation = $this->slugService->validate($normalized);

        if (! $validation['valid']) {
            return response()->json([
                'slug' => $slug,
                'normalized_slug' => $normalized,
                'available' => false,
                'errors' => $validation['errors'],
                'suggestions' => [],
            ]);
        }

        $available = $this->slugService->isAvailable($normalized);
        $suggestions = [];

        if (! $available) {
            $suggestions = $this->slugService->generateSuggestions($normalized, 5);
        }

        return response()->json([
            'slug' => $slug,
            'normalized_slug' => $normalized,
            'available' => $available,
            'errors' => [],
            'suggestions' => $suggestions,
        ]);
    }

    public function suggestions(SuggestSlugRequest $request): JsonResponse
    {
        $name = $request->validated('name');
        $count = $request->validated('count', 5);

        $suggestions = $this->slugService->generateSuggestions($name, $count);

        return response()->json([
            'name' => $name,
            'suggestions' => $suggestions,
        ]);
    }
}
