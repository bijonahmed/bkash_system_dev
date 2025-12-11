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
use App\Models\AdminFundDeposit;
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

    /*
    public function agentReport(Request $request)
    {
        $fromDate      = $request->input('fromDate');
        $toDate        = $request->input('toDate');
        $wallet_id     = $request->input('wallet_id');
        $bank_id       = $request->input('bank_id');
        $status        = $request->input('status');
        $agent_id      = $request->input('agent_id');
        $paymentMethod = $request->input('paymentMethod');

        $sl = 1;

        // Prepare Transactions query
        $query = Transaction::leftJoin('users as creators', 'transactions.entry_by', '=', 'creators.id')
            ->leftJoin('wallet', 'transactions.wallet_id', '=', 'wallet.id')
            ->leftJoin('banks', 'transactions.bank_id', '=', 'banks.id')
            ->leftJoin('branches', 'transactions.branch_id', '=', 'branches.id')
            ->leftJoin(
                DB::raw('(SELECT agent_id, DATE(payment_date) as pay_date, SUM(amount_gbp) as total_deposit
                             FROM deposit 
                             WHERE approval_status = 1
                             GROUP BY agent_id, DATE(payment_date)) as deposit_summary'),
                function ($join) {
                    $join->on('transactions.agent_id', '=', 'deposit_summary.agent_id')
                        ->on(DB::raw('DATE(transactions.created_at)'), '=', 'deposit_summary.pay_date');
                }
            )
            ->where('transactions.transection_status', 1)
            ->where('transactions.status', '!=', 'cancel')
            ->selectRaw('transactions.id, transactions.agent_id, transactions.senderName, transactions.beneficiaryName, transactions.beneficiaryPhone,
                     transactions.paymentMethod, transactions.sendingMoney, transactions.receiving_money, transactions.fee,
                     transactions.walletrate, transactions.bankRate,
                     creators.name as createdBy,
                     wallet.name as walletName,
                     banks.bank_name as bankName,
                     branches.branch_name as branchName,
                     branches.branch_code as branchCode,
                     DATE_FORMAT(transactions.created_at, "%d-%m-%Y") as created_at_formatted,
                     COALESCE(deposit_summary.total_deposit,0) as deposit_amount');

        // Apply filters
        if (!empty($wallet_id)) $query->where('transactions.wallet_id', $wallet_id);
        if (!empty($bank_id)) $query->where('transactions.bank_id', $bank_id);
        if (!empty($status)) $query->where('transactions.status', $status);
        if (!empty($agent_id)) $query->where('transactions.agent_id', $agent_id);
        if (!empty($paymentMethod)) $query->where('transactions.paymentMethod', $paymentMethod);
        if (!empty($fromDate)) $query->whereDate('transactions.created_at', '>=', $fromDate);
        if (!empty($toDate)) $query->whereDate('transactions.created_at', '<=', $toDate);

        $total = $query->count();

        $transactions = $query->orderBy('transactions.created_at', 'asc')
            ->orderBy('transactions.id', 'asc')
            ->get();

        // Prepare report
        $report = collect();
        foreach ($transactions as $tx) {
            $rate = $tx->paymentMethod == 'wallet' ? $tx->walletrate : ($tx->paymentMethod == 'bank' ? $tx->bankRate : 0);

            // Debit row (transaction)
            $report->push([
                'sl'               => $sl++,
                'id'               => $tx->id,
                'created_at'       => $tx->created_at_formatted,
                'senderName'       => ucfirst($tx->senderName),
                'beneficiaryName'  => $tx->beneficiaryName,
                'paytMethod'       => ucfirst($tx->paymentMethod),
                'beneficiaryPhone' => $tx->beneficiaryPhone,
                'walletrate'       => $rate,
                'fee'              => $tx->fee,
                'receiving_money'  => $tx->receiving_money,
                'debit'            => (float) $tx->sendingMoney,
                'credit'           => 0,
            ]);

            // Credit row (deposit)
            if ($tx->deposit_amount > 0) {
                $report->push([
                    'sl'               => $sl++,
                    'id'               => $tx->id,
                    'created_at'       => $tx->created_at_formatted,
                    'senderName'       => '',
                    'beneficiaryName'  => '',
                    'paytMethod'       => '',
                    'beneficiaryPhone' => '',
                    'walletrate'       => '',
                    'fee'              => '',
                    'receiving_money'  => '',
                    'debit'            => 0,
                    'credit'           => $tx->deposit_amount,
                ]);
            }
        }

        // Sort by date and serial if needed
        $report = $report->sortBy('created_at')->values();

        return response()->json([
            'data'  => $report,
            'total' => $total,
        ]);
    }
*/

    public function allAgentReport(Request $request)
    {
        $agent_id = $request->input('agent_id');

        // ===== AGENT BALANCES =====
        $allAgents = User::where('role_type', 2)
            ->where('status', 1)
            ->when($agent_id, function ($query, $agent_id) {
                return $query->where('id', $agent_id);
            })
            ->get();

        $agentBalances = [];

        foreach ($allAgents as $agent) {

            // Transactions sum
            $agentSettlement = Transaction::where('agent_id', $agent->id)
                ->where('transection_status', 1)
                //->where('status', '!=', 'cancel')
                ->sum(DB::raw('sendingMoney + fee'));

            // Deposits sum
            $sumDepositApproved = Deposit::where('agent_id', $agent->id)
                ->where('approval_status', 1)
                ->sum('amount_gbp');

            // Calculate balance
            $getBalance = $sumDepositApproved - $agentSettlement;

            $agentBalances[] = [
                'agent_id'        => $agent->id,
                'agent_name'      => $agent->name,
                'phone_number'    => $agent->phone_number,
                'agentCode'       => $agent->agentCode,
                'settlement'      => number_format($agentSettlement, 2),
                'depositApproved' => number_format($sumDepositApproved, 2),
                'balance'         => number_format($getBalance, 2),
            ];
        }

        // Return JSON
        return response()->json([
            'data' => $agentBalances,
        ]);
    }


    public function agentReport(Request $request)
    {
        $fromDate      = $request->input('fromDate');
        $toDate        = $request->input('toDate');
        $wallet_id     = $request->input('wallet_id');
        $bank_id       = $request->input('bank_id');
        $status        = $request->input('status');
        $agent_id      = $request->input('agent_id');
        $paymentMethod = $request->input('paymentMethod');

        $sl = 1;
        $report = collect();


        $query = Transaction::leftJoin('users as creators', 'transactions.entry_by', '=', 'creators.id')
            ->leftJoin('wallet', 'transactions.wallet_id', '=', 'wallet.id')
            ->leftJoin('banks', 'transactions.bank_id', '=', 'banks.id')
            ->leftJoin('branches', 'transactions.branch_id', '=', 'branches.id')
            ->where('transactions.transection_status', 1)
            ->where('transactions.status', '!=', 'cancel')
            ->select([
                'transactions.*',
                'creators.name as createdBy',
                'wallet.name as walletName',
                'banks.bank_name as bankName',
                'branches.branch_name as branchName',
                'branches.branch_code as branchCode'
            ]);

        if (!empty($wallet_id)) $query->where('wallet_id', $wallet_id);
        if (!empty($bank_id)) $query->where('bank_id', $bank_id);
        if (!empty($status)) $query->where('transactions.status', $status);
        if (!empty($agent_id)) $query->where('agent_id', $agent_id);
        if (!empty($paymentMethod)) $query->where('paymentMethod', $paymentMethod);
        if (!empty($fromDate)) $query->whereDate('transactions.created_at', '>=', $fromDate);
        if (!empty($toDate)) $query->whereDate('transactions.created_at', '<=', $toDate);

        $total = $query->count();

        $transactions = $query->orderBy('transactions.created_at', 'asc')->orderBy('transactions.id', 'asc')->get();

        // 2️⃣ Fetch Deposits (all deposits in date range, not just ones linked to transactions)
        $depositQuery = Deposit::where('approval_status', 1);
        if (!empty($agent_id)) $depositQuery->where('agent_id', $agent_id);
        if (!empty($fromDate)) $depositQuery->whereDate('created_at', '>=', $fromDate);
        if (!empty($toDate)) $depositQuery->whereDate('created_at', '<=', $toDate);

        $deposits = $depositQuery->orderBy('created_at', 'asc')->get();

        // Map deposits by agent_id + date for easy lookup
        $depositMap = [];
        foreach ($deposits as $dep) {
            $key = $dep->agent_id . '|' . Carbon::parse($dep->payment_date)->format('Y-m-d');
            // sum multiple deposits per agent per date
            if (!isset($depositMap[$key])) {
                $depositMap[$key] = $dep->amount_gbp;
            } else {
                $depositMap[$key] += $dep->amount_gbp;
            }
        }

        // 3️⃣ Add Transaction Rows (debit)
        foreach ($transactions as $tx) {
            $txDateYmd = Carbon::parse($tx->created_at)->format('Y-m-d');

            $rate = 0;
            if ($tx->paymentMethod == 'wallet') {
                $rate = $tx->walletrate;
            } else if ($tx->paymentMethod == 'bank') {
                $rate = $tx->bankRate;
            }

            $report->push([
                'sl'              => $sl++,
                'id'              => $tx->id,
                'created_at'      => Carbon::parse($tx->created_at)->timezone('Asia/Dhaka')->format('d-m-Y'),
                'senderName'      => ucfirst($tx->senderName),
                'beneficiaryName' => $tx->beneficiaryName,
                'paytMethod'      => ucfirst($tx->paymentMethod),
                'beneficiaryPhone' => $tx->beneficiaryPhone,

                'walletrate'      => $rate,
                'fee'             => $tx->fee,
                'receiving_money' => $tx->receiving_money,
                'debit'           => (float) $tx->sendingMoney,
                'credit'          => 0,
            ]);

            // 4️⃣ Add Credit Row if deposit exists for this agent + date
            $depositKey = $tx->agent_id . '|' . $txDateYmd;
            if (isset($depositMap[$depositKey]) && $depositMap[$depositKey] > 0) {
                $report->push([
                    'sl'              => $sl++,
                    'id'              => $tx->id,
                    'created_at'      => Carbon::parse($tx->created_at)->timezone('Asia/Dhaka')->format('d-m-Y'),
                    'senderName'      => '',  // blank for credit row
                    'beneficiaryName' => '',  // blank for credit row
                    'paytMethod'      => '',
                    'beneficiaryPhone' => '',
                    'walletrate'      => '',
                    'fee'             => '',
                    'receiving_money' => '',
                    'debit'           => 0,
                    'credit'          => $depositMap[$depositKey],
                ]);

                // Remove from map to prevent duplicate credit rows
                unset($depositMap[$depositKey]);
            }
        }

        // 5️⃣ Add remaining deposits that have no corresponding transaction
        foreach ($depositMap as $key => $amount) {
            [$agentId, $date] = explode('|', $key);
            $report->push([
                'sl'              => $sl++,
                'id'              => 0, // no transaction id
                'created_at'      => Carbon::parse($date)->timezone('Asia/Dhaka')->format('d-m-Y'),
                'senderName'      => '',
                'beneficiaryName' => '',
                'paytMethod'      => '',
                'beneficiaryPhone' => '',
                'walletrate'      => '',
                'fee'             => '',
                'receiving_money' => '',
                'debit'           => 0,
                'credit'          => $amount,
            ]);
        }

        // 6️⃣ Sort by date and serial (optional)
        $report = $report->sortBy('created_at')->values();

        return response()->json([
            'data'  => $report,
            'total' => $total,
        ]);
    }




    public function getGlobalReport(Request $request)
    {
        //dd($request->all());
        $fromDate      = $request->input('fromDate');
        $toDate        = $request->input('toDate');
        $paymentMethod = $request->input('paymentMethod');
        $wallet_id     = $request->input('wallet_id');
        $bank_id       = $request->input('bank_id');
        $status        = $request->input('status');
        $agent_id      = $request->input('agent_id');
        // Base query with joins
        $query = Transaction::leftJoin('users as creators', 'transactions.entry_by', '=', 'creators.id')
            ->leftJoin('wallet', 'transactions.wallet_id', '=', 'wallet.id')
            ->leftJoin('banks', 'transactions.bank_id', '=', 'banks.id')
            ->leftJoin('users', 'transactions.agent_id', '=', 'users.id')
            ->leftJoin('branches', 'transactions.branch_id', '=', 'branches.id')
            ->select([
                'transactions.*',
                'creators.name as createdBy',
                'users.name as agentName',
                'users.agentCode',
                'wallet.name as walletName',
                'banks.bank_name as bankName',
                'branches.branch_name as branchName',
                'branches.branch_code as branchCode'
            ]);
        if (!empty($paymentMethod)) $query->where('paymentMethod', $paymentMethod);
        if (!empty($status)) $query->where('transactions.status', $status);
        if (!empty($wallet_id)) $query->where('wallet_id', $wallet_id);
        if (!empty($agent_id)) $query->where('agent_id', $agent_id);
        if (!empty($bank_id)) $query->where('bank_id', $bank_id);
        if (!empty($fromDate)) $query->whereDate('transactions.created_at', '>=', $fromDate);
        if (!empty($toDate)) $query->whereDate('transactions.created_at', '<=', $toDate);
        $total = $query->count();
        $results = $query->orderByDesc('transactions.id')
            ->get();



        $getFundBalance = AdminFundDeposit::where('status', 1)->get();
        $depositAmt = (float) $getFundBalance->sum('depsoit_amount'); // total deposit

        $modifiedCollection = collect(); // empty collection to append rows

        // 1️⃣ Add the initial Deposit row
        $modifiedCollection->push([
            'id'                => '',
            'agentName'         => 'Deposit Amount',
            'agentCode'         => '',
            'beneficiaryName'   => '',
            'beneficiaryPhone'  => '',
            'charges'           => '',
            'fee'               => '',
            'totalAmount'       => '',
            'receiving_money'   => '',
            'sendingMoney'      => '',
            'walletName'        => '',
            'walletrate'        => '',
            'bankRate'          => '',
            'bankName'          => '',
            'branchName'        => '',
            'branchCode'        => '',
            'accountNo'         => '',
            'description'       => '',
            'agentsettlement'   => '',
            'totalCollection'   => '',
            'status'            => '',
            'paytMethod'        => '',
            'ourProfit'         => '',
            'senderName'        => '',
            'paymentMethod'     => '',
            'buyingRate'        => '',
            'deposit_balance'   => number_format($depositAmt, 2), // show full deposit
            'createdBy'         => '',
            'created_at'        => '',
        ]);

        // 2️⃣ Add transaction rows with running balance
        $runningBalance = $depositAmt; // initialize running balance

        $results->each(function ($item) use (&$runningBalance, $modifiedCollection) {

            $paymentMethod = strtolower((string)$item->paymentMethod ?? '');
            $rate = 0;
            if ($paymentMethod === 'wallet') {
                $rate = (float) ($item->walletrate ?? 0);
            } elseif ($paymentMethod === 'bank') {
                $rate = (float) ($item->bankRate ?? 0);
            }


            // Subtract receiving money from running balance
            $buyingRate = $item->admin_buying_rate ?? 0;
            $runningBalance -= (float) ($item->receiving_money ?? 0);
            $ourProfit = ($buyingRate ?? 0) - ($rate ?? 0);

            $modifiedCollection->push([
                'id'                => $item->id,
                'agentName'         => $item->agentName ?? "",
                'agentCode'         => $item->agentCode ?? "",
                'beneficiaryName'   => $item->beneficiaryName,
                'beneficiaryPhone'  => $item->beneficiaryPhone,
                'charges'           => $item->charges,
                'fee'               => $item->fee,
                'totalAmount'       => $item->totalAmount,
                'receiving_money'   => $item->receiving_money,
                'sendingMoney'      => $item->sendingMoney,
                'walletName'        => $item->walletName ?? '',
                'walletrate'        => $rate,
                'bankRate'          => $item->bankRate,
                'bankName'          => $item->bankName ?? '',
                'branchName'        => $item->branchName ?? '',
                'branchCode'        => $item->branchCode ?? '',
                'accountNo'         => $item->accountNo ?? '',
                'description'       => $item->description ?? '',
                'agentsettlement'   => number_format(($item->sendingMoney ?? 0) + ($item->fee ?? 0), 2),
                'totalCollection'   => number_format(($item->sendingMoney ?? 0) + ($item->fee ?? 0), 2),
                'status'            => ucfirst($item->status),
                'paytMethod'        => $item->paymentMethod,
                'ourProfit'         => $ourProfit,
                'senderName'        => ucfirst($item->senderName),
                'paymentMethod'     => ucfirst($item->paymentMethod),
                'buyingRate'        => $buyingRate,
                'deposit_balance'   => number_format($runningBalance, 2),
                'createdBy'         => $item->createdBy ?? 'N/A',
                'created_at'        => Carbon::parse($item->created_at)
                    ->timezone('Asia/Dhaka')
                    ->format('d-m-Y'),
            ]);
        });


        /*
        $getFundBalance = AdminFundDeposit::where('status', 1)->get();
        $depositAmt     = (float) $getFundBalance->sum('depsoit_amount');
        $buyingRate     = (float) ($getFundBalance->first()->buying_rate ?? 0);
        $running        = $depositAmt;

        $modifiedCollection = $results->map(function ($item) use (&$running, $buyingRate) {
        $paymentMethod      = strtolower((string)$item->paymentMethod);
      
            $rate = 0;
            if ($paymentMethod === 'wallet') {
                $rate = (float) ($item->walletrate ?? 0);
            } elseif ($paymentMethod === 'bank') {
                $rate = (float) ($item->bankRate ?? 0);
            }
          
            $buyRateValue = $buyingRate;
            $receiving    = (float) ($item->receiving_money ?? 0);
            $running      = $running - $receiving;

            return [
                'id'               => $item->id,
                'agentName'        => $item->agentName ?? "",
                'agentCode'        => $item->agentCode ?? "",
                'beneficiaryName'  => $item->beneficiaryName,
                'beneficiaryPhone' => $item->beneficiaryPhone,
                'charges'          => $item->charges,
                'fee'              => $item->fee,
                'totalAmount'      => $item->totalAmount,
                'receiving_money'  => $item->receiving_money,
                'sendingMoney'     => $item->sendingMoney,
                'walletName'       => $item->walletName ?? '',
                'walletrate'       => $rate,
                'bankRate'         => $item->bankRate,
                'bankName'         => $item->bankName ?? '',
                'branchName'       => $item->branchName ?? '',
                'branchCode'       => $item->branchCode ?? '',
                'accountNo'        => $item->accountNo ?? '',
                'description'      => $item->description ?? '',
                'buyingRate'       => number_format($buyRateValue, 2),
                'agentsettlement'  => number_format((($item->sendingMoney ?? 0) + ($item->fee ?? 0)), 2),
                'totalCollection'  => number_format((($item->sendingMoney ?? 0) + ($item->fee ?? 0)), 2),
                'deposit_balance'  => number_format($running, 2),
                'status'           => ucfirst($item->status),
                'paymentMethod'    => ucfirst($item->paymentMethod),
                'ourProfit'        => "00",
                'createdBy'        => $item->createdBy ?? 'N/A',
                'created_at'       => Carbon::parse($item->created_at)
                    ->timezone('Asia/Dhaka')
                    ->format('d-m-Y'),
            ];
        });
        */


        return response()->json([
            'data' => $modifiedCollection,
            'total' => $total,
        ]);
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
