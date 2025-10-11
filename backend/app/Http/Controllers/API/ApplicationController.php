<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $applications = Application::with('dag')->where('user_id', $user->id)->get();

        return response()->json($applications);
    }

    public function store(Request $request)
    {
        $request->validate([
            'dag_id' => 'required|exists:dags,id',
            'type' => 'required|string',
            'description' => 'nullable|string',
            'fee_amount' => 'required|numeric|min:0',
            'payment_status' => 'required|in:paid',
            'payment_method' => 'nullable|string',
            'payer_identifier' => 'nullable|string',
            'transaction_id' => 'nullable|string',
        ]);

        $user = Auth::user();

        $application = Application::create([
            'user_id' => $user->id,
            'dag_id' => $request->dag_id,
            'type' => $request->type,
            'description' => $request->description,
            'status' => 'pending',
            'submitted_at' => now(),
            'fee_amount' => $request->fee_amount,
            'payment_status' => $request->payment_status,
            'payment_method' => $request->payment_method,
            'payer_identifier' => $request->payer_identifier,
            'transaction_id' => $request->transaction_id,
        ]);

        return response()->json(['message' => 'Application submitted successfully', 'application' => $application], 201);
    }

    public function invoice($id)
    {
        $user = Auth::user();
        $application = Application::with('dag')->where('id', $id)->where('user_id', $user->id)->firstOrFail();

        // Generate PDF invoice content (simple example)
        $data = [
            'application' => $application,
            'user' => $user,
        ];

        $pdf = PDF::loadView('invoices.application', $data);

        $filename = 'invoice_application_' . $application->id . '.pdf';

        return $pdf->download($filename);
    }
}
