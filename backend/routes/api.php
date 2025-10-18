<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PasswordController;

use App\Models\Division;
use App\Models\District;
use App\Models\Upazila;
use App\Models\Mouza;
use App\Models\Zil;
use App\Models\Dag;
use App\Models\SurveyType;
use App\Models\MouzaMap;

//Revenue API
use App\Models\Application;
use App\Models\LandTaxPayment;
use App\Models\Mutation;

use App\Http\Controllers\API\DivisionController;
use App\Http\Controllers\API\DistrictController;
use App\Http\Controllers\API\UpazilaController;
use App\Http\Controllers\API\MouzaController;
use App\Http\Controllers\API\ZilController;
use App\Http\Controllers\API\DagController;
use App\Http\Controllers\API\SurveyTypeController;
use App\Http\Controllers\API\GeojsonDataController;

use \App\Http\Controllers\API\ApplicationController;
use \App\Http\Controllers\API\LandTaxRegistrationController;
use \App\Http\Controllers\API\MutationController;
use \App\Http\Controllers\API\MouzaMapController;
use \App\Http\Controllers\API\NotificationController;

use App\Http\Controllers\API\LandTaxPaymentController;
use App\Http\Controllers\KycController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/check-email', [AuthController::class, 'checkEmail']);

// Email verification
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware(['signed'])
    ->name('verification.verify');
Route::post('/email/verification-notification', [AuthController::class, 'resendVerification'])
    ->middleware(['throttle:6,1'])
    ->name('verification.send');

// Forgot/Reset (no auth)
Route::post('/password/forgot', [PasswordController::class, 'sendResetLink'])
    ->middleware('throttle:6,1');
Route::post('/password/reset',  [PasswordController::class, 'resetPassword'])
    ->middleware('throttle:6,1');

// Public cascading location endpoints
Route::get('/locations/divisions', function () {
    return Division::select('id','name_en','name_bn','bbs_code')->orderBy('name_en')->get();
});

Route::get('/locations/districts', function () {
    return District::select('id','name_en','name_bn','bbs_code')->orderBy('name_en')->get();
});

Route::get('/locations/divisions/{division}/districts', function (Division $division) {
    return $division->districts()->select('id','division_id','name_en','name_bn','bbs_code')->orderBy('name_en')->get();
});

Route::get('/locations/districts/{district}/upazilas', function (District $district) {
    return $district->upazilas()->select('id','district_id','name_en','name_bn','bbs_code')->orderBy('name_en')->get();
});

Route::get('/locations/upazilas/{upazila}/mouzas', function (Upazila $upazila) {
    return $upazila->mouzas()->select('id','upazila_id','name_en','name_bn','jl_no','mouza_code')->orderBy('name_en')->get();
});

// New: zils, dags, and mouza maps
Route::get('/locations/mouzas/{mouza}/zils', function (Mouza $mouza) {
    return $mouza->zils()->select('id','mouza_id','zil_no','map_url')->orderBy('zil_no')->get();
});

Route::get('/locations/zils/{zil}/dags', function (Zil $zil, Request $request) {
    $query = $zil->dags()->select('id','zil_id','dag_no','survey_type_id');
    if ($request->filled('survey_type_id')) {
        $query->where('survey_type_id', $request->input('survey_type_id'));
    }
    return $query->orderBy('dag_no')->get();
});

Route::get('/locations/dags/{dag}', function (Dag $dag) {
    return $dag->only(['id','zil_id','dag_no','khotiyan','meta']);
});

Route::get('/locations/zils/{zil}/mouza-maps', function (Zil $zil, Request $request) {
    $query = $zil->mouzaMaps()->select('id','zil_id','name','survey_type_id');
    if ($request->filled('survey_type_id')) {
        $query->where('survey_type_id', $request->input('survey_type_id'));
    }
    return $query->orderBy('name')->get();
});

Route::get('/locations/mouza-maps/{mouzaMap}', function (MouzaMap $mouzaMap) {
    return $mouzaMap->only(['id','zil_id','name']);
});

