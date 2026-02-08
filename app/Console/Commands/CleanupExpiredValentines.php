<?php

namespace App\Console\Commands;

use App\Models\Valentine;
use App\Services\R2StorageService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CleanupExpiredValentines extends Command
{
    protected $signature = 'valentines:cleanup
        {--days=7 : Days past expiration before cleanup}
        {--dry-run : Show what would be deleted without deleting}
        {--force : Skip confirmation prompt}';

    protected $description = 'Clean up expired valentines and their R2 storage files';

    public function __construct(
        protected R2StorageService $r2Storage
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $gracePeriodDays = (int) $this->option('days');
        $dryRun = (bool) $this->option('dry-run');
        $force = (bool) $this->option('force');

        $cutoffDate = now()->subDays($gracePeriodDays);

        $query = Valentine::query()
            ->expired()
            ->where('expires_at', '<', $cutoffDate);

        $count = $query->count();

        if ($count === 0) {
            $this->info('No expired valentines to clean up.');

            return self::SUCCESS;
        }

        $this->info("Found {$count} valentine(s) expired more than {$gracePeriodDays} days ago.");

        if ($dryRun) {
            $this->warn('Dry run mode - showing what would be deleted:');
            $this->newLine();

            $query->cursor()->each(function (Valentine $valentine): void {
                $this->line("  - {$valentine->slug} (ID: {$valentine->id}, expired: {$valentine->expires_at->format('Y-m-d')})");
            });

            $this->newLine();
            $this->info("Would delete {$count} valentine(s) and their storage files.");

            return self::SUCCESS;
        }

        if (! $force && ! $this->confirm("Delete {$count} expired valentine(s) and their storage files?")) {
            $this->info('Cleanup cancelled.');

            return self::SUCCESS;
        }

        $deleted = 0;
        $errors = 0;

        $this->withProgressBar($query->cursor(), function (Valentine $valentine) use (&$deleted, &$errors): void {
            try {
                $this->deleteValentine($valentine);
                $deleted++;
            } catch (\Exception $e) {
                $errors++;
                Log::error('Valentine cleanup failed', [
                    'valentine_id' => $valentine->id,
                    'slug' => $valentine->slug,
                    'error' => $e->getMessage(),
                ]);
            }
        });

        $this->newLine(2);

        if ($errors > 0) {
            $this->warn("Cleanup completed with errors. Deleted: {$deleted}, Errors: {$errors}");
            $this->error('Check logs for details on failed deletions.');

            return self::FAILURE;
        }

        $this->info("Cleanup completed successfully. Deleted {$deleted} valentine(s).");

        return self::SUCCESS;
    }

    protected function deleteValentine(Valentine $valentine): void
    {
        $this->r2Storage->deleteDirectory($valentine->id);

        $valentine->media()->delete();

        $valentine->forceDelete();
    }
}
