<?php

use App\Http\Controllers\Api\AdminFundDeposit\AdminFundDepositController;
use App\Http\Controllers\Api\AgentSendRquest\AgentRequestSendController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Bank\BankController;
use App\Http\Controllers\Api\Branch\BranchController;
use App\Http\Controllers\Api\Dashboard\DashboardController;
use App\Http\Controllers\Api\Deposit\DepositController;
use App\Http\Controllers\Api\Post\PostCategoryController;
use App\Http\Controllers\Api\Post\PostController;
use App\Http\Controllers\Api\User\UserController;
use App\Http\Controllers\Api\Roles\RolesController;
use App\Http\Controllers\Api\Permissions\PermissionsController;
use App\Http\Controllers\Api\Report\ReportController;
use App\Http\Controllers\Api\Settings\SettingsController;
use App\Http\Controllers\Api\Transaction\TransactionController;
use App\Http\Controllers\Api\Wallet\WalletController;
use App\Models\AdminFundDeposit;
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
        Route::get('/checkedWalletforAgent', [SettingsController::class, 'checkedWalletforAgent']);
        Route::get('/getBanks', [SettingsController::class, 'getBanks']);
        Route::POST('/bankUnderBranch', [SettingsController::class, 'bankUnderBranch']);
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
        Route::get('/getByReportDeposit', [ReportController::class, 'getByReportDeposit']);
        Route::get('/getByReportLimit', [ReportController::class, 'getByReportLimit']);
        Route::get('/getByReportUser', [ReportController::class, 'getByReportUser']);
        Route::get('/getTransactionReport', [ReportController::class, 'getTransactionReport']);
        Route::get('/getGlobalReport', [ReportController::class, 'getGlobalReport']);
        Route::get('/agentReport', [ReportController::class, 'agentReport']);
        Route::get('/allAgentReport', [ReportController::class, 'allAgentReport']);
    });


    Route::prefix('wallet')->group(function () {
        Route::get('/index', [WalletController::class, 'index']);
        Route::get('/getwalletAgent', [WalletController::class, 'getwalletAgent']);
        Route::post('/create', [WalletController::class, 'store']);
        Route::post('/assignWallet', [WalletController::class, 'assignWallet']);
        Route::post('/update', [WalletController::class, 'update']);
        Route::post('/walletcalculateCheck', [WalletController::class, 'walletcalculateCheck']);
        Route::get('/checkrow/{id}', [WalletController::class, 'checkrow']);
        Route::DELETE('/delete/{id}', [WalletController::class, 'destroy']);
        Route::DELETE('/deleteAgentRate/{id}', [WalletController::class, 'deleteAgentRate']);
    });

    Route::prefix('bank')->group(function () {
        Route::get('/index', [BankController::class, 'index']);
        Route::post('/create', [BankController::class, 'store']);
        Route::post('/update', [BankController::class, 'update']);
        Route::get('/checkrow/{id}', [BankController::class, 'checkrow']);
        Route::DELETE('/delete/{id}', [BankController::class, 'destroy']);
    });

    Route::prefix('adminFundDeposit')->group(function () {
        Route::get('/index', [AdminFundDepositController::class, 'index']);
        Route::post('/create', [AdminFundDepositController::class, 'store']);
        Route::post('/update', [AdminFundDepositController::class, 'update']);
        Route::get('/checkrow/{id}', [AdminFundDepositController::class, 'checkrow']);
        Route::DELETE('/delete/{id}', [AdminFundDepositController::class, 'destroy']);
    });




    Route::prefix('branch')->group(function () {
        Route::get('/index', [BranchController::class, 'index']);
        Route::post('/create', [BranchController::class, 'store']);
        Route::post('/update', [BranchController::class, 'update']);
        Route::get('/checkrow/{id}', [BranchController::class, 'checkrow']);
        Route::DELETE('/delete/{id}', [BranchController::class, 'destroy']);
    });



    Route::prefix('transaction')->group(function () {
        Route::get('/index', [TransactionController::class, 'index']);
        Route::post('/create', [TransactionController::class, 'store']);
        Route::post('/update', [TransactionController::class, 'update']);
        Route::DELETE('/delete/{id}', [TransactionController::class, 'destroy']);
        Route::DELETE('/restoreTransaction/{id}', [TransactionController::class, 'restoreTransaction']);
        Route::get('/checkrow/{id}', [TransactionController::class, 'checkrow']);
        Route::post('/walletcalculate', [TransactionController::class, 'walletcalculate']);
        Route::post('/updateStatusForTransaction', [TransactionController::class, 'updateStatusForTransaction']);
    });

    Route::prefix('dashbaord')->group(function () {
        Route::get('/getDashboardData', [DashboardController::class, 'getDashboardData']);
    });


    Route::prefix('deposit-request')->group(function () {
        Route::get('/index', [AgentRequestSendController::class, 'index']);
        Route::post('/sendDepositRequest', [AgentRequestSendController::class, 'store']);
        Route::get('/checkrow/{id}', [AgentRequestSendController::class, 'checkrow']);
        Route::post('/depositRequestUpdate', [AgentRequestSendController::class, 'update']);
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
        Route::get('/getOnlyAgentList', [UserController::class, 'getOnlyAgentList']);
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
