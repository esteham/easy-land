<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mutation;
use App\Models\Application;
use App\Models\Notification;
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
            'application_id' => $request->application_id ?: null,
            'mutation_type' => $request->mutation_type,
            'reason' => $request->reason,
            'documents' => $request->documents ?? [],
            'fee_amount' => $request->fee_amount,
            'status' => 'pending',
            'mouza_name' => $request->mouza_name,
            'khatian_number' => $request->khatian_number,
            'dag_number' => $request->dag_number,
            'buyer_name' => $request->buyer_name,
            'buyer_nid' => $request->buyer_nid,
            'buyer_address' => $request->buyer_address,
            'previous_owner_name' => $request->previous_owner_name,
            'previous_owner_nid' => $request->previous_owner_nid,
            'previous_owner_address' => $request->previous_owner_address,
            'deed_number' => $request->deed_number,
            'deed_date' => $request->deed_date,
            'registry_office' => $request->registry_office,
            'land_type' => $request->land_type,
            'land_area' => $request->land_area,
            'contact_number' => $request->contact_number,
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

        $oldStatus = $mutation->status;
        $newStatus = $request->status;

        $mutation->update([
            'status' => $newStatus,
            'remarks' => $request->remarks,
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
        ]);

        // Create notification if status changed
        if ($oldStatus !== $newStatus) {
            $type = 'mutation_' . $newStatus;
            $title = 'Mutation ' . ucfirst($newStatus);
            $message = "Your mutation application for {$mutation->mutation_type} has been {$newStatus}.";

            if ($newStatus === 'rejected' && $request->remarks) {
                $message .= " Remarks: {$request->remarks}";
            }

            Notification::create([
                'user_id' => $mutation->user_id,
                'type' => $type,
                'title' => $title,
                'message' => $message,
                'data' => [
                    'mutation_id' => $mutation->id,
                    'mutation_type' => $mutation->mutation_type,
                    'status' => $newStatus,
                    'remarks' => $request->remarks,
                ],
            ]);

            // Send email notification
            $notificationClass = '\\App\\Notifications\\Mutation' . ucfirst($newStatus);
            $mutation->user->notify(new $notificationClass($mutation));
        }

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
        $mutation = Mutation::where('id', $id)->where('user_id', $user->id)->firstOrFail();

        // Update mutation with payment fields
        $mutation->update([
            'payment_status' => 'paid',
            'payment_method' => $request->payment_method,
            'payer_identifier' => hash('sha256', $request->payer_identifier),
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
