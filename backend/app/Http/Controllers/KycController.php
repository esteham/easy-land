<?php

namespace App\Http\Controllers;

use App\Models\Kyc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class KycController extends Controller
{
    public function upload(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'id_front' => 'required|image|max:2048', // max 2MB
            'id_back' => 'required|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $kyc = $user->kyc ?? new Kyc(['user_id' => $user->id]);

        if ($request->hasFile('id_front')) {
            if ($kyc->id_front) {
                Storage::delete($kyc->id_front);
            }
            $pathFront = $request->file('id_front')->store('kyc');
            $kyc->id_front = $pathFront;
        }

        if ($request->hasFile('id_back')) {
            if ($kyc->id_back) {
                Storage::delete($kyc->id_back);
            }
            $pathBack = $request->file('id_back')->store('kyc');
            $kyc->id_back = $pathBack;
        }

        $kyc->status = 'pending';
        $kyc->submitted_at = now();
        $kyc->save();

        return response()->json(['message' => 'KYC documents uploaded successfully', 'kyc' => $kyc]);
    }

    public function getKyc()
    {
        $user = Auth::user();
        $kyc = $user->kyc;

        if (!$kyc) {
            return response()->json(['message' => 'No KYC data found'], 404);
        }

        return response()->json(['kyc' => $kyc]);
    }

    public function listPendingKyc()
    {
        $pendingKycs = Kyc::with('user')->where('status', 'pending')->get();

        return response()->json(['kycs' => $pendingKycs]);
    }

    public function approveKyc(Request $request, $id)
    {
        $kyc = Kyc::findOrFail($id);

        if ($kyc->status !== 'pending') {
            return response()->json(['message' => 'KYC is not pending'], 400);
        }

        $kyc->status = 'success';
        $kyc->approved_at = now();
        $kyc->save();

        return response()->json(['message' => 'KYC approved successfully', 'kyc' => $kyc]);
    }

    public function rejectKyc(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'rejection_reason' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $kyc = Kyc::findOrFail($id);

        if ($kyc->status !== 'pending') {
            return response()->json(['message' => 'KYC is not pending'], 400);
        }

        $kyc->status = 'rejected';
        $kyc->rejection_reason = $request->rejection_reason;
        $kyc->save();

        return response()->json(['message' => 'KYC rejected', 'kyc' => $kyc]);
    }
}
