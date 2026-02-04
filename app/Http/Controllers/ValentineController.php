<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ValentineController extends Controller
{
    /**
     * Display the template selection page.
     */
    public function index(): Response
    {
        return Inertia::render('create/index');
    }

    /**
     * Display the valentine builder for a specific template.
     */
    public function builder(string $templateId): Response
    {
        return Inertia::render('create/builder', [
            'templateId' => $templateId,
        ]);
    }

    /**
     * Display the preview page for a valentine being built.
     */
    public function preview(string $templateId): Response
    {
        return Inertia::render('create/preview', [
            'templateId' => $templateId,
        ]);
    }

    /**
     * Store a newly created valentine.
     */
    public function store(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Valentine creation not yet implemented',
        ], 501);
    }

    /**
     * Display a valentine by its public slug.
     */
    public function show(string $slug): Response
    {
        return Inertia::render('valentine/show', [
            'slug' => $slug,
        ]);
    }

    /**
     * Record a view for a valentine.
     */
    public function recordView(string $slug): JsonResponse
    {
        return response()->json([
            'message' => 'View recording not yet implemented',
        ], 501);
    }

    /**
     * Record progress through the valentine experience.
     */
    public function recordProgress(Request $request, string $slug): JsonResponse
    {
        return response()->json([
            'message' => 'Progress recording not yet implemented',
        ], 501);
    }

    /**
     * Record the recipient's response.
     */
    public function recordResponse(Request $request, string $slug): JsonResponse
    {
        return response()->json([
            'message' => 'Response recording not yet implemented',
        ], 501);
    }
}