Route::get('/locations/zils/{zil}/survey-types', function (Zil $zil, Request $request) {
    $type = $request->query('type');
    if ($type === 'khatiyan') {
        $distinctIds = $zil->dags()->whereNotNull('survey_type_id')->distinct('survey_type_id')->pluck('survey_type_id');
        return SurveyType::whereIn('id', $distinctIds)->select('id','code','name_en','name_bn')->orderBy('name_en')->get();
    } elseif ($type === 'mouza_map') {
        $distinctIds = $zil->mouzaMaps()->whereNotNull('survey_type_id')->distinct('survey_type_id')->pluck('survey_type_id');
        return SurveyType::whereIn('id', $distinctIds)->select('id','code','name_en','name_bn')->orderBy('name_en')->get();
    }
    return response()->json([], 200);
});

Route::get('/locations/survey-types', function () {
    return SurveyType::select('id','code','name_en','name_bn')->orderBy('name_en')->get();
});

Route::get('/dag/{dag}/download', function (Dag $dag) {
    if (!$dag->document) {
        return response()->json(['error' => 'Document not found'], 404);
    }
    $path = storage_path('app/public/' . $dag->document);
    if (!file_exists($path)) {
        return response()->json(['error' => 'File not found'], 404);
    }
    return response()->file($path);
})->name('dag.download');

Route::get('/mouza-map/{mouzaMap}/download', function (MouzaMap $mouzaMap) {
    if (!$mouzaMap->document) {
        return response()->json(['error' => 'Document not found'], 404);
    }
    $path = storage_path('app/public/' . $mouzaMap->document);
    if (!file_exists($path)) {
        return response()->json(['error' => 'File not found'], 404);
    }
    return response()->file($path);
})->name('mouza-map.download');

// Public: fetch latest geojson by dag_no
Route::get('/map/geojson/by-dag/{dag_no}', [GeojsonDataController::class, 'byDagNo']);

