<?php

namespace App\Jobs;

use App\Models\Valentine;
use App\Services\Contracts\OgImageServiceInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateOgImageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 30;

    public function __construct(
        public Valentine $valentine
    ) {}

    public function handle(OgImageServiceInterface $ogImageService): void
    {
        try {
            $ogImageService->generate($this->valentine);

            Log::info('OG image generated successfully', [
                'valentine_id' => $this->valentine->id,
                'slug' => $this->valentine->slug,
            ]);
        } catch (\Exception $e) {
            Log::error('OG image generation failed', [
                'valentine_id' => $this->valentine->id,
                'slug' => $this->valentine->slug,
                'error' => $e->getMessage(),
                'attempt' => $this->attempts(),
            ]);

            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('OG image generation job failed permanently', [
            'valentine_id' => $this->valentine->id,
            'slug' => $this->valentine->slug,
            'error' => $exception->getMessage(),
        ]);
    }
}
