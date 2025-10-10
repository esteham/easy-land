<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MutationStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Auth handled in controller
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'application_id' => 'required|exists:applications,id',
            'mutation_type' => 'required|in:sale,inheritance,gift,partition,decree',
            'reason' => 'nullable|string',
            'documents' => 'nullable|array',
            'documents.*.name' => 'string',
            'documents.*.path' => 'string',
            'fee_amount' => 'required|numeric|min:0',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $application = \App\Models\Application::find($this->application_id);
            if ($application && $application->user_id !== auth()->id()) {
                $validator->errors()->add('application_id', 'The selected application does not belong to you.');
            }
        });
    }
}
