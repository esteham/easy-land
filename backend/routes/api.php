<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PasswordController;

use App\Models\Division;
use App\Models\District;
use App\Models\Upazila;
use App\Models\Mouza;
use App\Models\Zil;
use App\Models\Dag;
use App\Models\SurveyType;
use App\Http\Controllers\API\DivisionController;
use App\Http\Controllers\API\DistrictController;
use App\Http\Controllers\API\UpazilaController;
use App\Http\Controllers\API\MouzaController;
use App\Http\Controllers\API\ZilController;
use App\Http\Controllers\API\DagController;
use App\Http\Controllers\API\SurveyTypeController;

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

Route::get('/locations/divisions/{division}/districts', function (Division $division) {
    return $division->districts()->select('id','division_id','name_en','name_bn','bbs_code')->orderBy('name_en')->get();
});

Route::get('/locations/districts/{district}/upazilas', function (District $district) {
    return $district->upazilas()->select('id','district_id','name_en','name_bn','bbs_code')->orderBy('name_en')->get();
});

Route::get('/locations/upazilas/{upazila}/mouzas', function (Upazila $upazila) {
    return $upazila->mouzas()->select('id','upazila_id','name_en','name_bn','jl_no','mouza_code')->orderBy('name_en')->get();
});

// New: zils and dags
Route::get('/locations/mouzas/{mouza}/zils', function (Mouza $mouza) {
    return $mouza->zils()->select('id','mouza_id','zil_no','map_url')->orderBy('zil_no')->get();
});

Route::get('/locations/zils/{zil}/dags', function (Zil $zil) {
    return $zil->dags()->select('id','zil_id','dag_no')->orderBy('dag_no')->get();
});

Route::get('/locations/dags/{dag}', function (Dag $dag) {
    return $dag->only(['id','zil_id','dag_no','khotiyan','meta']);
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

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/me/change-password', [AuthController::class, 'changePassword']);
    Route::get('/dashboard', function () {
        return response()->json([
            'stats' => [
                'divisions' => Division::count(),
                'districts' => District::count(),
                'upazilas' => Upazila::count(),
                'mouzas' => Mouza::count(),
                'zils' => Zil::count(),
                'dags' => Dag::count(),
            ]
        ]);
    });

    Route::get('/applications', [\App\Http\Controllers\API\ApplicationController::class, 'index']);
    Route::post('/applications', [\App\Http\Controllers\API\ApplicationController::class, 'store']);
    Route::get('/applications/{id}/invoice', [\App\Http\Controllers\API\ApplicationController::class, 'invoice']);

    Route::middleware('role:admin,acland')->group(function () {
        Route::apiResource('admin/upazilas', UpazilaController::class);
        Route::apiResource('admin/mouzas', MouzaController::class);
        Route::apiResource('admin/zils', ZilController::class);
        Route::apiResource('admin/dags', DagController::class);
    });

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/stats', fn() => response()->json(['ok' => 'admin only']));
        // Admin CRUD resources
        Route::apiResource('admin/divisions', DivisionController::class);
        Route::apiResource('admin/districts', DistrictController::class);
        Route::apiResource('admin/survey-types', SurveyTypeController::class);

        // KYC admin routes
        Route::get('/admin/kyc/pending', [\App\Http\Controllers\KycController::class, 'listPendingKyc']);
        Route::post('/admin/kyc/{id}/approve', [\App\Http\Controllers\KycController::class, 'approveKyc']);
        Route::post('/admin/kyc/{id}/reject', [\App\Http\Controllers\KycController::class, 'rejectKyc']);

    });

    Route::middleware('role:acland')->group(function () {
        Route::get('/acland/overview', fn() => response()->json(['ok' => 'acland only']));
    });

    Route::middleware('role:user')->group(function () {
        Route::get('/user/dashboard', fn() => response()->json(['ok' => 'user only']));

        // KYC upload and get
        Route::post('/user/kyc/upload', [\App\Http\Controllers\KycController::class, 'upload']);
        Route::get('/user/kyc', [\App\Http\Controllers\KycController::class, 'getKyc']);
    });
});
