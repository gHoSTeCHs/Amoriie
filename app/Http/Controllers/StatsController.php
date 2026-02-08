<?php

namespace App\Http\Controllers;

use App\Services\Contracts\ValentineServiceInterface;
use Inertia\Inertia;
use Inertia\Response;

class StatsController extends Controller
{
    public function __construct(
        private ValentineServiceInterface $valentineService
    ) {}

    public function show(string $secret): Response
    {
        $valentine = $this->valentineService->findByStatsSecret($secret);

        if (! $valentine) {
            abort(404);
        }

        return Inertia::render('stats/show', [
            'valentine' => $this->transformForStats($valentine),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function transformForStats(\App\Models\Valentine $valentine): array
    {
        return [
            'id' => $valentine->id,
            'slug' => $valentine->slug,
            'template_id' => $valentine->template_id,
            'recipient_name' => $valentine->recipient_name,
            'sender_name' => $valentine->sender_name ?? 'Anonymous',
            'public_url' => $valentine->getPublicUrl(),
            'stats' => [
                'view_count' => $valentine->view_count,
                'unique_view_count' => $valentine->unique_view_count,
                'first_viewed_at' => $valentine->first_viewed_at?->toIso8601String(),
                'total_time_spent_seconds' => $valentine->total_time_spent_seconds,
                'last_section_reached' => $valentine->last_section_reached,
                'furthest_progress' => $valentine->furthest_progress,
                'completed' => $valentine->completed,
                'response' => $valentine->response?->value,
                'responded_at' => $valentine->responded_at?->toIso8601String(),
            ],
            'created_at' => $valentine->created_at->toIso8601String(),
            'expires_at' => $valentine->expires_at?->toIso8601String(),
            'is_expired' => $valentine->isExpired(),
        ];
    }
}
