<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;
use Illuminate\Support\Facades\Auth;

class ApplicationController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'dag_id' => 'required|exists:dags,id',
            'type' => 'required|string',
            'description' => 'nullable|string',
            'fee_amount' => 'required|numeric|min:0',
            'payment_status' => 'required|in:paid',
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
        ]);

        return response()->json(['message' => 'Application submitted successfully', 'application' => $application], 201);
    }
}
