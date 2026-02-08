<?php

namespace App\Http\Requests\Valentine;

use App\Support\CustomizationConstraints;
use App\Support\MediaConstraints;
use App\Support\SlugConstraints;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreValentineRequest extends FormRequest
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
        $imageMimes = MediaConstraints::getImageMimesString();
        $audioMimes = MediaConstraints::getAudioMimesString();

        return [
            'template_id' => ['required', 'string', 'exists:templates,id'],
            'slug' => [
                'required',
                'string',
                'min:'.SlugConstraints::MIN_LENGTH,
                'max:'.SlugConstraints::MAX_LENGTH,
                SlugConstraints::getValidationRule(),
                'unique:valentines,slug',
            ],
            'recipient_name' => ['required', 'string', 'max:'.CustomizationConstraints::NAME_MAX_LENGTH],
            'sender_name' => ['required', 'string', 'max:'.CustomizationConstraints::NAME_MAX_LENGTH],
            'creator_email' => ['nullable', 'email', 'max:255'],
            'notify_on_response' => ['boolean'],

            'customizations' => ['required', 'array'],
            'customizations.recipient_name' => ['nullable', 'string', 'max:'.CustomizationConstraints::NAME_MAX_LENGTH],
            'customizations.sender_name' => ['nullable', 'string', 'max:'.CustomizationConstraints::NAME_MAX_LENGTH],
            'customizations.title' => ['nullable', 'string', 'max:'.CustomizationConstraints::TITLE_MAX_LENGTH],

            'customizations.memories' => ['required', 'array', 'min:'.MediaConstraints::MIN_IMAGES, 'max:'.MediaConstraints::MAX_IMAGES],
            'customizations.memories.*.id' => ['nullable', 'string', 'max:50'],
            'customizations.memories.*.image' => ['nullable', 'string'],
            'customizations.memories.*.caption' => ['nullable', 'string', 'max:'.CustomizationConstraints::CAPTION_MAX_LENGTH],
            'customizations.memories.*.date' => ['nullable', 'string', 'max:50'],
            'customizations.memories.*.rotation' => ['nullable', 'integer', 'min:'.CustomizationConstraints::ROTATION_MIN, 'max:'.CustomizationConstraints::ROTATION_MAX],

            'customizations.theme' => ['nullable', 'array'],
            'customizations.theme.background' => ['nullable', 'string', Rule::in(CustomizationConstraints::VALID_BACKGROUNDS)],
            'customizations.theme.polaroid_style' => ['nullable', 'string', Rule::in(CustomizationConstraints::VALID_POLAROID_STYLES)],
            'customizations.theme.handwriting_font' => ['nullable', 'string', Rule::in(CustomizationConstraints::VALID_HANDWRITING_FONTS)],

            'customizations.audio' => ['nullable', 'array'],
            'customizations.audio.background_music' => ['nullable', 'string'],

            'customizations.final_message' => ['nullable', 'array'],
            'customizations.final_message.text' => ['nullable', 'string', 'max:'.CustomizationConstraints::MESSAGE_MAX_LENGTH],
            'customizations.final_message.ask_text' => ['nullable', 'string', 'max:'.CustomizationConstraints::ASK_TEXT_MAX_LENGTH],

            'customizations.yes_response' => ['nullable', 'array'],
            'customizations.yes_response.message' => ['nullable', 'string', 'max:'.CustomizationConstraints::MESSAGE_MAX_LENGTH],
            'customizations.yes_response.reveal_photo' => ['nullable', 'string'],

            'images' => ['required', 'array', 'min:'.MediaConstraints::MIN_IMAGES, 'max:'.MediaConstraints::MAX_IMAGES],
            'images.*' => ['required', 'image', 'mimes:'.$imageMimes, 'max:'.MediaConstraints::IMAGE_MAX_SIZE_KB],
            'image_metadata' => ['nullable', 'array'],
            'image_metadata.*' => ['nullable', 'array'],
            'image_metadata.*.sort_order' => ['nullable', 'integer', 'min:0'],
            'image_metadata.*.crop' => ['nullable', 'array'],

            'audio' => ['nullable', 'file', 'mimes:'.$audioMimes, 'max:'.MediaConstraints::AUDIO_MAX_SIZE_KB],
            'audio_metadata' => ['nullable', 'array'],
            'audio_metadata.duration' => ['nullable', 'numeric', 'min:0', 'max:'.MediaConstraints::AUDIO_MAX_DURATION_SECONDS],
            'audio_metadata.trim_start' => ['nullable', 'numeric', 'min:0'],
            'audio_metadata.trim_end' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        $imageMaxMB = MediaConstraints::getImageMaxSizeMB();
        $audioMaxMB = MediaConstraints::getAudioMaxSizeMB();

        return [
            'template_id.required' => 'A template is required',
            'template_id.exists' => 'Invalid template selected',
            'slug.required' => 'A URL slug is required',
            'slug.unique' => 'This URL is already taken',
            'slug.regex' => 'URL must contain only lowercase letters, numbers, and hyphens',
            'recipient_name.required' => "Recipient's name is required",
            'recipient_name.max' => "Recipient's name must be ".CustomizationConstraints::NAME_MAX_LENGTH.' characters or less',
            'sender_name.required' => 'Your name is required',
            'sender_name.max' => 'Your name must be '.CustomizationConstraints::NAME_MAX_LENGTH.' characters or less',
            'customizations.required' => 'Customization data is required',
            'customizations.recipient_name.max' => "Recipient's name must be ".CustomizationConstraints::NAME_MAX_LENGTH.' characters or less',
            'customizations.sender_name.max' => 'Sender name must be '.CustomizationConstraints::NAME_MAX_LENGTH.' characters or less',
            'customizations.title.max' => 'Title must be '.CustomizationConstraints::TITLE_MAX_LENGTH.' characters or less',
            'customizations.memories.min' => 'At least '.MediaConstraints::MIN_IMAGES.' photos are required',
            'customizations.memories.max' => 'Maximum '.MediaConstraints::MAX_IMAGES.' photos allowed',
            'customizations.memories.*.caption.max' => 'Caption must be '.CustomizationConstraints::CAPTION_MAX_LENGTH.' characters or less',
            'customizations.memories.*.rotation.min' => 'Rotation must be between -15 and 15 degrees',
            'customizations.memories.*.rotation.max' => 'Rotation must be between -15 and 15 degrees',
            'customizations.theme.background.in' => 'Invalid background selected',
            'customizations.theme.polaroid_style.in' => 'Invalid polaroid style selected',
            'customizations.theme.handwriting_font.in' => 'Invalid handwriting font selected',
            'customizations.final_message.text.max' => 'Final message must be '.CustomizationConstraints::MESSAGE_MAX_LENGTH.' characters or less',
            'customizations.final_message.ask_text.max' => 'Question must be '.CustomizationConstraints::ASK_TEXT_MAX_LENGTH.' characters or less',
            'customizations.yes_response.message.max' => 'Response message must be '.CustomizationConstraints::MESSAGE_MAX_LENGTH.' characters or less',
            'images.required' => 'At least '.MediaConstraints::MIN_IMAGES.' photos are required',
            'images.min' => 'At least '.MediaConstraints::MIN_IMAGES.' photos are required',
            'images.max' => 'Maximum '.MediaConstraints::MAX_IMAGES.' photos allowed',
            'images.*.image' => 'Each file must be an image',
            'images.*.max' => "Each image must be under {$imageMaxMB}MB",
            'audio.max' => "Audio file must be under {$audioMaxMB}MB",
            'audio_metadata.duration.max' => 'Audio must be '.MediaConstraints::AUDIO_MAX_DURATION_SECONDS.' seconds or less',
        ];
    }

    /**
     * Prepare data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('slug')) {
            $this->merge([
                'slug' => strtolower(trim($this->input('slug'))),
            ]);
        }

        if ($this->has('customizations') && is_string($this->input('customizations'))) {
            $this->merge([
                'customizations' => json_decode($this->input('customizations'), true),
            ]);
        }
    }
}
