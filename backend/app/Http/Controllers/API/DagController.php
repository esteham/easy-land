<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Dag;
use Illuminate\Http\Request;

class DagController extends Controller
{
    public function index()
    {
        return Dag::with('zil:id,zil_no')
            ->orderBy('dag_no')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'zil_id' => 'required|exists:zils,id',
            'dag_no' => 'required|string',
            'khotiyan' => 'nullable|array',
            'meta' => 'nullable|array',
        ]);
        $dag = Dag::create($data);
        return response()->json($dag, 201);
    }

    public function show(Dag $dag)
    {
        return $dag->load('zil:id,zil_no');
    }

    public function update(Request $request, Dag $dag)
    {
        $data = $request->validate([
            'zil_id' => 'sometimes|exists:zils,id',
            'dag_no' => 'sometimes|required|string',
            'khotiyan' => 'nullable|array',
            'meta' => 'nullable|array',
        ]);
        $dag->update($data);
        return $dag;
    }

    public function destroy(Dag $dag)
    {
        $dag->delete();
        return response()->json(['deleted' => true]);
    }
}
