<?php

namespace App\Http\Controllers\Api\Report;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Fees;
use DB;
use File;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Contracts\Permission;
use Validator;
use App\Helpers\PermissionHelper;
use App\Models\Deposit;
use App\Models\DepositLog;
use App\Models\FeesLog;
use App\Models\Limit;
use App\Models\LimitLog;
use App\Models\Transaction;
use App\Models\User;
use App\Models\UserLog;
use App\Models\Wallet;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function getByReportRate()
    {
        $settingData = Setting::find(1);
        $chkData = User::where('id', $settingData->update_by)->first();

        $data['update_by']              = $chkData->name ?? "";
        $data['update_date']            = date("d-M-Y", strtotime($settingData->updated_at));
        $data['sending_currency']       = $settingData->sending_currency ?? "";
        $data['receiving_currency']     = $settingData->receiving_currency ?? "";
        $data['exchange_rate_wallet']   = $settingData->exchange_rate_wallet ?? "";
        $data['exchange_rate_bank']     = $settingData->exchange_rate_bank ?? "";

        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }
    public function getByReportDeposit(Request $request)
    {

        $fromDate = $request->input('fromDate'); // e.g., "2025-11-01"
        $toDate   = $request->input('toDate');   // e.g., "2025-11-18"

        $logs = DB::table('deposit_log')
            ->join('users', 'users.id', '=', 'deposit_log.agent_id')
            ->whereBetween('deposit_log.created_at', [
                $fromDate . ' 00:00:00',
                $toDate . ' 23:59:59'
            ])
            ->select(
                'deposit_log.*',
                'users.name as agent_name',
                'users.email as agent_email'
            )
            ->get();

        if ($logs->isEmpty()) {
            return response()->json([
                'data'    => [],
                'message' => 'No records found for the given date range.'
            ], 404);
        }

        return response()->json([
            'data'    => $logs,
            'message' => 'Success'
        ], 200);
    }
    public function getByReportFee(Request $request)
    {

        $fromDate = $request->input('fromDate'); // e.g., "2025-11-01"
        $toDate   = $request->input('toDate');   // e.g., "2025-11-18"

        $logs = FeesLog::whereBetween('created_at', [
            $fromDate . ' 00:00:00',
            $toDate   . ' 23:59:59'
        ])->get();

        if ($logs->isEmpty()) {
            return response()->json([
                'data'    => [],
                'message' => 'No records found for the given date range.'
            ], 404);
        }

        return response()->json([
            'data'    => $logs,
            'message' => 'Success'
        ], 200);
    }


    public function getByReportLimit(Request $request)
    {
        $fromDate = $request->input('fromDate'); // e.g., "2025-11-01"
        $toDate   = $request->input('toDate');   // e.g., "2025-11-18"

        $logs     = LimitLog::whereBetween('created_at', [
            $fromDate . ' 00:00:00',
            $toDate   . ' 23:59:59'
        ])->get();

        if ($logs->isEmpty()) {
            return response()->json([
                'data'    => [],
                'message' => 'No records found for the given date range.'
            ], 404);
        }

        return response()->json([
            'data'    => $logs,
            'message' => 'Success'
        ], 200);
    }

    public function getByReportUser(Request $request)
    {
        $fromDate = $request->input('fromDate'); // e.g., "2025-11-01"
        $toDate   = $request->input('toDate');   // e.g., "2025-11-18"

        $logs     = UserLog::whereBetween('created_at', [
            $fromDate . ' 00:00:00',
            $toDate   . ' 23:59:59'
        ])->get();

        if ($logs->isEmpty()) {
            return response()->json([
                'data'    => [],
                'message' => 'No records found for the given date range.'
            ], 404);
        }

        return response()->json([
            'data'    => $logs,
            'message' => 'Success'
        ], 200);
    }


    public function getTransactionReport(Request $request)
    {

        $fromDate = $request->input('fromDate'); // e.g., "2025-11-01"
        $toDate   = $request->input('toDate');   // e.g., "2025-11-18"

        // Base query with joins
        $query = Transaction::leftJoin('users as creators', 'transactions.entry_by', '=', 'creators.id')
            ->leftJoin('wallet', 'transactions.wallet_id', '=', 'wallet.id')
            ->leftJoin('banks', 'transactions.bank_id', '=', 'banks.id')
            ->leftJoin('branches', 'transactions.branch_id', '=', 'branches.id')
            ->select([
                'transactions.*',
                'creators.name as createdBy',
                'wallet.name as walletName',
                'banks.bank_name as bankName',
                'branches.branch_name as branchName',
                'branches.branch_code as branchCode'
            ]);


        if (!empty($fromDate)) $query->whereDate('transactions.created_at', '>=', $fromDate);
        if (!empty($toDate)) $query->whereDate('transactions.created_at', '<=', $toDate);


        $total = $query->count();

        $results = $query->orderByDesc('transactions.id')
            ->get();

        // Map results (no extra queries)
        $modifiedCollection = $results->map(function ($item) {
            return [
                'id'                    => $item->id,
                'beneficiaryName'       => $item->beneficiaryName,
                'beneficiaryPhone'      => $item->beneficiaryPhone,
                'charges'               => $item->charges,
                'fee'                   => $item->fee,
                'totalAmount'           => $item->totalAmount,
                'receiving_money'       => $item->receiving_money,
                'sendingMoney'          => $item->sendingMoney,
                'walletName'            => $item->walletName ?? '',
                'walletrate'            => $item->walletrate,
                'bankRate'              => $item->bankRate,
                'bankName'              => $item->bankName ?? '',
                'branchName'            => $item->branchName ?? '',
                'branchCode'            => $item->branchCode ?? '',
                'accountNo'             => $item->accountNo ?? '',
                'description'           => $item->description ?? '',
                'agentsettlement'       => number_format(($item->sendingMoney ?? 0) + ($item->fee ?? 0), 2),
                'status'                => ucfirst($item->status),
                'paytMethod'            => $item->paymentMethod,
                'senderName'            => ucfirst($item->senderName),
                'paymentMethod'         => ucfirst($item->paymentMethod),
                'createdBy'             => $item->createdBy ?? 'N/A',
                'created_at'            => Carbon::parse($item->created_at)
                    ->timezone('Asia/Dhaka')
                    ->format('M d, Y h:i A'),
            ];
        });



        return response()->json([
            'data' => $modifiedCollection,
            'total' => $total,
        ]);
    }
}
