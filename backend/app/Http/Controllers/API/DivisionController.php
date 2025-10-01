<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Division;
use Illuminate\Http\Request;

class DivisionController extends Controller
{
    public function index()
    {
        return Division::orderBy('name_en')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name_en' => 'required|string',
            'name_bn' => 'required|string',
            'bbs_code' => 'nullable|string',
        ]);
        $division = Division::create($data);
        return response()->json($division, 201);
    }

    public function show(Division $division)
    {
        return $division;
    }

    public function update(Request $request, Division $division)
    {
        $data = $request->validate([
            'name_en' => 'sometimes|required|string',
            'name_bn' => 'sometimes|required|string',
            'bbs_code' => 'nullable|string',
        ]);
        $division->update($data);
        return $division;
    }

    public function destroy(Division $division)
    {
        $division->delete();
        return response()->json(['deleted' => true]);
    }
}
