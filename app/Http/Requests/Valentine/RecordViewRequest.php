<?php

namespace App\Http\Requests\Valentine;

use Illuminate\Foundation\Http\FormRequest;

class RecordViewRequest extends FormRequest
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
            'fingerprint' => ['nullable', 'string', 'max:100'],
        ];
    }
}
