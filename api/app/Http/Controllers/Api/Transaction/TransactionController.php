<?php

namespace App\Http\Controllers\Api\Transaction;

use App\Http\Controllers\Controller;
use App\Models\Banks;
use App\Models\Branch;
use App\Models\Fees;
use App\Models\Post as PostModel;
use App\Models\PostCategory;
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

class TransactionController extends Controller
{
    public function index(Request $request)
    {


        $user = Auth::user();
        if (! $user->can('view users')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view posts',
            ], 403);
        }

        // dd($request->all());
        $beneficiaryName  = $request->input('beneficiaryName');
        $beneficiaryPhone = $request->input('beneficiaryPhone');
        $senderName       = $request->input('senderName');
        $accountNo        = $request->input('accountNo');
        $createdFrom      = $request->input('createdFrom');
        $createdTo        = $request->input('createdTo');
        $paymentMethod    = $request->input('paymentMethod');
        $wallet_id        = $request->input('wallet_id');
        $agent_id         = $request->input('agent_id');

        $status           = $request->input('status');
        $limit            = $request->input('limit', 50);
        $page             = $request->input('page', 1);

        $offset = ($page - 1) * $limit;

        $query = Transaction::query();


        if ($beneficiaryPhone) {
            $query->where('beneficiaryPhone', 'like', "%$beneficiaryPhone%");
        }
        if ($beneficiaryName) {
            $query->where('beneficiaryName', 'like', "%$beneficiaryName%");
        }
        if ($senderName) {
            $query->where('senderName', 'like', "%$senderName%");
        }
        if ($accountNo) {
            $query->where('accountNo', 'like', "%$accountNo%");
        }

        if ($createdFrom) {
            $query->whereDate('created_at', '>=', $createdFrom);
        }

        if ($createdTo) {
            $query->whereDate('created_at', '<=', $createdTo);
        }
        if ($paymentMethod) {
            $query->where('paymentMethod', $paymentMethod);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($wallet_id) {
            $query->where('wallet_id', $wallet_id);
        }

        if ($agent_id) {
            $query->where('agent_id', $agent_id);
        }

        $total = $query->count(); // total records

        $results = $query->orderBy('id', 'desc')
            ->skip($offset)
            ->take($limit)
            ->get();

        $modifiedCollection = $results->map(function ($item) {
            $chkuser   = User::find($item->entry_by);
            $chkwallet = Wallet::find($item->wallet_id);
            $chkbank   = Banks::find($item->bank_id);
            $chkBranch = Branch::find($item->branch_id);

            return [
                'id'               => $item->id,
                'beneficiaryName'  => $item->beneficiaryName,
                'beneficiaryPhone' => $item->beneficiaryPhone,
                'charges'          => $item->charges,
                'fee'              => $item->fee,
                'totalAmount'      => $item->totalAmount,
                'receiving_money'  => $item->receiving_money,
                'sendingMoney'     => $item->sendingMoney,
                'walletName'       => $chkwallet->name ?? '',
                'walletrate'       => $item->walletrate,
                'bankRate'         => $item->bankRate,
                'bankName'         => $chkbank->bank_name ?? '',
                'branchName'       => $chkBranch->branch_name ?? '',
                'branchCode'       => $chkBranch->branch_code ?? '',
                'accountNo'        => $item->accountNo ?? '',
                'description'      => $item->description ?? '',
                'agentsettlement'  => number_format((float)($item->sendingMoney ?? 0) + (float)($item->fee ?? 0), 2),
                'status'           => ucfirst($item->status),
                'paytMethod'       => $item->paymentMethod,
                'senderName'       => ucfirst($item->senderName),
                'paymentMethod'    => ucfirst($item->paymentMethod),
                'createdBy'        => $chkuser->name ?? 'N/A',
                'created_at'       => Carbon::parse($item->created_at)
                    ->timezone('Asia/Dhaka')
                    ->format('M d, Y h:i A'),
            ];
        });

        return response()->json([
            'data'       => $modifiedCollection,
            'total'      => $total,
            'page'       => $page,
            'last_page'  => ceil($total / $limit),
        ]);
    }

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
        // dd($request->all());
        $user = Auth::user();
        if (! $user->can('create users')) {
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
        $data['entry_by'] = $user->entry_by;

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

        if (! $user->can('delete posts')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to delete posts',
            ], 403);
        }

        $post = PostModel::find($id);
        if (! $post) {
            return response()->json([
                'message' => 'Post not found',
            ], 404);
        }
        // $post->delete();
        return response()->json([
            'message' => 'Post deleted successfully',
            'id' => $id,
        ], 200);
    }

    public function update(Request $request)
    {

        // dd($request->all());



        $user = Auth::user();
        // if (! $user->can('edit posts')) {
        //     return response()->json([
        //         'message' => 'Unauthorized: You do not have permission to create posts',
        //     ], 403);
        // }



        $user = Auth::user();
        if (! $user->can('create users')) {
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
        $data['entry_by'] = $user->entry_by;

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
