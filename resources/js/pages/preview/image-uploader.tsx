import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { ImageUploader, type CropData } from '@/components/shared/ImageUploader';

export default function ImageUploaderPreview() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [cropData, setCropData] = useState<CropData | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleUpload = (file: File, crop?: CropData) => {
        setUploadedFile(file);
        setCropData(crop || null);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleRemove = () => {
        setUploadedFile(null);
        setCropData(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
    };

    return (
        <>
            <Head title="ImageUploader Preview" />

            <div className="min-h-screen bg-[#0c0607] text-white">
                <div className="mx-auto max-w-md px-4 py-12">
                    <div className="text-center mb-8">
                        <h1
                            className="text-3xl text-rose-300 mb-2"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            ImageUploader Preview
                        </h1>
                        <p className="text-white/50 text-sm">
                            Phase 3.3 Component Demo
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-sm font-medium text-white/70 mb-3">
                                Default (with crop)
                            </h2>
                            <ImageUploader
                                onUpload={handleUpload}
                                onRemove={handleRemove}
                                placeholder="Add a cherished photo"
                            />
                        </div>

                        <div>
                            <h2 className="text-sm font-medium text-white/70 mb-3">
                                Square aspect ratio (1:1)
                            </h2>
                            <ImageUploader
                                onUpload={handleUpload}
                                onRemove={handleRemove}
                                aspectRatio={1}
                                placeholder="Profile photo"
                            />
                        </div>

                        <div>
                            <h2 className="text-sm font-medium text-white/70 mb-3">
                                Landscape (16:9)
                            </h2>
                            <ImageUploader
                                onUpload={handleUpload}
                                onRemove={handleRemove}
                                aspectRatio={16 / 9}
                                placeholder="Cover photo"
                            />
                        </div>

                        {uploadedFile && (
                            <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-sm font-medium text-rose-300 mb-3">
                                    Last Upload Info
                                </h3>
                                <div className="space-y-2 text-xs text-white/60">
                                    <p>
                                        <span className="text-white/40">File:</span>{' '}
                                        {uploadedFile.name}
                                    </p>
                                    <p>
                                        <span className="text-white/40">Size:</span>{' '}
                                        {(uploadedFile.size / 1024).toFixed(1)} KB
                                    </p>
                                    <p>
                                        <span className="text-white/40">Type:</span>{' '}
                                        {uploadedFile.type}
                                    </p>
                                    {cropData && (
                                        <p>
                                            <span className="text-white/40">Crop:</span>{' '}
                                            x:{cropData.x}, y:{cropData.y}, w:{cropData.width}, h:
                                            {cropData.height}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
