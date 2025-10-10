<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mutation;
use App\Models\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use PDF; // Assuming dompdf is installed
use App\Http\Requests\MutationStoreRequest;
use App\Http\Requests\MutationStatusRequest;

class MutationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user->role === 'admin' || $user->role === 'acland') {
            // Admin: filterable list
            $query = Mutation::with('user', 'application', 'reviewer');

            if ($request->has('status') && $request->status) {
                $query->where('status', $request->status);
            }

            if ($request->has('q') && $request->q) {
                $query->where(function ($q) use ($request) {
                    $q->where('mutation_type', 'like', '%' . $request->q . '%')
                      ->orWhere('reason', 'like', '%' . $request->q . '%')
                      ->orWhereHas('user', fn($u) => $u->where('name', 'like', '%' . $request->q . '%'));
                });
            }

            if ($request->has('from') && $request->from) {
                $query->whereDate('created_at', '>=', $request->from);
            }

            if ($request->has('to') && $request->to) {
                $query->whereDate('created_at', '<=', $request->to);
            }

            $mutations = $query->paginate(10);
        } else {
            // User: own mutations
            $mutations = Mutation::with('application', 'reviewer')
                ->where('user_id', $user->id)
                ->paginate(10);
        }

        return response()->json($mutations);
    }

    public function store(MutationStoreRequest $request)
    {
        $user = Auth::user();

        $mutation = Mutation::create([
            'user_id' => $user->id,
            'application_id' => $request->application_id,
            'mutation_type' => $request->mutation_type,
            'reason' => $request->reason,
            'documents' => $request->documents ?? [],
            'fee_amount' => $request->fee_amount,
            'status' => 'pending',
        ]);

        return response()->json(['message' => 'Mutation submitted successfully', 'mutation' => $mutation], 201);
    }

    public function show($id)
    {
        $user = Auth::user();
        $mutation = Mutation::with('user', 'application', 'reviewer');

        if ($user->role !== 'admin' && $user->role !== 'acland') {
            $mutation->where('user_id', $user->id);
        }

        $mutation = $mutation->findOrFail($id);

        return response()->json($mutation);
    }

    public function update(MutationStatusRequest $request, $id)
    {
        $user = Auth::user();
        $mutation = Mutation::findOrFail($id);

        $mutation->update([
            'status' => $request->status,
            'remarks' => $request->remarks,
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
        ]);

        return response()->json(['message' => 'Status updated successfully', 'mutation' => $mutation]);
    }

    public function updateStatus(MutationStatusRequest $request, $id)
    {
        return $this->update($request, $id);
    }

    public function uploadDocuments(Request $request, $id)
    {
        $user = Auth::user();
        $mutation = Mutation::where('id', $id);

        if ($user->role !== 'admin' && $user->role !== 'acland') {
            $mutation->where('user_id', $user->id);
        }

        $mutation = $mutation->firstOrFail();

        $request->validate([
            'documents' => 'required|array',
            'documents.*' => 'file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $uploaded = [];
        $path = "mutations/{$id}";

        foreach ($request->file('documents') as $file) {
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs($path, $filename, 'public');
            $uploaded[] = ['name' => $file->getClientOriginalName(), 'path' => $path . '/' . $filename];
        }

        $currentDocs = $mutation->documents ?? [];
        $mutation->update(['documents' => array_merge($currentDocs, $uploaded)]);

        return response()->json(['message' => 'Documents uploaded', 'documents' => $mutation->documents]);
    }

    public function pay(Request $request, $id)
    {
        $request->validate([
            'payment_method' => 'required|in:bkash,nagad,card,bank',
            'payer_identifier' => 'required|string',
            'transaction_id' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
        ]);

        $user = Auth::user();
        $mutation = Mutation::where('id', $id)->where('user_id', $user->id)->where('status', 'approved')->firstOrFail();

        // For demo, just update mutation with payment fields (reuse Application pattern)
        $mutation->update([
            'payment_status' => 'paid', // Add to migration if needed, but for now use existing or add
            'payment_method' => $request->payment_method,
            'payer_identifier' => $request->payer_identifier,
            'transaction_id' => $request->transaction_id ?: 'DEMO-' . time(),
            'paid_at' => now(),
        ]);

        return response()->json(['message' => 'Payment processed', 'receipt' => $mutation], 201);
    }

    public function invoice($id)
    {
        $user = Auth::user();
        $mutation = Mutation::with('application')->where('id', $id)->where('user_id', $user->id)->firstOrFail();

        $data = ['mutation' => $mutation, 'user' => $user];
        $pdf = PDF::loadView('invoices.mutation', $data); // Create view later if needed

        $filename = 'invoice_mutation_' . $mutation->id . '.pdf';
        return $pdf->download($filename);
    }
}
