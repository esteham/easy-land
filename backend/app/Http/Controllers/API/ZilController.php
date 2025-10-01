<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Zil;
use Illuminate\Http\Request;

class ZilController extends Controller
{
    public function index()
    {
        return Zil::with('mouza:id,name_en')
            ->orderBy('zil_no')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'mouza_id' => 'required|exists:mouzas,id',
            'zil_no' => 'required|string',
            'map_url' => 'nullable|url',
            'meta' => 'nullable|array',
        ]);
        $zil = Zil::create($data);
        return response()->json($zil, 201);
    }

    public function show(Zil $zil)
    {
        return $zil->load('mouza:id,name_en');
    }

    public function update(Request $request, Zil $zil)
    {
        $data = $request->validate([
            'mouza_id' => 'sometimes|exists:mouzas,id',
            'zil_no' => 'sometimes|required|string',
            'map_url' => 'nullable|url',
            'meta' => 'nullable|array',
        ]);
        $zil->update($data);
        return $zil;
    }

    public function destroy(Zil $zil)
    {
        $zil->delete();
        return response()->json(['deleted' => true]);
    }
}
