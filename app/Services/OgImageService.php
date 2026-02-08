<?php

namespace App\Services;

use App\Models\Valentine;
use App\Services\Contracts\OgImageServiceInterface;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

class OgImageService implements OgImageServiceInterface
{
    protected const SUBDIRECTORY = 'og';

    protected const FILENAME = 'og-image.png';

    public function __construct(
        protected R2StorageService $r2Storage
    ) {}

    public function generate(Valentine $valentine): string
    {
        if ($valentine->og_image_path && $this->r2Storage->exists($valentine->og_image_path)) {
            Log::debug('OG image already exists, skipping generation', [
                'valentine_id' => $valentine->id,
                'path' => $valentine->og_image_path,
            ]);

            return $valentine->og_image_path;
        }

        Log::info('Starting OG image generation', [
            'valentine_id' => $valentine->id,
            'recipient_name' => $valentine->recipient_name,
        ]);

        $inputData = $this->prepareInputData($valentine);
        $pngContent = $this->generatePng($inputData);

        $path = $this->r2Storage->uploadContent(
            $pngContent,
            $valentine->id,
            self::SUBDIRECTORY,
            self::FILENAME
        );

        $valentine->update(['og_image_path' => $path]);

        Log::info('OG image generated successfully', [
            'valentine_id' => $valentine->id,
            'path' => $path,
        ]);

        return $path;
    }

    public function getPublicUrl(Valentine $valentine): ?string
    {
        if (! $valentine->og_image_path) {
            return null;
        }

        return $this->r2Storage->getPublicUrl($valentine->og_image_path);
    }

    public function exists(Valentine $valentine): bool
    {
        if (! $valentine->og_image_path) {
            return false;
        }

        return $this->r2Storage->exists($valentine->og_image_path);
    }

    public function delete(Valentine $valentine): bool
    {
        if (! $valentine->og_image_path) {
            return true;
        }

        $deleted = $this->r2Storage->delete($valentine->og_image_path);

        if ($deleted) {
            $valentine->update(['og_image_path' => null]);
        }

        return $deleted;
    }

    /**
     * @return array<string, mixed>
     */
    protected function prepareInputData(Valentine $valentine): array
    {
        $customizations = $valentine->customizations ?? [];

        return [
            'recipientName' => $valentine->recipient_name ?? 'Someone',
            'title' => $customizations['title'] ?? null,
            'senderName' => $valentine->sender_name ?? null,
        ];
    }

    /**
     * @param  array<string, mixed>  $inputData
     */
    protected function generatePng(array $inputData): string
    {
        $tempInput = tempnam(sys_get_temp_dir(), 'og_input_') . '.json';
        $tempOutput = tempnam(sys_get_temp_dir(), 'og_output_') . '.png';

        try {
            file_put_contents($tempInput, json_encode($inputData));

            $scriptPath = base_path('scripts/og-generator.js');

            $result = Process::timeout(30)->run([
                'node',
                $scriptPath,
                '--input',
                $tempInput,
                '--output',
                $tempOutput,
            ]);

            if (! $result->successful()) {
                Log::error('OG image generation failed', [
                    'input' => $inputData,
                    'exit_code' => $result->exitCode(),
                    'output' => $result->output(),
                    'error' => $result->errorOutput(),
                ]);

                throw new \RuntimeException(
                    'OG image generation failed: ' . $result->errorOutput()
                );
            }

            if (! file_exists($tempOutput)) {
                throw new \RuntimeException('OG image output file not created');
            }

            $pngContent = file_get_contents($tempOutput);

            if ($pngContent === false) {
                throw new \RuntimeException('Failed to read OG image output');
            }

            return $pngContent;
        } finally {
            @unlink($tempInput);
            @unlink($tempOutput);
        }
    }
}
