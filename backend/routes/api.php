<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', fn() => response()->json(['stats' => ['users' => 100, 'posts' => 50]]));

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/stats', fn() => response()->json(['ok' => 'admin only']));
    });

    Route::middleware('role:acland')->group(function () {
        Route::get('/acland/overview', fn() => response()->json(['ok' => 'acland only']));
    });

    Route::middleware('role:user')->group(function () {
        Route::get('/user/dashboard', fn() => response()->json(['ok' => 'user only']));
    });
});

