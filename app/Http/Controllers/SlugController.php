<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SlugController extends Controller
{
    /**
     * Check if a slug is available.
     */
    public function check(Request $request): JsonResponse
    {
        $slug = $request->input('slug', '');

        return response()->json([
            'slug' => $slug,
            'available' => true,
            'message' => 'Slug availability check not yet implemented',
        ]);
    }

    /**
     * Generate slug suggestions based on a name.
     */
    public function suggestions(Request $request): JsonResponse
    {
        $name = $request->input('name', '');

        return response()->json([
            'name' => $name,
            'suggestions' => [],
            'message' => 'Slug suggestions not yet implemented',
        ]);
    }
}
