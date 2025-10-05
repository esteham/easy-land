<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SurveyTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return \App\Models\SurveyType::orderBy('name_en')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|unique:survey_types,code',
            'name_en' => 'required|string',
            'name_bn' => 'nullable|string',
            'description' => 'nullable|string',
        ]);
        $surveyType = \App\Models\SurveyType::create($data);
        return response()->json($surveyType, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return \App\Models\SurveyType::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $surveyType = \App\Models\SurveyType::findOrFail($id);
        $data = $request->validate([
            'code' => 'sometimes|required|string|unique:survey_types,code,' . $id,
            'name_en' => 'sometimes|required|string',
            'name_bn' => 'nullable|string',
            'description' => 'nullable|string',
        ]);
        $surveyType->update($data);
        return $surveyType;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $surveyType = \App\Models\SurveyType::findOrFail($id);
        $surveyType->delete();
        return response()->json(['deleted' => true]);
    }
}
