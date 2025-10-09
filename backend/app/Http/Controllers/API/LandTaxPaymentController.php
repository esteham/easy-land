<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\LandTaxPayment;
use App\Models\LandTaxRegistration;
use App\Models\Kyc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

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

            // Calculate rate based on land_type (Upazila level)
            $area = $registration->land_area; // sq ft
            $landType = $registration->land_type;
            $rates = [
                'Residential' => 100, // BDT per 100 sq ft
                'Commercial' => 200,
                'Agricultural' => 80,
                'Others' => 100,
            ];
            $rate = $rates[$landType] ?? 100; // per 100 sq ft
            $amount = ($area / 100) * $rate;
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
            'payment_method' => 'required|string',
            'payer_identifier' => 'required|string',
            'transaction_id' => 'nullable|string',
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
            $area = $registration->land_area; // sq ft
            $landType = $registration->land_type;
            $rates = [
                'Residential' => 100, // BDT per 100 sq ft
                'Commercial' => 200,
                'Agricultural' => 80,
                'Others' => 100,
            ];
            $rate = $rates[$landType] ?? 100; // per 100 sq ft
            $amount = ($area / 100) * $rate;

            $payment = LandTaxPayment::create([
                'user_id' => $user->id,
                'land_tax_registration_id' => $regId,
                'year' => $currentYear,
                'amount' => $amount,
                'status' => 'paid', // assume paid for now
                'paid_at' => now(),
                'payment_method' => $request->payment_method,
                'payer_identifier' => $request->payer_identifier,
                'transaction_id' => $request->transaction_id,
            ]);

            $payments[] = $payment;
        }

        return response()->json([
            'message' => 'LDT payment processed successfully.',
            'payments' => $payments,
        ]);
    }

    public function invoice($id)
    {
        try {
            $user = Auth::user();
            $payment = LandTaxPayment::with('landTaxRegistration')->where('id', $id)->where('user_id', $user->id)->firstOrFail();

            // Generate PDF invoice content
            $data = [
                'payment' => $payment,
                'user' => $user,
            ];

            $pdf = PDF::loadView('invoices.land_tax_payment', $data);

            $filename = 'invoice_ldt_payment_' . $payment->id . '.pdf';

            return $pdf->download($filename);
        } catch (\Exception $e) {
        
            return response()->json(['error' => 'Failed to generate invoice.'], 500);
        }
    }
}
