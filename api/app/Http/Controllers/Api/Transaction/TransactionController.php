<?php
namespace App\Http\Controllers\Api\Transaction;
use App\Http\Controllers\Controller;
use App\Models\AdminFundDeposit;
use App\Models\Banks;
use App\Models\Branch;
use App\Models\Deposit;
use App\Models\Fees;
use App\Models\Post as PostModel;
use App\Models\PostCategory;
use App\Models\Setting;
use App\Models\Transaction;
use App\Models\Transactionlog;
use App\Models\User;
use App\Models\Wallet;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user->can('view transaction')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $filters = $request->only([
            'beneficiaryName',
            'beneficiaryPhone',
            'senderName',
            'accountNo',
            'createdFrom',
            'createdTo',
            'transection_status',
            'paymentMethod',
            'wallet_id',
            'agent_id',
            'days',
            'status'
        ]);
        // $limit = $request->input('limit', 50);
        // $page  = $request->input('page', 1);
        $days  = $request->input('days', null);
        //$offset = ($page - 1) * $limit;
        // Base query
        $query = Transaction::query();
        // Role-based access
        if ($user->hasRole('agent')) {
            $query->where('agent_id', $user->id);
        }
        $defaultFrom = Carbon::yesterday()->startOfDay()->toDateTimeString();
        $defaultTo   = Carbon::today()->endOfDay()->toDateTimeString();
        // Apply filters efficiently
        if (!empty($filters['beneficiaryPhone'])) $query->where('beneficiaryPhone', 'like', $filters['beneficiaryPhone'] . '%');
        if (!empty($filters['beneficiaryName'])) $query->where('beneficiaryName', 'like', $filters['beneficiaryName'] . '%');
        if (!empty($filters['senderName'])) $query->where('senderName', 'like', $filters['senderName'] . '%');
        if (!empty($filters['accountNo'])) $query->where('accountNo', 'like', $filters['accountNo'] . '%');
        $createdFrom = !empty($filters['createdFrom'])
            ? Carbon::parse($filters['createdFrom'])->startOfDay()->toDateTimeString()
            : $defaultFrom;
        $createdTo = !empty($filters['createdTo'])
            ? Carbon::parse($filters['createdTo'])->endOfDay()->toDateTimeString()
            : $defaultTo;
        $query->where('created_at', '>=', $createdFrom)
            ->where('created_at', '<=', $createdTo);
        //if (!empty($filters['createdFrom'])) $query->where('created_at', '>=', $filters['createdFrom'] . ' 00:00:00');
        //if (!empty($filters['createdTo'])) $query->where('created_at', '<=', $filters['createdTo'] . ' 23:59:59');
        if (!empty($filters['paymentMethod'])) $query->where('paymentMethod', $filters['paymentMethod']);
        if (!empty($filters['status'])) $query->where('status', $filters['status']);
        if (!empty($filters['wallet_id'])) $query->where('wallet_id', $filters['wallet_id']);
        if (!empty($filters['agent_id'])) $query->where('agent_id', $filters['agent_id']);
        if (isset($filters['transection_status'])) $query->where('transection_status', $filters['transection_status']);
        if ($days !== null) {
            if ($days == 1) {
                $query->whereBetween('created_at', [now()->startOfDay(), now()->endOfDay()]);
            } else {
                $query->where('created_at', '>=', now()->subDays($days)->startOfDay());
                $query->where('created_at', '<=', now()->endOfDay());
            }
        }
        // Total count (simple)
        $total = $query->count();
        // Eager load relationships (instead of leftJoin)
        $transactions = $query->with(['creator:id,name', 'wallet:id,name', 'bank:id,bank_name', 'branch:id,branch_name,branch_code'])
            ->orderByDesc('id')
            // ->offset($offset)
            //   ->limit($limit)
            ->get();
        // Map results with minimal PHP processing
        $modifiedCollection = $transactions->map(function ($item) {
            $wallet  = $item->wallet;
            $bank    = $item->bank;
            $branch  = $item->branch;
            $creator = $item->creator;
            $sending = $item->sendingMoney ?? 0;
            $fee     = $item->fee ?? 0;
            return [
                'id'                 => $item->id,
                'beneficiaryName'    => $item->beneficiaryName,
                'beneficiaryPhone'   => $item->beneficiaryPhone,
                'charges'            => $item->charges,
                'fee'                => $fee,
                'totalAmount'        => $item->totalAmount,
                'receiving_money'    => $item->receiving_money,
                'sendingMoney'       => $sending,
                'walletName'         => $wallet->name ?? '',
                'walletrate'         => $item->walletrate,
                'bankRate'           => $item->bankRate,
                'bankName'           => $bank->bank_name ?? '',
                'branchName'         => $branch->branch_name ?? '',
                'branchCode'         => $branch->branch_code ?? '',
                'accountNo'          => $item->accountNo,
                'description'        => $item->description,
                'agentsettlement'    => $sending + $fee,
                'status'             => ucfirst($item->status),
                'paymentMethod'      => $item->paymentMethod,
                'senderName'         => ucfirst($item->senderName),
                'transection_status' => $item->transection_status,
                'createdBy'          => $creator->name ?? 'N/A',
                'created_at'         => $item->created_at
                    ->timezone('Asia/Dhaka')
                    ->format('M d, Y h:i A'),
            ];
        });
        // Aggregate sums (single query each)
        $agentSettlement = Transaction::selectRaw('SUM(sendingMoney + fee) as total')
            ->where('status', '!=', 'cancel')
            ->when(
                $user->hasRole('agent'),
                fn($q) =>
                $q->where('agent_id', $user->id)
            )
            ->value('total') ?? 0;
        $sumDepositApproved = Deposit::where('approval_status', 1)
            ->when(
                $user->hasRole('agent'),
                fn($q) =>
                $q->where('agent_id', $user->id)
            )
            ->sum('amount_gbp');
        $getBalance = $user->hasRole('agent')
            ? ($sumDepositApproved - $agentSettlement)
            : ($agentSettlement - $sumDepositApproved);
        return response()->json([
            'data' => $modifiedCollection,
            'sumDepositApproved' => number_format($getBalance, 2),
            'total' => $total,
            //   'page' => $page,
            // 'last_page' => ceil($total / $limit),
        ]);
    }
    /*
    public function index(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('view transaction')) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }
        $filters = $request->only([
            'beneficiaryName',
            'beneficiaryPhone',
            'senderName',
            'accountNo',
            'createdFrom',
            'createdTo',
            'transection_status',
            'paymentMethod',
            'wallet_id',
            'agent_id',
            'status'
        ]);
        $limit = $request->input('limit', 50);
        $page  = $request->input('page', 1);
        $offset = ($page - 1) * $limit;
        // Base query with joins
        $query = Transaction::leftJoin('users as creators', 'transactions.entry_by', '=', 'creators.id')
            ->leftJoin('wallet', 'transactions.wallet_id', '=', 'wallet.id')
            ->leftJoin('banks', 'transactions.bank_id', '=', 'banks.id')
            ->leftJoin('branches', 'transactions.branch_id', '=', 'branches.id')
            //->where('transection_status',1)
            ->select([
                'transactions.*',
                'creators.name as createdBy',
                'wallet.name as walletName',
                'banks.bank_name as bankName',
                'branches.branch_name as branchName',
                'branches.branch_code as branchCode'
            ]);
        // Role-based access
        if ($user->hasRole('agent')) {
            $query->where('transactions.agent_id', $user->id);
        }
        // Apply filters dynamically
        if (!empty($filters['beneficiaryPhone'])) $query->where('beneficiaryPhone', 'like', "%{$filters['beneficiaryPhone']}%");
        if (!empty($filters['beneficiaryName'])) $query->where('beneficiaryName', 'like', "%{$filters['beneficiaryName']}%");
        if (!empty($filters['senderName'])) $query->where('senderName', 'like', "%{$filters['senderName']}%");
        if (!empty($filters['accountNo'])) $query->where('accountNo', 'like', "%{$filters['accountNo']}%");
        if (!empty($filters['createdFrom'])) $query->whereDate('transactions.created_at', '>=', $filters['createdFrom']);
        if (!empty($filters['createdTo'])) $query->whereDate('transactions.created_at', '<=', $filters['createdTo']);
        if (!empty($filters['paymentMethod'])) $query->where('paymentMethod', $filters['paymentMethod']);
        if (!empty($filters['status'])) $query->where('status', $filters['status']);
        if (!empty($filters['wallet_id'])) $query->where('wallet_id', $filters['wallet_id']);
        if (!empty($filters['agent_id'])) $query->where('agent_id', $filters['agent_id']);
        if (isset($filters['transection_status'])) {
            $query->where('transection_status', $filters['transection_status']);
        }
        $total = $query->count();
        $results = $query->orderByDesc('transactions.id')
            ->offset($offset)
            ->limit($limit)
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
                'paytMethod'            => $item->paymentMethod,
                'transection_status'    => $item->transection_status,
                'status'                => ucfirst($item->status),
                'senderName'            => ucfirst($item->senderName),
                'paymentMethod'         => ucfirst($item->paymentMethod),
                'createdBy'             => $item->createdBy ?? 'N/A',
                'created_at'            => Carbon::parse($item->created_at)
                    ->timezone('Asia/Dhaka')
                    ->format('M d, Y h:i A'),
            ];
        });
        if ($user->hasRole('agent')) {
            $agentSettlement = Transaction::selectRaw('SUM(sendingMoney + fee) as total')->where('agent_id', $user->id)
                ->value('total');
            $sumDepositApproved = Deposit::where('agent_id', $user->id)->where('approval_status', 1)->sum('amount_gbp');
            $getBalance = $sumDepositApproved - $agentSettlement;
        }
        if ($user->hasRole('admin')) {
            $agentSettlement = Transaction::selectRaw('SUM(sendingMoney + fee) as total')->value('total');
            $depositQuery = Deposit::where('approval_status', 1);
            $sumDepositApproved = $depositQuery->sum('amount_gbp');
            $getBalance = $agentSettlement - $sumDepositApproved;
        }
        return response()->json([
            'data' => $modifiedCollection,
            'sumDepositApproved' => number_format($getBalance, 2),
            'total' => $total,
            'page' => $page,
            'last_page' => ceil($total / $limit),
        ]);
    }
*/
    public function checkrow($id)
    {
        $data = Transaction::find($id);
        if ($data->paymentMethod === 'wallet') {
            $data->branch = [];
        } else {
            $data->branch = Branch::where('bank_id', $data->bank_id)->get();
            $branchCode = Branch::where('id', $data->branch_id)->first();
            $data->branch_code = $branchCode ? $branchCode->branch_code : '';
        }
        //dd($data);
        $response = [
            'data' => $data,
            'message' => 'success',
        ];
        return response()->json($response, 200);
    }
    public function store(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('create transaction')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create transactions',
            ], 403);
        }
        $validator = Validator::make($request->all(), [
            'beneficiaryName'       => 'required',
            'beneficiaryPhone'      => 'required',
            // 'status'                => 'required',
            'paymentMethod'         => 'required',
            // Conditional validations
            'wallet_id'             => 'required_if:paymentMethod,wallet',
            'walletrate'            => 'required_if:paymentMethod,wallet',
            'bank_id'               => 'required_if:paymentMethod,bank',
            'branchCode'            => 'required_if:paymentMethod,bank',
            'accountNo'             => 'required_if:paymentMethod,bank',
            'bankRate'              => 'required_if:paymentMethod,bank',
            'receiving_money'       => 'required',
            'fee'                   => 'required',
            'totalAmount'           => 'required',
            'senderName'            => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = $request->only([
            'beneficiaryName',
            'beneficiaryPhone',
            'status',
            'paymentMethod',
            'wallet_id',
            'bank_id',
            'branch_id',
            'branchCode',
            'accountNo',
            'sendingMoney',
            'walletrate',
            'bankRate',
            'charges',
            'fee',
            'totalAmount',
            'senderName',
            'receiving_money',
            'description',
        ]);
        $data['entry_by'] = $user->id;
        $data['agent_id'] = $user->id;
        $data['status'] = "unpaid";
        $chkAdminFund = AdminFundDeposit::where('status', 1)->orderBy('id', 'desc')->first();
        $data['admin_fund_deposit_id'] = !empty($chkAdminFund) ? $chkAdminFund->id : "";
        $data['admin_buying_rate']     = !empty($chkAdminFund) ? $chkAdminFund->buying_rate : "";
        //dd($data);
        $transaction      = Transaction::create($data);
        Transactionlog::create(array_merge($data, [
            'type' => 'create',
            'transaction_id' => $transaction->id,
        ]));
        return response()->json([
            'success' => true,
            'message' => 'Transaction created successfully',
            'data' => $transaction
        ]);
    }
    public function updateStatusForTransaction(Request $request)
    {
        $validated = $request->validate([
            'id'     => 'required|integer|exists:transactions,id',
            'status' => 'required',
        ]);
        $transaction = Transaction::find($validated['id']);
        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found'
            ], 404);
        }
        // ✅ Update status
        $transaction->status = $validated['status'];
        $transaction->save();
        return response()->json([
            'success' => true,
            'message' => 'Transaction status updated successfully',
            'data' => $transaction
        ]);
    }
    public function walletcalculate(Request $request)
    {
        $receiving_money = $request->receiving_money ? $request->receiving_money : 0;
        $paymentMethod   = $request->paymentMethod ? $request->paymentMethod : "";
        $chkValues       = Fees::where('paymentMethod', $paymentMethod)->get();
        $fee_gbp = 0; // default
        foreach ($chkValues as $v) {
            if ($receiving_money >= $v->from_bdt && $receiving_money <= $v->to_bdt) {
                $fee_gbp = $v->fee_gbp;
                break;
            }
        }
        return response()->json([
            'fee' => $fee_gbp
        ]);
    }
    public function postrow($id)
    {
        $data = PostModel::where('posts.id', $id)
            ->select('posts.*', 'post_category.name as category_name')
            ->join('post_category', 'posts.categoryId', '=', 'post_category.id')
            ->first();
        $responseData['data'] = $data;
        $responseData['images'] = ! empty($data->thumnail_img) ? url($data->thumnail_img) : '';
        return response()->json($responseData);
    }
    public function destroy($id)
    {
        $user = Auth::user();
        if (! $user->can('delete transaction')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to delete transaction',
            ], 403);
        }
        $transaction = Transaction::find($id);
        if (! $transaction) {
            return response()->json([
                'message' => 'Transaction not found',
            ], 404);
        }
        $transaction->transection_status = 0;
        $transaction->save();
        return response()->json([
            'message' => 'Transaction deleted successfully',
            'id' => $id,
        ], 200);
    }
    public function restoreTransaction($id)
    {
        $user = Auth::user();
        if (! $user->can('delete transaction')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to delete transaction',
            ], 403);
        }
        $transaction = Transaction::find($id);
        if (! $transaction) {
            return response()->json([
                'message' => 'Transaction not found',
            ], 404);
        }
        $transaction->transection_status = 1;
        $transaction->save();
        return response()->json([
            'message' => 'Transaction restore successfully',
            'id' => $id,
        ], 200);
    }
    public function update(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('create transaction')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create transactions',
            ], 403);
        }
        $validator = Validator::make($request->all(), [
            'beneficiaryName'       => 'required',
            'beneficiaryPhone'      => 'required',
            'status'                => 'required',
            'paymentMethod'         => 'required',
            // Conditional validations
            'wallet_id'             => 'required_if:paymentMethod,wallet',
            'walletrate'            => 'required_if:paymentMethod,wallet',
            'bank_id'               => 'required_if:paymentMethod,bank',
            'branchCode'            => 'required_if:paymentMethod,bank',
            'accountNo'             => 'required_if:paymentMethod,bank',
            'bankRate'              => 'required_if:paymentMethod,bank',
            'receiving_money'       => 'required',
            'fee'                   => 'required',
            'totalAmount'           => 'required',
            'senderName'            => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = $request->only([
            'beneficiaryName',
            'beneficiaryPhone',
            'status',
            'paymentMethod',
            'wallet_id',
            'bank_id',
            'branch_id',
            'branchCode',
            'accountNo',
            'sendingMoney',
            'walletrate',
            'bankRate',
            'charges',
            'fee',
            'totalAmount',
            'senderName',
            'receiving_money',
            'description',
        ]);
        //$data['entry_by'] = $user->entry_by;
        $transaction_id = (int)$request->input('transaction_id');
        //dd($transaction_id);
        Transaction::where('id', $transaction_id)->update($data);
        Transactionlog::create(array_merge($data, [
            'type' => 'update',
            'transaction_id' => $transaction_id,
        ]));
        return response()->json([
            'success' => true,
            'message' => 'Transaction update successfully',
        ]);
    }
}
