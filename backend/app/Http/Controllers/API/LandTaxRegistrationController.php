<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\LandTaxRegistration;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LandTaxRegistrationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $registrations = LandTaxRegistration::with([
            'user:id,name,email',
            'division:id,name_en,name_bn',
            'district:id,name_en,name_bn',
            'upazila:id,name_en,name_bn',
            'mouza:id,name_en,name_bn',
            'surveyType:id,name_en,name_bn',
            'reviewer:id,name'
        ])->orderBy('submitted_at', 'desc')->get();

        return response()->json($registrations);
    }

    /**
     * Display a listing of the resource for the authenticated user.
     */
    public function userIndex()
    {
        $registrations = LandTaxRegistration::where('user_id', Auth::id())->with([
            'division:id,name_en,name_bn',
            'district:id,name_en,name_bn',
            'upazila:id,name_en,name_bn',
            'mouza:id,name_en,name_bn',
            'surveyType:id,name_en,name_bn'
        ])->orderBy('submitted_at', 'desc')->get();

        return response()->json($registrations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'division_id' => 'required|exists:divisions,id',
            'district_id' => 'required|exists:districts,id',
            'upazila_id' => 'required|exists:upazilas,id',
            'mouza_id' => 'required|exists:mouzas,id',
            'survey_type_id' => 'required|exists:survey_types,id',
            'khatiyan_number' => 'required|string|max:255',
            'dag_number' => 'required|string|max:255',
            'land_type' => 'nullable|string|max:255',
            'land_area' => 'nullable|numeric|min:0',
        ]);

        $registration = LandTaxRegistration::create([
            'user_id' => Auth::id(),
            'division_id' => $request->division_id,
            'district_id' => $request->district_id,
            'upazila_id' => $request->upazila_id,
            'mouza_id' => $request->mouza_id,
            'survey_type_id' => $request->survey_type_id,
            'khatiyan_number' => $request->khatiyan_number,
            'dag_number' => $request->dag_number,
            'land_type' => $request->land_type,
            'land_area' => $request->land_area,
        ]);

        return response()->json([
            'message' => 'Registration completed. The authority will review your registration and approve or reject it within 7 working days. Thank you for registering for Land Tax.',
            'registration' => $registration->load([
                'division:id,name_en,name_bn',
                'district:id,name_en,name_bn',
                'upazila:id,name_en,name_bn',
                'mouza:id,name_en,name_bn',
                'surveyType:id,name_en,name_bn'
            ])
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected,flagged',
            'notes' => 'nullable|string',
        ]);

        $registration = LandTaxRegistration::findOrFail($id);

        $oldStatus = $registration->status;
        $newStatus = $request->status;

        $registration->update([
            'status' => $newStatus,
            'reviewed_at' => now(),
            'reviewer_id' => Auth::id(),
            'notes' => $request->notes,
        ]);

        // Create notification if status changed
        if ($oldStatus !== $newStatus) {
            $type = 'land_tax_' . $newStatus;
            $title = 'Land Tax Registration ' . ucfirst($newStatus);
            $message = "Your land tax registration for Khatiyan {$registration->khatiyan_number}, Dag {$registration->dag_number} has been {$newStatus}.";

            if ($newStatus === 'rejected' && $request->notes) {
                $message .= " Notes: {$request->notes}";
            }

            Notification::create([
                'user_id' => $registration->user_id,
                'type' => $type,
                'title' => $title,
                'message' => $message,
                'data' => [
                    'registration_id' => $registration->id,
                    'khatiyan_number' => $registration->khatiyan_number,
                    'dag_number' => $registration->dag_number,
                    'status' => $newStatus,
                    'notes' => $request->notes,
                ],
            ]);

            // Send email notification
            $notificationClass = '\\App\\Notifications\\LandTax' . ucfirst($newStatus);
            $registration->user->notify(new $notificationClass($registration));
        }

        return response()->json([
            'message' => 'Registration status updated successfully.',
            'registration' => $registration->load([
                'user:id,name,email',
                'division:id,name_en,name_bn',
                'district:id,name_en,name_bn',
                'upazila:id,name_en,name_bn',
                'mouza:id,name_en,name_bn',
                'surveyType:id,name_en,name_bn',
                'reviewer:id,name'
            ])
        ]);
    }
}
