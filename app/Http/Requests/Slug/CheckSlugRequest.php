<?php

namespace App\Http\Requests\Slug;

use App\Support\SlugConstraints;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CheckSlugRequest extends FormRequest
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
            'slug' => [
                'required',
                'string',
                'min:'.SlugConstraints::MIN_LENGTH,
                'max:'.SlugConstraints::MAX_LENGTH,
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'slug.required' => 'Please enter a slug to check',
            'slug.min' => 'Slug must be at least '.SlugConstraints::MIN_LENGTH.' characters',
            'slug.max' => 'Slug cannot exceed '.SlugConstraints::MAX_LENGTH.' characters',
        ];
    }
}
