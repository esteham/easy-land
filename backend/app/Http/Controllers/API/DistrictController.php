<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\District;
use Illuminate\Http\Request;

class DistrictController extends Controller
{
    public function index()
    {
        return District::with('division:id,name_en')
            ->orderBy('name_en')
            ->get();
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $data = $request->validate([
            'division_id' => 'required|exists:divisions,id',
            'name_en' => 'required|string',
            'name_bn' => 'required|string',
            'bbs_code' => 'nullable|string',
        ]);
        $district = District::create($data);
        return response()->json($district, 201);
    }

    public function show(District $district)
    {
        return $district->load('division:id,name_en');
    }

    public function update(Request $request, District $district)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $data = $request->validate([
            'division_id' => 'sometimes|exists:divisions,id',
            'name_en' => 'sometimes|required|string',
            'name_bn' => 'sometimes|required|string',
            'bbs_code' => 'nullable|string',
        ]);
        $district->update($data);
        return $district;
    }

    public function destroy(District $district)
    {
        if (request()->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $district->delete();
        return response()->json(['deleted' => true]);
    }
}
