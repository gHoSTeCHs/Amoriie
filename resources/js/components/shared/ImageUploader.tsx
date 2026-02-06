import { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { cn } from '@/lib/utils';

type CropData = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type ImageUploaderProps = {
    onUpload: (file: File, cropData?: CropData) => void;
    aspectRatio?: number;
    maxSizeMb?: number;
    showCrop?: boolean;
    placeholder?: string;
    currentImage?: string;
    onRemove?: () => void;
    className?: string;
};

function FloatingHeart({ delay, duration, left }: { delay: number; duration: number; left: number }) {
    return (
        <div
            className="pointer-events-none absolute bottom-0 animate-float-up opacity-0"
            style={{
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
            }}
        >
            <svg
                className="h-3 w-3 text-rose-500/30"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        </div>
    );
}

function HeartIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );
}

function CameraIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
        </svg>
    );
}

function CropIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6.13 1 6 16a2 2 0 0 0 2 2h15" />
            <path d="M1 6.13 16 6a2 2 0 0 1 2 2v15" />
        </svg>
    );
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

export function ImageUploader({
    onUpload,
    aspectRatio,
    maxSizeMb = 10,
    showCrop = true,
    placeholder = 'Add a cherished photo',
    currentImage,
    onRemove,
    className,
}: ImageUploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [error, setError] = useState<string | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const floatingHearts = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        delay: i * 2,
        duration: 8 + Math.random() * 4,
        left: 10 + (i * 15) + Math.random() * 10,
    }));

    useEffect(() => {
        if (currentImage && !previewUrl) {
            setPreviewUrl(currentImage);
        }
    }, [currentImage, previewUrl]);

    const handleFileSelect = useCallback(
        (file: File) => {
            setError(null);

            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }

            const sizeMB = file.size / (1024 * 1024);
            if (sizeMB > maxSizeMb) {
                setError(`Image must be smaller than ${maxSizeMb}MB`);
                return;
            }

            setSelectedFile(file);

            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            if (showCrop) {
                setIsCropping(true);
            } else {
                onUpload(file);
            }
        },
        [maxSizeMb, showCrop, onUpload]
    );

    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                handleFileSelect(file);
            }
        },
        [handleFileSelect]
    );

    const handleDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            setIsDragging(false);

            const file = event.dataTransfer.files[0];
            if (file) {
                handleFileSelect(file);
            }
        },
        [handleFileSelect]
    );

    const handleDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);
    }, []);

    const handleCropComplete = useCallback(() => {
        if (!selectedFile || !completedCrop || !imageRef.current) {
            if (selectedFile) {
                onUpload(selectedFile);
            }
            setIsCropping(false);
            return;
        }

        const image = imageRef.current;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const cropData: CropData = {
            x: Math.round(completedCrop.x * scaleX),
            y: Math.round(completedCrop.y * scaleY),
            width: Math.round(completedCrop.width * scaleX),
            height: Math.round(completedCrop.height * scaleY),
        };

        onUpload(selectedFile, cropData);
        setIsCropping(false);
    }, [selectedFile, completedCrop, onUpload]);

    const handleRemove = useCallback(() => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(currentImage || null);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setError(null);
        onRemove?.();
    }, [previewUrl, currentImage, onRemove]);

    const handleCancelCrop = useCallback(() => {
        setIsCropping(false);
        setCrop(undefined);
        setCompletedCrop(undefined);
    }, []);

    if (isCropping && previewUrl) {
        return (
            <div className={cn('space-y-4', className)}>
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0607]">
                    <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none" />

                    <div className="p-4">
                        <p
                            className="text-center text-rose-300/80 text-sm mb-3"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            Frame your perfect moment
                        </p>

                        <div className="rounded-xl overflow-hidden bg-black/40">
                            <ReactCrop
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspectRatio}
                                className="[&_.ReactCrop__crop-selection]:border-rose-400/60 [&_.ReactCrop__crop-selection]:shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                            >
                                <img
                                    ref={imageRef}
                                    src={previewUrl}
                                    alt="Crop preview"
                                    className="max-h-[60vh] w-full object-contain"
                                />
                            </ReactCrop>
                        </div>
                    </div>

                    <div className="flex gap-3 p-4 pt-0">
                        <button
                            type="button"
                            onClick={handleCancelCrop}
                            className={cn(
                                'flex-1 flex items-center justify-center gap-2 h-12 rounded-xl',
                                'bg-white/5 border border-white/10 text-white/70',
                                'hover:bg-white/10 hover:text-white/90',
                                'transition-all duration-300',
                                'font-medium text-sm'
                            )}
                        >
                            <XIcon className="h-4 w-4" />
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleCropComplete}
                            className={cn(
                                'flex-1 flex items-center justify-center gap-2 h-12 rounded-xl',
                                'bg-gradient-to-r from-rose-500 to-pink-500 text-white',
                                'hover:from-rose-400 hover:to-pink-400',
                                'shadow-lg shadow-rose-500/25',
                                'transition-all duration-300',
                                'font-medium text-sm'
                            )}
                        >
                            <CheckIcon className="h-4 w-4" />
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('space-y-3', className)}>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
            />

            {previewUrl ? (
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0607]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />

                    <img
                        src={previewUrl}
                        alt="Selected"
                        className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-x-0 bottom-0 p-3 z-20 flex items-center justify-between">
                        <p
                            className="text-white/60 text-xs truncate max-w-[60%]"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            {selectedFile?.name || 'Your photo'}
                        </p>

                        <div className="flex gap-2">
                            {showCrop && (
                                <button
                                    type="button"
                                    onClick={() => setIsCropping(true)}
                                    className={cn(
                                        'h-10 w-10 rounded-full flex items-center justify-center',
                                        'bg-white/10 backdrop-blur-sm border border-white/20',
                                        'text-white/80 hover:text-white hover:bg-white/20',
                                        'transition-all duration-300',
                                        'hover:shadow-lg hover:shadow-rose-500/20'
                                    )}
                                    aria-label="Crop image"
                                >
                                    <CropIcon className="h-4 w-4" />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleRemove}
                                className={cn(
                                    'h-10 w-10 rounded-full flex items-center justify-center',
                                    'bg-rose-500/20 backdrop-blur-sm border border-rose-500/30',
                                    'text-rose-300 hover:text-white hover:bg-rose-500/40',
                                    'transition-all duration-300',
                                    'hover:shadow-lg hover:shadow-rose-500/30'
                                )}
                                aria-label="Remove image"
                            >
                                <XIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="absolute top-3 left-3 z-20">
                        <HeartIcon className="h-5 w-5 text-rose-400/60" />
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className={cn(
                        'relative flex aspect-square w-full flex-col items-center justify-center rounded-2xl',
                        'border-2 border-dashed transition-all duration-500',
                        'overflow-hidden group',
                        isDragging
                            ? 'border-rose-400 bg-rose-500/10'
                            : 'border-white/10 bg-white/[0.02] hover:border-rose-400/50 hover:bg-rose-500/5'
                    )}
                >
                    <div
                        className={cn(
                            'absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-pink-500/5',
                            'opacity-0 transition-opacity duration-500',
                            (isHovering || isDragging) && 'opacity-100'
                        )}
                    />

                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {(isHovering || isDragging) &&
                            floatingHearts.map((heart) => (
                                <FloatingHeart
                                    key={heart.id}
                                    delay={heart.delay}
                                    duration={heart.duration}
                                    left={heart.left}
                                />
                            ))}
                    </div>

                    <div
                        className={cn(
                            'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500',
                            'shadow-[inset_0_0_60px_rgba(244,63,94,0.1)]',
                            (isHovering || isDragging) && 'opacity-100'
                        )}
                    />

                    <div className="relative z-10 flex flex-col items-center">
                        <div
                            className={cn(
                                'mb-4 h-16 w-16 rounded-full flex items-center justify-center',
                                'bg-gradient-to-br from-rose-500/20 to-pink-500/20',
                                'border border-rose-500/20',
                                'transition-all duration-500',
                                'group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-rose-500/20'
                            )}
                        >
                            <CameraIcon className="h-7 w-7 text-rose-400" />
                        </div>

                        <p
                            className="text-rose-300/80 text-lg mb-1"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            {placeholder}
                        </p>

                        <p className="text-white/40 text-xs">
                            {isDragging ? 'Drop to upload' : 'Tap or drag & drop'}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-white/30 text-xs">
                            <HeartIcon className="h-3 w-3" />
                            <span>Max {maxSizeMb}MB</span>
                        </div>
                    </div>
                </button>
            )}

            {error && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <HeartIcon className="h-4 w-4 text-rose-400 flex-shrink-0" />
                    <p className="text-rose-300 text-sm">{error}</p>
                </div>
            )}
        </div>
    );
}

export type { CropData, ImageUploaderProps };
