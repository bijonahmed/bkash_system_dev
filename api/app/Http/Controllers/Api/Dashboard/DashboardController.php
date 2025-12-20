<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Deposit;
use App\Models\Orders;
use App\Models\PostCategory;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\PurchaseOrderInvoice;
use App\Models\Supplier;
use App\Models\Transaction;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpParser\Node\Stmt\Catch_;
use PhpParser\Node\Stmt\TryCatch;
use Illuminate\Support\Str;
use Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getDashboardData()
    {
        $user = Auth::user();
        try {
            if ($user->getRoleNames()->contains('admin')) {
                $data['transaction_all'] =  Transaction::whereDate('created_at', Carbon::today())->count();
            } else if ($user->getRoleNames()->contains('agent')) {
                $data['transaction_all'] = Transaction::where('agent_id', $user->id)->whereDate('created_at', Carbon::today())->count();
            }
            $data['agentList']           = User::where('role_type', 2)->where('status', 1)->count();
            if ($user->hasRole('admin')) {

                $agentSettlement = Transaction::where('status', '!=', 'cancel')->whereDate('created_at', Carbon::today())->sum(DB::raw('sendingMoney + fee'));
                $sumDepositApproved = Deposit::where('approval_status', 1)->whereDate('created_at', Carbon::today())->sum('amount_gbp');

                $getbalance = $agentSettlement - $sumDepositApproved;

                $data['depositApproved_status'] = 'Pending';
                $data['depositApproved'] = Deposit::where('approval_status', 0)->whereDate('created_at', Carbon::today())->count();
            } else if ($user->hasRole('agent')) {

                $agentSettlement = Transaction::where('status', '!=', 'cancel')->whereDate('created_at', Carbon::today())->where('agent_id', $user->id)->sum(DB::raw('sendingMoney + fee'));
                $sumDepositApproved = Deposit::where('agent_id', $user->id)->whereDate('created_at', Carbon::today())->where('approval_status', 1)->sum('amount_gbp');

                $getbalance = $sumDepositApproved - $agentSettlement;

                $data['depositApproved_status'] = 'Pending';
                $data['depositApproved'] = Deposit::where('approval_status', 0)->whereDate('created_at', Carbon::today())->where('agent_id', $user->id)->count();
                //->sum('amount_gbp');
            }
            $balance = $getbalance;

            if ($user->hasRole('admin')) {
                $data['balance'] = number_format($balance, 2); // admin sees exact balance
            }

            if ($user->hasRole('agent')) {
                if ($balance < 0) {
                    // Negative balance → Credit
                    $data['balance'] = number_format(abs($balance), 2) . ' Cr';
                } else {
                    // Positive balance → Debit
                    $data['balance'] = number_format($balance, 2) . ' Dr';
                }
            }

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong while fetching dashboard data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
