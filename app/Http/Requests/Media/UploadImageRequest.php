<?php

namespace App\Http\Requests\Media;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UploadImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'image' => ['required', 'image', 'mimes:jpeg,png,webp,gif', 'max:10240'],
            'crop' => ['nullable', 'array'],
            'crop.x' => ['required_with:crop', 'numeric', 'min:0'],
            'crop.y' => ['required_with:crop', 'numeric', 'min:0'],
            'crop.width' => ['required_with:crop', 'numeric', 'min:1'],
            'crop.height' => ['required_with:crop', 'numeric', 'min:1'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
