<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\LandTaxPayment;
use App\Models\LandTaxRegistration;
use App\Models\Kyc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class LandTaxPaymentController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $payments = LandTaxPayment::where('user_id', $user->id)->with('landTaxRegistration')->get();

        return response()->json($payments);
    }

    public function calculate(Request $request)
    {
        $request->validate([
            'registration_ids' => 'required|array',
            'registration_ids.*' => 'exists:land_tax_registrations,id',
        ]);

        $user = Auth::user();
        $currentYear = Carbon::now()->year;

        // Check KYC
        $kyc = Kyc::where('user_id', $user->id)->first();
        if (!$kyc || $kyc->status !== 'success') {
            return response()->json(['error' => 'KYC not updated.'], 400);
        }

        $totalAmount = 0;
        $calculations = [];

        foreach ($request->registration_ids as $regId) {
            $registration = LandTaxRegistration::where('user_id', $user->id)->where('id', $regId)->first();
            if (!$registration) {
                return response()->json(['error' => 'Registration not found.'], 404);
            }

            // Check if already paid for current year
            $existingPayment = LandTaxPayment::where('land_tax_registration_id', $regId)
                ->where('year', $currentYear)
                ->where('status', 'paid')
                ->first();
            if ($existingPayment) {
                return response()->json(['error' => 'LDT already paid for this land for the current year.'], 400);
            }

            // For simplicity, assume area and type
            $area = $registration->land_area; // sq ft
            $landType = $registration->land_type;
            $rate = 15; // BDT per sq ft
            $amount = $area * $rate;
            $totalAmount += $amount;

            $calculations[] = [
                'registration_id' => $regId,
                'state' => $registration->mouza->name_en,
                'khatiyan_number' => $registration->khatiyan_number,
                'dag_number' => $registration->dag_number,
                'area' => $area,
                'type' => $landType,
                'rate' => $rate,
                'amount' => $amount,
            ];
        }

        return response()->json([
            'calculations' => $calculations,
            'total_amount' => $totalAmount,
        ]);
    }

    public function pay(Request $request)
    {
        $request->validate([
            'registration_ids' => 'required|array',
            'registration_ids.*' => 'exists:land_tax_registrations,id',
        ]);

        $user = Auth::user();
        $currentYear = Carbon::now()->year;

        // Check KYC
        $kyc = Kyc::where('user_id', $user->id)->first();
        if (!$kyc || $kyc->status !== 'success') {
            return response()->json(['error' => 'KYC not updated.'], 400);
        }

        $payments = [];

        foreach ($request->registration_ids as $regId) {
            $registration = LandTaxRegistration::where('user_id', $user->id)->where('id', $regId)->first();
            if (!$registration) {
                return response()->json(['error' => 'Registration not found.'], 404);
            }

            // Check if already paid
            $existingPayment = LandTaxPayment::where('land_tax_registration_id', $regId)
                ->where('year', $currentYear)
                ->where('status', 'paid')
                ->first();
            if ($existingPayment) {
                return response()->json(['error' => 'LDT already paid for this land for the current year.'], 400);
            }

            // Calculate amount (same as calculate)
            $amount = 15000; // 1000 * 15

            $payment = LandTaxPayment::create([
                'user_id' => $user->id,
                'land_tax_registration_id' => $regId,
                'year' => $currentYear,
                'amount' => $amount,
                'status' => 'paid', // assume paid for now
                'paid_at' => now(),
            ]);

            $payments[] = $payment;
        }

        return response()->json([
            'message' => 'LDT payment processed successfully.',
            'payments' => $payments,
        ]);
    }
}
