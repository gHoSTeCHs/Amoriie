<?php

namespace App\Services;

use App\Support\MediaConstraints;
use Illuminate\Http\UploadedFile;
use Intervention\Image\Interfaces\ImageInterface;
use Intervention\Image\Laravel\Facades\Image;

class ImageProcessingService
{
    protected int $maxWidth = MediaConstraints::IMAGE_MAX_WIDTH;

    protected int $thumbnailWidth = MediaConstraints::THUMBNAIL_WIDTH;

    protected int $quality = MediaConstraints::IMAGE_QUALITY;

    /**
     * Process an image without cropping.
     *
     * @return array{full: string, thumbnail: string, og: string, width: int, height: int}
     */
    public function processImage(UploadedFile $file): array
    {
        $image = Image::read($file->getPathname());
        $image = $this->stripExif($image);

        $fullImage = $this->resizeToMax(clone $image);
        $thumbnail = $this->createThumbnail(clone $image);

        return [
            'full' => $this->encodeWebp($fullImage),
            'thumbnail' => $this->encodeWebp($thumbnail),
            'og' => $this->encodeJpg(clone $fullImage),
            'width' => $fullImage->width(),
            'height' => $fullImage->height(),
        ];
    }

    /**
     * Process an image with crop coordinates.
     *
     * @param  array{x: int|float, y: int|float, width: int|float, height: int|float}  $cropData
     * @return array{full: string, thumbnail: string, og: string, width: int, height: int}
     */
    public function processImageWithCrop(UploadedFile $file, array $cropData): array
    {
        $image = Image::read($file->getPathname());
        $image = $this->stripExif($image);

        if (! empty($cropData)) {
            $image = $image->crop(
                (int) $cropData['width'],
                (int) $cropData['height'],
                (int) $cropData['x'],
                (int) $cropData['y']
            );
        }

        $fullImage = $this->resizeToMax(clone $image);
        $thumbnail = $this->createThumbnail(clone $image);

        return [
            'full' => $this->encodeWebp($fullImage),
            'thumbnail' => $this->encodeWebp($thumbnail),
            'og' => $this->encodeJpg(clone $fullImage),
            'width' => $fullImage->width(),
            'height' => $fullImage->height(),
        ];
    }

    /**
     * Strip EXIF data from image for privacy.
     *
     * Uses orient() to read and apply EXIF orientation data before stripping.
     * The subsequent encode to WebP/JPEG will remove all EXIF metadata.
     */
    protected function stripExif(ImageInterface $image): ImageInterface
    {
        return $image->orient();
    }

    /**
     * Resize image to maximum width while maintaining aspect ratio.
     */
    protected function resizeToMax(ImageInterface $image): ImageInterface
    {
        if ($image->width() > $this->maxWidth) {
            $image = $image->scaleDown(width: $this->maxWidth);
        }

        return $image;
    }

    /**
     * Create a thumbnail version of the image.
     */
    protected function createThumbnail(ImageInterface $image): ImageInterface
    {
        return $image->scaleDown(width: $this->thumbnailWidth);
    }

    /**
     * Encode image as WebP format.
     */
    protected function encodeWebp(ImageInterface $image): string
    {
        return $image->toWebp($this->quality)->toString();
    }

    /**
     * Encode image as JPEG format for OG/social sharing.
     */
    protected function encodeJpg(ImageInterface $image): string
    {
        return $image->toJpeg($this->quality)->toString();
    }
}
