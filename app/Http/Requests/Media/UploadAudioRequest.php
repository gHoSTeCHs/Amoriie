<?php

namespace App\Http\Requests\Media;

use App\Rules\ValidFileContent;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UploadAudioRequest extends FormRequest
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
            'audio' => ['required', 'file', 'mimes:mp3,wav,ogg,m4a,mp4', 'max:15360', new ValidFileContent('audio')],
            'metadata' => ['nullable', 'array'],
            'metadata.duration' => ['nullable', 'numeric', 'min:0', 'max:300'],
            'metadata.sample_rate' => ['nullable', 'integer', 'min:8000', 'max:96000'],
            'metadata.channels' => ['nullable', 'integer', 'min:1', 'max:2'],
            'metadata.original_duration' => ['nullable', 'numeric', 'min:0'],
            'metadata.trim_start' => ['nullable', 'numeric', 'min:0'],
            'metadata.trim_end' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
