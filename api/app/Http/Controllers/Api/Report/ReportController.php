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
use App\Models\Banks;
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
    public function allAgentReport(Request $request)
    {
        $agent_id = $request->input('agent_id');
        // Get all active agents (role_type = 2)
        $allAgents = User::where('role_type', 2)
            // ->where('status', 1)
            ->when($agent_id, fn($query) => $query->where('id', $agent_id))
            ->get();
        $agentBalances = $allAgents->map(function ($agent) {
            $debitValue =
                Transaction::where('status', '!=', 'cancel')
                ->where('agent_id', $agent->id)
                ->sum(DB::raw('
        CASE 
            WHEN pr_rate > 0 
            THEN (receiving_money / pr_rate) + fee 
            ELSE 0 
        END
    '));
            //Transaction::where('status', '!=', 'cancel')->where('agent_id', $agent->id);
            $creditValue = Deposit::where('approval_status', 1)->where('agent_id', $agent->id)->sum('amount_gbp');
            $value = $debitValue - $creditValue;
            $getbalance = ($creditValue > $debitValue)
                ? '-' . number_format(abs($value), 2)
                : number_format(abs($value), 2);
            return [
                'agent_id'     => $agent->id,
                'agent_name'   => $agent->name,
                'phone_number' => $agent->phone_number,
                'agentCode'    => $agent->agentCode,
                'balance'      => $getbalance,
            ];
        });
        return response()->json([
            'data' => $agentBalances,
        ]);
    }
    //Can see all transaction Admin 
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
        // ==================== FETCH TRANSACTIONS ====================
        $transactionQuery = Transaction::leftJoin('users as creators', 'transactions.entry_by', '=', 'creators.id')
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
        if (!empty($wallet_id)) $transactionQuery->where('wallet_id', $wallet_id);
        if (!empty($bank_id)) $transactionQuery->where('bank_id', $bank_id);
        if (!empty($status)) $transactionQuery->where('transactions.status', $status);
        if (!empty($agent_id)) $transactionQuery->where('agent_id', $agent_id);
        if (!empty($paymentMethod)) $transactionQuery->where('paymentMethod', $paymentMethod);
        if (!empty($fromDate)) $transactionQuery->whereDate('transactions.created_at', '>=', $fromDate);
        if (!empty($toDate)) $transactionQuery->whereDate('transactions.created_at', '<=', $toDate);
        $transactions = $transactionQuery->get();
        $total = $transactions->count();
        // ==================== FETCH DEPOSITS ====================
        $depositQuery = Deposit::query()
            ->where('approval_status', 1)
            ->when($agent_id, fn($q) => $q->where('agent_id', $agent_id))
            ->when($fromDate, fn($q) => $q->whereDate('created_at', '>=', $fromDate))
            ->when($toDate, fn($q) => $q->whereDate('created_at', '<=', $toDate))
            ->orderBy('created_at', 'asc')
            ->orderBy('id', 'asc');
        $deposits = $depositQuery->get();
        // ==================== PRELOAD WALLET & BANK NAMES ====================
        $wallets = Wallet::pluck('name', 'id')->toArray();
        $banks   = Banks::pluck('bank_name', 'id')->toArray();
        // ==================== MERGE TIMELINE ====================
        $timeline = collect();
        foreach ($transactions as $index => $tx) {
            $timeline->push([
                'sort_key'   => $tx->created_at->format('Y-m-d H:i:s.u') . '-tx-' . $index,
                'type'       => 'transaction',
                'created_at' => $tx->created_at,
                'data'       => $tx
            ]);
        }
        foreach ($deposits as $index => $dep) {
            $timeline->push([
                'sort_key'   => $dep->created_at->format('Y-m-d H:i:s.u') . '-dep-' . $index,
                'type'       => 'deposit',
                'created_at' => $dep->created_at,
                'data'       => $dep
            ]);
        }
        // ==================== SORT TIMELINE ====================
        $timeline = $timeline->sortBy('sort_key')->values();
        // ==================== BUILD REPORT ====================
        foreach ($timeline as $row) {
            if ($row['type'] === 'transaction') {
                $tx = $row['data'];
                $rate = 0;
                $walletrate_name = '';
                if ($tx->paymentMethod === 'wallet') {
                    $rate = $tx->walletrate ?? 0;
                    $walletrate_name = $wallets[$tx->wallet_id] ?? '';
                } elseif ($tx->paymentMethod === 'bank') {
                    $rate = $tx->bankRate ?? 0;
                    $walletrate_name = $banks[$tx->bank_id] ?? 'Bank';
                }
                $sending = (float) ($tx->sendingMoney ?? 0);
                $fee     = (float) ($tx->fee ?? 0);
                $report->push([
                    'sl'               => $sl++,
                    'id'               => $tx->id,
                    'pr_rate'          => $tx->pr_rate ?? 0,
                    'created_at'       => Carbon::parse($tx->created_at)->format('d-m-Y H:i'),
                    'senderName'       => ucfirst($tx->senderName ?? ''),
                    'beneficiaryName'  => $tx->beneficiaryName ?? '',
                    'paytMethod'       => ucfirst($tx->paymentMethod ?? ''),
                    'beneficiaryPhone' => $tx->beneficiaryPhone ?? '',
                    'agent_settlement' => $tx->agent_settlement ?? '',
                    'walletrate_name'  => $walletrate_name,
                    'walletrate'       => $rate,
                    'fee'              => $fee,
                    'receiving_money'  => $tx->receiving_money,
                    'sendingMoney'     => $sending,
                    'debit'            => number_format($sending + $fee, 2),
                    'credit'           => 0,
                ]);
            }
            if ($row['type'] === 'deposit') {
                $dep = $row['data'];
                $credit = (float) ($dep->amount_gbp ?? 0);
                $report->push([
                    'sl'               => $sl++,
                    'id'               => 0,
                    'created_at'       => Carbon::parse($dep->created_at)->format('d-m-Y H:i'),
                    'senderName'       => '',
                    'beneficiaryName'  => '',
                    'paytMethod'       => 'Deposit',
                    'beneficiaryPhone' => '',
                    'walletrate_name'  => '',
                    'walletrate'       => '',
                    'fee'              => '',
                    'receiving_money'  => '',
                    'sendingMoney'     => '',
                    'debit'            => 0,
                    'credit'           => $credit,
                ]);
            }
        }
        return response()->json([
            'data'  => $report,
            'total' => $total,
        ]);
    }
    //For agent satement can see only their own transaction 
    public function agentStatement(Request $request)
    {
        //dd($request->all());
        $user = Auth::user();
        $agent_id = $user->id;
        $fromDate      = $request->input('fromDate');
        $toDate        = $request->input('toDate');
        $wallet_id     = $request->input('wallet_id');
        $bank_id       = $request->input('bank_id');
        $status        = $request->input('status');
        $agent_id      = $agent_id;
        $paymentMethod = $request->input('paymentMethod');
        $sl = 1;
        $report = collect();
        // ==================== FETCH TRANSACTIONS ====================
        $transactionQuery = Transaction::leftJoin('users as creators', 'transactions.entry_by', '=', 'creators.id')
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
        if (!empty($wallet_id)) $transactionQuery->where('wallet_id', $wallet_id);
        if (!empty($bank_id)) $transactionQuery->where('bank_id', $bank_id);
        if (!empty($status)) $transactionQuery->where('transactions.status', $status);
        if (!empty($agent_id)) $transactionQuery->where('agent_id', $agent_id);
        if (!empty($paymentMethod)) $transactionQuery->where('paymentMethod', $paymentMethod);
        if (!empty($fromDate)) $transactionQuery->whereDate('transactions.created_at', '>=', $fromDate);
        if (!empty($toDate)) $transactionQuery->whereDate('transactions.created_at', '<=', $toDate);
        $transactions = $transactionQuery->get();
        $total = $transactions->count();
        // ==================== FETCH DEPOSITS ====================
        $depositQuery = Deposit::query()
            ->where('approval_status', 1)
            ->when($agent_id, fn($q) => $q->where('agent_id', $agent_id))
            ->when($fromDate, fn($q) => $q->whereDate('created_at', '>=', $fromDate))
            ->when($toDate, fn($q) => $q->whereDate('created_at', '<=', $toDate))
            ->orderBy('created_at', 'asc')
            ->orderBy('id', 'asc');
        $deposits = $depositQuery->get();
        // ==================== PRELOAD WALLET & BANK NAMES ====================
        $wallets = Wallet::pluck('name', 'id')->toArray();
        $banks   = Banks::pluck('bank_name', 'id')->toArray();
        // ==================== MERGE TIMELINE ====================
        $timeline = collect();
        foreach ($transactions as $index => $tx) {
            $timeline->push([
                'sort_key'   => $tx->created_at->format('Y-m-d H:i:s.u') . '-tx-' . $index,
                'type'       => 'transaction',
                'created_at' => $tx->created_at,
                'data'       => $tx
            ]);
        }
        foreach ($deposits as $index => $dep) {
            $timeline->push([
                'sort_key'   => $dep->created_at->format('Y-m-d H:i:s.u') . '-dep-' . $index,
                'type'       => 'deposit',
                'created_at' => $dep->created_at,
                'data'       => $dep
            ]);
        }
        // ==================== SORT TIMELINE ====================
        $timeline = $timeline->sortBy('sort_key')->values();
        // ==================== BUILD REPORT ====================
        foreach ($timeline as $row) {
            if ($row['type'] === 'transaction') {
                $tx = $row['data'];
                $rate = 0;
                $walletrate_name = '';
                if ($tx->paymentMethod === 'wallet') {
                    $rate = $tx->walletrate ?? 0;
                    $walletrate_name = $wallets[$tx->wallet_id] ?? '';
                } elseif ($tx->paymentMethod === 'bank') {
                    $rate = $tx->bankRate ?? 0;
                    $walletrate_name = $banks[$tx->bank_id] ?? 'Bank';
                }
                $sending = (float) ($tx->sendingMoney ?? 0);
                $fee     = (float) ($tx->fee ?? 0);
                $report->push([
                    'sl'               => $sl++,
                    'id'               => $tx->id,
                    'pr_rate'          => $tx->pr_rate ?? 0,
                    'created_at'       => Carbon::parse($tx->created_at)->format('d-m-Y H:i'),
                    'senderName'       => ucfirst($tx->senderName ?? ''),
                    'beneficiaryName'  => $tx->beneficiaryName ?? '',
                    'paytMethod'       => ucfirst($tx->paymentMethod ?? ''),
                    'beneficiaryPhone' => $tx->beneficiaryPhone ?? '',
                    'agent_settlement' => $tx->agent_settlement ?? '',
                    'walletrate_name'  => $walletrate_name,
                    'walletrate'       => $rate,
                    'fee'              => $fee,
                    'receiving_money'  => $tx->receiving_money,
                    'sendingMoney'     => $sending,
                    'debit'            => number_format($sending + $fee, 2),
                    'credit'           => 0,
                ]);
            }
            if ($row['type'] === 'deposit') {
                $dep = $row['data'];
                $credit = (float) ($dep->amount_gbp ?? 0);
                $report->push([
                    'sl'               => $sl++,
                    'id'               => 0,
                    'created_at'       => Carbon::parse($dep->created_at)->format('d-m-Y H:i'),
                    'senderName'       => '',
                    'beneficiaryName'  => '',
                    'paytMethod'       => 'Deposit',
                    'beneficiaryPhone' => '',
                    'walletrate_name'  => '',
                    'walletrate'       => '',
                    'fee'              => '',
                    'receiving_money'  => '',
                    'sendingMoney'     => '',
                    'debit'            => 0,
                    'credit'           => $credit,
                ]);
            }
        }
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
