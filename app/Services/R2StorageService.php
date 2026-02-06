<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Filesystem\Filesystem;

class R2StorageService
{
    protected string $disk = 'r2';

    protected function storage(): Filesystem
    {
        return Storage::disk($this->disk);
    }

    /**
     * Build the storage path for a valentine's media files.
     */
    protected function buildPath(string $valentineId, string $subdirectory, string $filename): string
    {
        return "valentines/{$valentineId}/{$subdirectory}/{$filename}";
    }

    /**
     * Upload a file to R2 storage.
     *
     * @param UploadedFile $file The file to upload
     * @param string $valentineId The valentine UUID
     * @param string $subdirectory The subdirectory (e.g., 'images', 'audio')
     * @param string|null $filename Optional custom filename, defaults to unique ID with original extension
     * @return string The stored file path
     */
    public function uploadFile(
        UploadedFile $file,
        string $valentineId,
        string $subdirectory,
        ?string $filename = null
    ): string {
        $filename = $filename ?? $this->generateFilename($file);
        $path = $this->buildPath($valentineId, $subdirectory, $filename);

        $this->storage()->put($path, $file->getContent());

        return $path;
    }

    /**
     * Upload raw content to R2 storage.
     *
     * @param string $content The content to upload
     * @param string $valentineId The valentine UUID
     * @param string $subdirectory The subdirectory (e.g., 'images', 'audio')
     * @param string $filename The filename to use
     * @return string The stored file path
     */
    public function uploadContent(
        string $content,
        string $valentineId,
        string $subdirectory,
        string $filename
    ): string {
        $path = $this->buildPath($valentineId, $subdirectory, $filename);

        $this->storage()->put($path, $content);

        return $path;
    }

    /**
     * Delete a single file from R2 storage.
     *
     * @param string $path The file path to delete
     * @return bool True if deletion was successful
     */
    public function delete(string $path): bool
    {
        return $this->storage()->delete($path);
    }

    /**
     * Delete all files for a valentine.
     *
     * @param string $valentineId The valentine UUID
     * @return bool True if deletion was successful
     */
    public function deleteDirectory(string $valentineId): bool
    {
        return $this->storage()->deleteDirectory("valentines/{$valentineId}");
    }

    /**
     * Get the public URL for a stored file.
     *
     * @param string $path The file path
     * @return string The public URL
     */
    public function getPublicUrl(string $path): string
    {
        return $this->storage()->url($path);
    }

    /**
     * Check if a file exists in R2 storage.
     *
     * @param string $path The file path to check
     * @return bool True if the file exists
     */
    public function exists(string $path): bool
    {
        return $this->storage()->exists($path);
    }

    /**
     * Generate a unique filename preserving the original extension.
     */
    protected function generateFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();

        return uniqid('', true) . '.' . $extension;
    }
}
