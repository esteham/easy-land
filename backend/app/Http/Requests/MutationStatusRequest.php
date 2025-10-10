<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MutationStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Role middleware handles
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => 'required|in:pending,under_review,approved,rejected,flagged',
            'remarks' => 'nullable|string',
        ];
    }
}
