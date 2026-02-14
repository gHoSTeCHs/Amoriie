<?php

namespace App\Http\Controllers;

use App\Http\Requests\Valentine\RecordProgressRequest;
use App\Http\Requests\Valentine\RecordResponseRequest;
use App\Http\Requests\Valentine\RecordViewRequest;
use App\Http\Requests\Valentine\StoreValentineRequest;
use App\Models\Template;
use App\Models\Valentine;
use App\Services\Contracts\ValentineServiceInterface;
use App\Services\R2StorageService;
use App\Services\ValentineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ValentineController extends Controller
{
    public function __construct(
        private ValentineServiceInterface $valentineService,
        private R2StorageService $r2Storage
    ) {}

    public function index(): Response
    {
        $templates = Cache::remember('templates.active', 3600, function () {
            return Template::query()
                ->active()
                ->ordered()
                ->get();
        });

        return Inertia::render('create/index', [
            'templates' => $templates,
        ]);
    }

    public function builder(string $templateId): Response
    {
        $template = Cache::remember("template.{$templateId}", 3600, function () use ($templateId) {
            return Template::query()
                ->where('id', $templateId)
                ->active()
                ->first();
        });

        if (! $template) {
            abort(404);
        }

        return Inertia::render('create/builder', [
            'template' => $template,
        ]);
    }

    public function preview(string $templateId): Response
    {
        $template = Cache::remember("template.{$templateId}", 3600, function () use ($templateId) {
            return Template::query()
                ->where('id', $templateId)
                ->active()
                ->first();
        });

        if (! $template) {
            abort(404);
        }

        return Inertia::render('create/preview', [
            'templateId' => $templateId,
        ]);
    }

    public function store(StoreValentineRequest $request): JsonResponse
    {
        Gate::authorize('create', Valentine::class);

        $validated = $request->validated();

        $mediaFiles = [
            'images' => $request->file('images', []),
            'audio' => $request->file('audio'),
        ];

        $valentine = $this->valentineService->createValentine($validated, $mediaFiles);

        return response()->json([
            'success' => true,
            'valentine' => [
                'id' => $valentine->id,
                'slug' => $valentine->slug,
                'public_url' => $valentine->getPublicUrl(),
                'stats_url' => $valentine->getStatsUrl(),
            ],
        ], 201);
    }

    public function success(string $slug): Response
    {
        $valentine = Valentine::query()
            ->bySlug($slug)
            ->active()
            ->first();

        if (! $valentine) {
            return Inertia::render('create/success', [
                'error' => 'Valentine not found',
            ]);
        }

        return Inertia::render('create/success', [
            'valentine' => [
                'slug' => $valentine->slug,
                'recipient_name' => $valentine->recipient_name,
                'public_url' => $valentine->getPublicUrl(),
                'stats_url' => $valentine->getStatsUrl(),
            ],
            'config' => [
                'expires_in_days' => ValentineService::EXPIRES_IN_DAYS,
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $valentine = Valentine::query()
            ->bySlug($slug)
            ->active()
            ->with('template')
            ->first();

        if ($valentine) {
            $ogImageUrl = $valentine->og_image_path
                ? $this->r2Storage->getPublicUrl($valentine->og_image_path)
                : asset('images/og-default.png');

            $title = ($valentine->customizations['title'] ?? null)
                ? $valentine->customizations['title'] . ' — Amoriie'
                : "A Surprise for {$valentine->recipient_name} — Amoriie";

            return Inertia::render('valentine/show', [
                'valentine' => [
                    'id' => $valentine->id,
                    'slug' => $valentine->slug,
                    'recipient_name' => $valentine->recipient_name,
                    'template_id' => $valentine->template_id,
                    'customizations' => $valentine->customizations,
                ],
                'og_image_url' => $ogImageUrl,
                'og_title' => $title,
                'og_description' => "{$valentine->recipient_name}, someone has created something special just for you. Tap to see your surprise!",
                'og_url' => $valentine->getPublicUrl(),
                'public_url' => $valentine->getPublicUrl(),
            ]);
        }

        $expiredValentine = Valentine::query()
            ->bySlug($slug)
            ->published()
            ->expired()
            ->first();

        $defaultOgImage = asset('images/og-default.png');

        if ($expiredValentine) {
            return Inertia::render('valentine/show', [
                'error' => 'expired',
                'recipient_name' => $expiredValentine->recipient_name,
                'og_image_url' => $defaultOgImage,
                'og_title' => 'Valentine Expired — Amoriie',
                'og_description' => 'This valentine has expired. Create your own special valentine to share with someone you love.',
            ]);
        }

        return Inertia::render('valentine/show', [
            'error' => 'not_found',
            'og_image_url' => $defaultOgImage,
            'og_title' => 'Valentine Not Found — Amoriie',
            'og_description' => 'Create a beautiful, personalized valentine to share with someone special.',
        ]);
    }

    public function recordView(RecordViewRequest $request, string $slug): JsonResponse
    {
        $valentine = Valentine::query()
            ->bySlug($slug)
            ->active()
            ->first();

        if (! $valentine) {
            return response()->json(['error' => 'Valentine not found'], 404);
        }

        $this->valentineService->recordView(
            $valentine,
            $request->validated('fingerprint')
        );

        return response()->json(['success' => true]);
    }

    public function recordProgress(RecordProgressRequest $request, string $slug): JsonResponse
    {
        $valentine = Valentine::query()
            ->bySlug($slug)
            ->active()
            ->first();

        if (! $valentine) {
            return response()->json(['error' => 'Valentine not found'], 404);
        }

        $validated = $request->validated();

        $this->valentineService->recordProgress(
            $valentine,
            $validated['section'],
            $validated['memory_index'] ?? null,
            $validated['fingerprint'] ?? null
        );

        return response()->json(['success' => true]);
    }

    public function recordResponse(RecordResponseRequest $request, string $slug): JsonResponse
    {
        $valentine = Valentine::query()
            ->bySlug($slug)
            ->active()
            ->first();

        if (! $valentine) {
            return response()->json(['error' => 'Valentine not found'], 404);
        }

        $this->valentineService->recordResponse(
            $valentine,
            $request->validated('response')
        );

        return response()->json(['success' => true]);
    }
}
