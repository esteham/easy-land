<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Upazila;
use Illuminate\Http\Request;

class UpazilaController extends Controller
{
    public function index()
    {
        return Upazila::with('district:id,name_en')
            ->orderBy('name_en')
            ->get();
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $data = $request->validate([
            'district_id' => 'required|exists:districts,id',
            'name_en' => 'required|string',
            'name_bn' => 'required|string',
            'bbs_code' => 'nullable|string',
        ]);
        $upazila = Upazila::create($data);
        return response()->json($upazila, 201);
    }

    public function show(Upazila $upazila)
    {
        return $upazila->load('district:id,name_en');
    }

    public function update(Request $request, Upazila $upazila)
    {
        // if ($request->user()->role !== 'admin') {
        //     return response()->json(['message' => 'Forbidden'], 403);
        // }
        $data = $request->validate([
            'district_id' => 'sometimes|exists:districts,id',
            'name_en' => 'sometimes|required|string',
            'name_bn' => 'sometimes|required|string',
            'bbs_code' => 'nullable|string',
        ]);
        $upazila->update($data);
        return $upazila;
    }

    public function destroy(Upazila $upazila)
    {
        if (request()->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $upazila->delete();
        return response()->json(['deleted' => true]);
    }
}
