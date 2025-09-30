<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('/me', fn(\Illuminate\Http\Request $r) => $r->user());

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/stats', fn() => response()->json(['ok' => 'admin only']));
    });

    Route::middleware('role:manager')->group(function () {
        Route::get('/manager/overview', fn() => response()->json(['ok' => 'manager only']));
    });

    Route::middleware('role:user')->group(function () {
        Route::get('/user/dashboard', fn() => response()->json(['ok' => 'user only']));
    });
});

