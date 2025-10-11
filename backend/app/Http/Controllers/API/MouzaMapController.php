<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MouzaMap;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MouzaMapController extends Controller
{
    public function index()
    {
        return MouzaMap::with('zil:id,zil_no')
            ->orderBy('name')
            ->get()
            ->map(function ($m) {
                $m->document_url = $m->document_url;
                return $m;
            });
    }

    public function store(Request $request)
    {
        $request->validate([
            'zil_id'   => 'required|exists:zils,id',
            'name'     => 'nullable|string',
            'document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:8192',
        ]);

        $docPath = null;
        if ($request->hasFile('document')) {
            $docPath = $request->file('document')->store('mouza_maps', 'public');
        }

        $mouzaMap = MouzaMap::create([
            'zil_id'   => $request->zil_id,
            'name'     => $request->name,
            'document' => $docPath,
        ]);

        $mouzaMap->load('zil:id,zil_no');
        $mouzaMap->document_url = $mouzaMap->document_url;

        return response()->json($mouzaMap, 201);
    }

    public function show(MouzaMap $mouzaMap)
    {
        $mouzaMap->load('zil:id,zil_no');
        $mouzaMap->document_url = $mouzaMap->document_url;
        return $mouzaMap;
    }

    public function update(Request $request, MouzaMap $mouzaMap)
    {
        $request->validate([
            'zil_id'    => 'sometimes|exists:zils,id',
            'name'      => 'nullable|string',
            'document'  => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:8192',
            'remove_document' => 'nullable|boolean',
        ]);

        $data = [];

        if ($request->filled('zil_id')) $data['zil_id'] = $request->zil_id;
        if ($request->has('name')) $data['name'] = $request->name;

        // document logic
        if ($request->boolean('remove_document') && $mouzaMap->document) {
            Storage::disk('public')->delete($mouzaMap->document);
            $data['document'] = null;
        }

        if ($request->hasFile('document')) {
            if ($mouzaMap->document) {
                Storage::disk('public')->delete($mouzaMap->document);
            }
            $data['document'] = $request->file('document')->store('mouza_maps', 'public');
        }

        $mouzaMap->update($data);

        $mouzaMap->load('zil:id,zil_no');
        $mouzaMap->document_url = $mouzaMap->document_url;

        return $mouzaMap;
    }

    public function destroy(MouzaMap $mouzaMap)
    {
        if ($mouzaMap->document) {
            Storage::disk('public')->delete($mouzaMap->document);
        }
        $mouzaMap->delete();
        return response()->json(['deleted' => true]);
    }
}
