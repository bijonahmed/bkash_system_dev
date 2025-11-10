<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Post\PostCategoryController;
use App\Http\Controllers\Api\Post\PostController;
use App\Http\Controllers\Api\User\UserController;
use App\Http\Controllers\Api\Roles\RolesController;
use App\Http\Controllers\Api\Permissions\PermissionsController;
use App\Http\Controllers\Api\Report\ReportController;
use App\Http\Controllers\Api\Settings\SettingsController;
use App\Http\Controllers\Api\Transaction\TransactionController;
use Illuminate\Support\Facades\Route;

Route::middleware('api')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('api.register');
    Route::post('/login', [AuthController::class, 'login'])->name('api.login');
});
Route::middleware(['auth:api'])->group(function () {
    // User
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/updateProfile', [AuthController::class, 'updateProfile']);
    Route::post('/changePassword', [AuthController::class, 'changePassword']);

    Route::prefix('setting')->group(function () {
        Route::get('/settingrow', [SettingsController::class, 'settingrow']);
        Route::post('/upateSetting', [SettingsController::class, 'upateSetting']);
        Route::post('/updateRate', [SettingsController::class, 'updateRate']);
        Route::get('/getwallet', [SettingsController::class, 'getwallet']);
        Route::post('/createLimit', [SettingsController::class, 'createLimit']);
        Route::post('/createFee', [SettingsController::class, 'createFee']);
        Route::get('/getLimits', [SettingsController::class, 'getLimits']);
        Route::get('/getFees', [SettingsController::class, 'getFees']);
        Route::put('/updateLimit/{id}', [SettingsController::class, 'updateLimit']);
        Route::put('/updateFees/{id}', [SettingsController::class, 'updateFees']);
    });


    Route::prefix('report')->group(function () {
        Route::get('/getByReportRate', [ReportController::class, 'getByReportRate']);
        Route::get('/getByReportFee', [ReportController::class, 'getByReportFee']);
        Route::get('/getByReportLimit', [ReportController::class, 'getByReportLimit']);
        Route::get('/getByReportUser', [ReportController::class, 'getByReportUser']);
    });

       Route::prefix('transaction')->group(function () {
        Route::post('/create', [TransactionController::class, 'store']);
      
    });


    Route::prefix('roles')->group(function () {
        Route::get('/index', [RolesController::class, 'index']);
        Route::post('/create', [RolesController::class, 'store']);
        Route::post('/update', [RolesController::class, 'update']);
        Route::DELETE('/delete/{id}', [RolesController::class, 'destroy']);
        Route::get('/checkrow/{id}', [RolesController::class, 'checkrow']);
        Route::get('/getRolesType', [RolesController::class, 'getRolesType']);
        Route::POST('/checkRoleType', [RolesController::class, 'checkRoleType']);
    });


    Route::prefix('permission')->group(function () {
        Route::get('/index', [PermissionsController::class, 'index']);
        Route::post('/create', [PermissionsController::class, 'store']);
        Route::get('/check-permissions/{id}', [PermissionsController::class, 'checkpermissions']);
    });


    Route::prefix('users')->group(function () {
        Route::get('/index', [UserController::class, 'index']);
        Route::post('/create', [UserController::class, 'store']);
        Route::post('/update', [UserController::class, 'update']);
        Route::DELETE('/delete/{id}', [UserController::class, 'destroy']);
        Route::get('/checkUserrow/{id}', [UserController::class, 'checkUserrow']);
    });

    Route::prefix('posts-category')->group(function () {
        Route::get('/index', [PostCategoryController::class, 'index']);
        Route::post('/create', [PostCategoryController::class, 'store']);
        Route::post('/update', [PostCategoryController::class, 'update']);
        Route::DELETE('/delete/{id}', [PostCategoryController::class, 'destroy']);
        Route::get('/postrow/{id}', [PostCategoryController::class, 'postrow']);
    });
    Route::prefix('posts')->group(function () {
        Route::get('/index', [PostController::class, 'index']);
        Route::post('/create', [PostController::class, 'store']);
        Route::post('/update', [PostController::class, 'update']);
        Route::DELETE('/delete/{id}', [PostController::class, 'destroy']);
        Route::get('/postrow/{id}', [PostController::class, 'postrow']);
        Route::get('/postCategorysearch', [PostController::class, 'postCategorysearch']);
    });
});
Route::fallback(function () {
    return redirect('/');
});
