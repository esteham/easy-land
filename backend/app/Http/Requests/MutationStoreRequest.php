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
            'application_id' => 'nullable|exists:applications,id',
            'mutation_type' => 'required|in:sale,inheritance,gift,partition,decree',
            'reason' => 'nullable|string',
            'documents' => 'nullable|array',
            'documents.*.name' => 'string',
            'documents.*.path' => 'string',
            'fee_amount' => 'required|numeric|min:0',
            'mouza_name' => 'nullable|string',
            'khatian_number' => 'nullable|string',
            'dag_number' => 'nullable|string',
            'buyer_name' => 'nullable|string',
            'buyer_nid' => 'nullable|string',
            'buyer_address' => 'nullable|string',
            'previous_owner_name' => 'nullable|string',
            'previous_owner_nid' => 'nullable|string',
            'previous_owner_address' => 'nullable|string',
            'deed_number' => 'nullable|string',
            'deed_date' => 'nullable|date',
            'registry_office' => 'nullable|string',
            'land_type' => 'nullable|in:agricultural,non-agricultural',
            'land_area' => 'nullable|numeric|min:0',
            'contact_number' => 'nullable|string',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->application_id) {
                $application = \App\Models\Application::find($this->application_id);
                if ($application && $application->user_id !== auth()->id()) {
                    $validator->errors()->add('application_id', 'The selected application does not belong to you.');
                }
            }
        });
    }
}
