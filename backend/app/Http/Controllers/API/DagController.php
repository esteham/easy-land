<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Dag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class DagController extends Controller
{
    public function index()
    {
        return Dag::with('zil:id,zil_no', 'surveyType:id,code,name_en')
            ->orderBy('dag_no')
            ->get()
            ->map(function ($d) {
                $d->document_url = $d->document_url;
                return $d;
            });
    }

    public function store(Request $request)
    {
        $request->validate([
            'zil_id'         => 'required|exists:zils,id',
            'dag_no'         => 'required|string',
            'survey_type_id' => 'nullable|exists:survey_types,id',
            'document'       => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:8192',
            'khotiyan'       => 'nullable',
            'meta'           => 'nullable',
        ]);

        $khotiyan = $this->normalizeToArray($request->input('khotiyan'), []);
        $meta     = $this->normalizeToAssoc($request->input('meta'), []);

        $docPath = null;
        if ($request->hasFile('document')) {
            $docPath = $request->file('document')->store('dags', 'public');
        }

        $dag = Dag::create([
            'zil_id'         => $request->zil_id,
            'dag_no'         => $request->dag_no,
            'survey_type_id' => $request->survey_type_id,
            'khotiyan'       => $khotiyan,
            'meta'           => $meta,
            'document'       => $docPath,
        ]);

        $dag->load('zil:id,zil_no', 'surveyType:id,code,name_en');
        $dag->document_url = $dag->document_url;

        return response()->json($dag, 201);
    }

    public function show(Dag $dag)
    {
        $dag->load('zil:id,zil_no', 'surveyType:id,code,name_en');
        $dag->document_url = $dag->document_url;
        return $dag;
    }

    public function update(Request $request, Dag $dag)
    {
        $request->validate([
            'zil_id'         => 'sometimes|exists:zils,id',
            'dag_no'         => 'sometimes|required|string',
            'survey_type_id' => 'nullable|exists:survey_types,id',
            'document'       => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:8192',
            'remove_document'=> 'nullable|boolean', // allow removing without new upload
            'khotiyan'       => 'nullable',
            'meta'           => 'nullable',
        ]);

        $data = [];

        if ($request->filled('zil_id')) $data['zil_id'] = $request->zil_id;
        if ($request->filled('dag_no')) $data['dag_no'] = $request->dag_no;
        if ($request->has('survey_type_id')) $data['survey_type_id'] = $request->survey_type_id;

        if ($request->has('khotiyan')) {
            $kh = $this->normalizeToArray($request->input('khotiyan'), null);
            if (!is_null($kh)) {
                $this->assertKhotiyanShape($kh);
                $data['khotiyan'] = $kh;
            }
        }

        if ($request->has('meta')) {
            $mt = $this->normalizeToAssoc($request->input('meta'), null);
            if (!is_null($mt)) {
                $data['meta'] = $mt;
            }
        }

        // --- document replace / remove logic ---
        // Case 1: explicit remove without new upload
        if ($request->boolean('remove_document') && $dag->document) {
            Storage::disk('public')->delete($dag->document);
            $data['document'] = null;
        }

        // Case 2: new document uploaded -> delete old then save new
        if ($request->hasFile('document')) {
            if ($dag->document) {
                Storage::disk('public')->delete($dag->document);
            }
            $data['document'] = $request->file('document')->store('dags', 'public');
        }

        $dag->update($data);

        $dag->load('zil:id,zil_no', 'surveyType:id,code,name_en');
        $dag->document_url = $dag->document_url;

        return $dag;
    }

    public function destroy(Dag $dag)
    {
        // delete file if exists
        if ($dag->document) {
            Storage::disk('public')->delete($dag->document);
        }
        $dag->delete();
        return response()->json(['deleted' => true]);
    }

    // ---------- helpers (same as earlier lenient versions) ----------

    private function normalizeToArray($value, $fallback = [])
    {
        if ($value === null || $value === '') return $fallback;
        if (is_array($value)) return $value;
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) return $decoded;
            if (strtolower($value) === 'null') return $fallback;
        }
        return $fallback;
    }

    private function normalizeToAssoc($value, $fallback = [])
    {
        if ($value === null || $value === '') return $fallback;
        if (is_array($value)) return $value;
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) return $decoded;
            if (strtolower($value) === 'null') return $fallback;
        }
        return $fallback;
    }

    private function assertKhotiyanShape($khotiyan)
    {
        if (!is_array($khotiyan)) return;
        foreach ($khotiyan as $row) {
            if (!is_array($row)) continue;
            if (!array_key_exists('owner', $row)) $row['owner'] = null;
            if (!array_key_exists('area',  $row)) $row['area']  = null;
        }
    }
}
