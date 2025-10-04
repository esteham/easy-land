<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Mouza;
use Illuminate\Http\Request;

class MouzaController extends Controller
{
    public function index()
    {
        return Mouza::with('upazila:id,name_en')
            ->orderBy('name_en')
            ->get();
    }

    public function store(Request $request)
    {
        // if ($request->user()->role !== 'admin') {
        //     return response()->json(['message' => 'Forbidden'], 403);
        // }
        $data = $request->validate([
            'upazila_id' => 'required|exists:upazilas,id',
            'name_en' => 'required|string',
            'name_bn' => 'required|string',
            'jl_no' => 'nullable|string',
            'mouza_code' => 'nullable|string',
            'meta' => 'nullable|array',
        ]);
        $mouza = Mouza::create($data);
        return response()->json($mouza, 201);
    }

    public function show(Mouza $mouza)
    {
        return $mouza->load('upazila:id,name_en');
    }

    public function update(Request $request, Mouza $mouza)
    {
        // if ($request->user()->role !== 'admin') {
        //     return response()->json(['message' => 'Forbidden'], 403);
        // }
        $data = $request->validate([
            'upazila_id' => 'sometimes|exists:upazilas,id',
            'name_en' => 'sometimes|required|string',
            'name_bn' => 'sometimes|required|string',
            'jl_no' => 'nullable|string',
            'mouza_code' => 'nullable|string',
            'meta' => 'nullable|array',
        ]);
        $mouza->update($data);
        return $mouza;
    }

    public function destroy(Mouza $mouza)
    {
        if (request()->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $mouza->delete();
        return response()->json(['deleted' => true]);
    }
}
