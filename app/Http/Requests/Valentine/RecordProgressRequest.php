<?php

namespace App\Http\Requests\Valentine;

use App\Support\ViewerSections;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RecordProgressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'section' => ['required', 'string', Rule::in(ViewerSections::getAllSections())],
            'memory_index' => ['nullable', 'integer', 'min:0'],
            'fingerprint' => ['nullable', 'string', 'max:100'],
        ];
    }
}