// Search endpoint
Route::get('/search', function (Request $request) {
    $q = $request->query('q');
    if (!$q) return response()->json(['results' => []]);

    $results = [];

    $models = [
        ['model' => Division::class, 'fields' => ['name_en', 'name_bn'], 'type' => 'division', 'route' => 'divisions'],
        ['model' => District::class, 'fields' => ['name_en', 'name_bn'], 'type' => 'district', 'route' => 'districts'],
        ['model' => Upazila::class, 'fields' => ['name_en', 'name_bn'], 'type' => 'upazila', 'route' => 'upazilas'],
        ['model' => Mouza::class, 'fields' => ['name_en', 'name_bn'], 'type' => 'mouza', 'route' => 'mouzas'],
        ['model' => Zil::class, 'fields' => ['zil_no'], 'type' => 'zil', 'route' => 'zils'],
        ['model' => Dag::class, 'fields' => ['dag_no'], 'type' => 'dag', 'route' => 'dags'],
        ['model' => SurveyType::class, 'fields' => ['name_en', 'name_bn', 'code'], 'type' => 'survey_type', 'route' => 'survey-types'],
    ];

    foreach ($models as $m) {
        $query = $m['model']::query();
        foreach ($m['fields'] as $field) {
            $query->orWhere($field, 'like', "%$q%");
        }
        $items = $query->limit(10)->get();
        foreach ($items as $item) {
            $name = $item->name_en ?? $item->name_bn ?? $item->zil_no ?? $item->dag_no ?? $item->code;
            $results[] = [
                'type' => $m['type'],
                'id' => $item->id,
                'name' => $name,
                'to' => $m['route']
            ];
        }
    }

    return response()->json(['results' => $results]);
});

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/me/change-password', [AuthController::class, 'changePassword']);
    Route::get('/dashboard', function () {
        $now = now();
        $startOfDay = $now->copy()->startOfDay();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfYear = $now->copy()->startOfYear();

        // Revenue from Applications
        $dailyRevenueApplications = Application::where('payment_status', 'paid')
            ->where('submitted_at', '>=', $startOfDay)
            ->sum('fee_amount');

        $monthlyRevenueApplications = Application::where('payment_status', 'paid')
            ->where('submitted_at', '>=', $startOfMonth)
            ->sum('fee_amount');

        $yearlyRevenueApplications = Application::where('payment_status', 'paid')
            ->where('submitted_at', '>=', $startOfYear)
            ->sum('fee_amount');

        // Revenue from Land Tax Payments
        $dailyRevenueLDT = LandTaxPayment::where('status', 'paid')
            ->where('paid_at', '>=', $startOfDay)
            ->sum('amount');

        $monthlyRevenueLDT = LandTaxPayment::where('status', 'paid')
            ->where('paid_at', '>=', $startOfMonth)
            ->sum('amount');

        $yearlyRevenueLDT = LandTaxPayment::where('status', 'paid')
            ->where('paid_at', '>=', $startOfYear)
            ->sum('amount');

        // Revenue from Mutations
        $dailyRevenueMutations = Mutation::where('payment_status', 'paid')
            ->where('submitted_at', '>=', $startOfDay)
            ->sum('fee_amount');

        $monthlyRevenueMutations = Mutation::where('payment_status', 'paid')
            ->where('submitted_at', '>=', $startOfMonth)
            ->sum('fee_amount');

        $yearlyRevenueMutations = Mutation::where('payment_status', 'paid')
            ->where('submitted_at', '>=', $startOfYear)
            ->sum('fee_amount');

        // Total revenue
        $dailyRevenue = $dailyRevenueApplications + $dailyRevenueLDT + $dailyRevenueMutations;
        $monthlyRevenue = $monthlyRevenueApplications + $monthlyRevenueLDT + $monthlyRevenueMutations;
        $yearlyRevenue = $yearlyRevenueApplications + $yearlyRevenueLDT + $yearlyRevenueMutations;

        return response()->json([
            'stats' => [
                'divisions' => Division::count(),
                'districts' => District::count(),
                'upazilas' => Upazila::count(),
                'mouzas' => Mouza::count(),
                'zils' => Zil::count(),
                'dags' => Dag::count(),
            ],
            'revenue' => [
                'daily' => $dailyRevenue,
                'monthly' => $monthlyRevenue,
                'yearly' => $yearlyRevenue,
            ]
        ]);
    });

    Route::get('/revenue-details', function () {
        $now = now();
        $startOfDay = $now->copy()->startOfDay();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfYear = $now->copy()->startOfYear();

        // Applications revenue breakdown
        $dailyApplications = Application::where('payment_status', 'paid')
            ->where('submitted_at', '>=', $startOfDay)
            ->sum('fee_amount');

        $monthlyApplications = Application::where('payment_status', 'paid')
            ->where('submitted_at', '>=', $startOfMonth)
            ->sum('fee_amount');

        $yearlyApplications = Application::where('payment_status', 'paid')
            ->where('submitted_at', '>=', $startOfYear)
            ->sum('fee_amount');

        $recentApplications = Application::where('payment_status', 'paid')
            ->orderBy('submitted_at', 'desc')
            ->limit(10)
            ->get(['id', 'fee_amount', 'submitted_at']);

        // Land Tax Payments revenue breakdown
        $dailyLDT = LandTaxPayment::where('status', 'paid')
            ->where('paid_at', '>=', $startOfDay)
            ->sum('amount');

        $monthlyLDT = LandTaxPayment::where('status', 'paid')
            ->where('paid_at', '>=', $startOfMonth)
            ->sum('amount');

        $yearlyLDT = LandTaxPayment::where('status', 'paid')
            ->where('paid_at', '>=', $startOfYear)
            ->sum('amount');

        $recentLDT = LandTaxPayment::where('status', 'paid')
            ->orderBy('paid_at', 'desc')
            ->limit(10)
            ->get(['id', 'amount', 'paid_at']);

        // Mutations revenue breakdown
        $dailyMutations = Mutation::where('payment_status', 'paid')
            ->where('created_at', '>=', $startOfDay)
            ->sum('fee_amount');

        $monthlyMutations = Mutation::where('payment_status', 'paid')
            ->where('created_at', '>=', $startOfMonth)
            ->sum('fee_amount');

        $yearlyMutations = Mutation::where('payment_status', 'paid')
            ->where('created_at', '>=', $startOfYear)
            ->sum('fee_amount');

        $recentMutations = Mutation::where('payment_status', 'paid')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get(['id', 'fee_amount', 'created_at']);

        return response()->json([
            'applications' => [
                'daily' => $dailyApplications,
                'monthly' => $monthlyApplications,
                'yearly' => $yearlyApplications,
                'recent' => $recentApplications
            ],
            'land_tax_payments' => [
                'daily' => $dailyLDT,
                'monthly' => $monthlyLDT,
                'yearly' => $yearlyLDT,
                'recent' => $recentLDT
            ],
            'mutations' => [
                'daily' => $dailyMutations,
                'monthly' => $monthlyMutations,
                'yearly' => $yearlyMutations,
                'recent' => $recentMutations
            ]
        ]);
    });

    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::get('/applications/{id}/invoice', [ApplicationController::class, 'invoice']);

    // Mutations
    Route::get('/mutations', [MutationController::class, 'index']);
    Route::post('/mutations', [MutationController::class, 'store']);
    Route::get('/mutations/{id}', [MutationController::class, 'show']);
    Route::get('/mutations/{id}/invoice', [MutationController::class, 'invoice']);
    Route::post('/mutations/{id}/documents', [MutationController::class, 'uploadDocuments']);
    Route::post('/mutations/{id}/pay', [MutationController::class, 'pay']);

    // Land Tax Registration
    Route::post('/land-tax-registrations/{id}/match-land-details', [LandTaxRegistrationController::class, 'matchLandDetails']);
    Route::apiResource('land-tax-registrations', LandTaxRegistrationController::class)->only(['index', 'store', 'update']);

    // Land Tax Payments
    Route::get('/land-tax-payments', [LandTaxPaymentController::class, 'index']);
    Route::get('/land-tax-payments/{id}/invoice', [LandTaxPaymentController::class, 'invoice']);
    Route::post('/land-tax-payments/calculate', [LandTaxPaymentController::class, 'calculate']);
    Route::post('/land-tax-payments/pay', [LandTaxPaymentController::class, 'pay']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    Route::middleware('role:admin,acland')->group(function () {
        Route::apiResource('admin/upazilas', UpazilaController::class);
        Route::apiResource('admin/mouzas', MouzaController::class);
        Route::apiResource('admin/zils', ZilController::class);
        Route::apiResource('admin/dags', DagController::class);
        Route::apiResource('admin/mouza-maps', MouzaMapController::class);

        // Mutations admin
        Route::apiResource('admin/mutations', MutationController::class);
        Route::patch('/mutations/{id}/status', [MutationController::class, 'updateStatus']);

        // GeoJSON datas CRUD
        Route::apiResource('admin/geojson-datas', GeojsonDataController::class);
    });

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/stats', fn() => response()->json(['ok' => 'admin only']));
        // Admin CRUD resources
        Route::apiResource('admin/divisions', DivisionController::class);
        Route::apiResource('admin/districts', DistrictController::class);
        Route::apiResource('admin/survey-types', SurveyTypeController::class);

        // KYC admin routes
        Route::get('/admin/kyc/pending', [KycController::class, 'listPendingKyc']);
        Route::post('/admin/kyc/{id}/approve', [KycController::class, 'approveKyc']);
        Route::post('/admin/kyc/{id}/reject', [KycController::class, 'rejectKyc']);

        // Revenue details by date
        Route::get('/admin/revenue/applications/{date}', function ($date) {
            $applications = Application::where('payment_status', 'paid')
                ->whereDate('submitted_at', $date)
                ->with('user:id,name,email')
                ->get(['id', 'user_id', 'fee_amount', 'payment_method', 'submitted_at']);
            return response()->json($applications);
        });

        Route::get('/admin/revenue/land-tax-payments/{date}', function ($date) {
            $payments = LandTaxPayment::where('status', 'paid')
                ->whereDate('paid_at', $date)
                ->with('user:id,name,email')
                ->get(['id', 'user_id', 'amount', 'payment_method', 'paid_at']);
            return response()->json($payments);
        });

        // Revenue details by date
        Route::get('/admin/revenue/applications/{date}', function ($date) {
            $applications = Application::where('payment_status', 'paid')
                ->whereDate('created_at', $date)
                ->with('user:id,name,email')
                ->get(['id', 'user_id', 'fee_amount', 'payment_method', 'created_at']);
            return response()->json($applications);
        });

        Route::get('/admin/revenue/land-tax-payments/{date}', function ($date) {
            $payments = LandTaxPayment::where('status', 'paid')
                ->whereDate('paid_at', $date)
                ->with('user:id,name,email')
                ->get(['id', 'user_id', 'amount', 'payment_method', 'paid_at']);
            return response()->json($payments);
        });

        Route::get('/admin/revenue/mutations/{date}', function ($date) {
            $mutations = Mutation::where('payment_status', 'paid')
                ->whereDate('created_at', $date)
                ->with('user:id,name,email')
                ->get(['id', 'user_id', 'fee_amount', 'payment_method', 'created_at']);
            return response()->json($mutations);
        });

        // CSV export
        Route::get('/admin/revenue/applications/{date}/csv', function ($date) {
            $applications = Application::where('payment_status', 'paid')
                ->whereDate('submitted_at', $date)
                ->with('user:id,name,email')
                ->get(['user_id', 'fee_amount', 'payment_method', 'submitted_at']);

            $csv = "Username,Date Time,Fee,Payment Method\n";
            foreach ($applications as $app) {
                $csv .= $app->user->name . "," . $app->submitted_at->format('Y-m-d H:i:s') . "," . $app->fee_amount . "," . $app->payment_method . "\n";
            }

            return response($csv)->header('Content-Type', 'text/csv')->header('Content-Disposition', 'attachment; filename="applications_revenue_' . $date . '.csv"');
        });

        Route::get('/admin/revenue/land-tax-payments/{date}/csv', function ($date) {
            $payments = LandTaxPayment::where('status', 'paid')
                ->whereDate('paid_at', $date)
                ->with('user:id,name,email')
                ->get(['user_id', 'amount', 'payment_method', 'paid_at']);

            $csv = "Username,Date Time,Fee,Payment Method\n";
            foreach ($payments as $payment) {
                $csv .= $payment->user->name . "," . $payment->paid_at->format('Y-m-d H:i:s') . "," . $payment->amount . "," . $payment->payment_method . "\n";
            }

            return response($csv)->header('Content-Type', 'text/csv')->header('Content-Disposition', 'attachment; filename="land_tax_payments_revenue_' . $date . '.csv"');
        });

        Route::get('/admin/revenue/mutations/{date}/csv', function ($date) {
            $mutations = Mutation::where('payment_status', 'paid')
                ->whereDate('submitted_at', $date)
                ->with('user:id,name,email')
                ->get(['user_id', 'fee_amount', 'payment_method', 'submitted_at']);

            $csv = "Username,Date Time,Fee,Payment Method\n";
            foreach ($mutations as $mutation) {
                $csv .= $mutation->user->name . "," . $mutation->submitted_at->format('Y-m-d H:i:s') . "," . $mutation->fee_amount . "," . $mutation->payment_method . "\n";
            }

            return response($csv)->header('Content-Type', 'text/csv')->header('Content-Disposition', 'attachment; filename="mutations_revenue_' . $date . '.csv"');
        });

    });

    Route::middleware('role:acland')->group(function () {
        Route::get('/acland/overview', fn() => response()->json(['ok' => 'acland only']));
    });

    Route::middleware('role:user')->group(function () {
        Route::get('/user/dashboard', fn() => response()->json(['ok' => 'user only']));

        // KYC upload and get
        Route::post('/user/kyc/upload', [KycController::class, 'upload']);
        Route::get('/user/kyc', [KycController::class, 'getKyc']);

        // Land Tax Registrations for user
        Route::get('/user/land-tax-registrations', [LandTaxRegistrationController::class, 'userIndex']);
    });
});
