<?php

namespace App\Http\Requests\Valentine;

use App\Enums\ValentineResponse;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RecordResponseRequest extends FormRequest
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
            'response' => ['required', 'string', Rule::in(ValentineResponse::values())],
            'fingerprint' => ['nullable', 'string', 'max:100'],
        ];
    }
}
