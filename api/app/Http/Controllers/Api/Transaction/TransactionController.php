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

        $searchQuery = $request->searchQuery;
        $status      = $request->selectedFilter;

        $query = Transaction::select('transactions.*');

        // ⭐ Search by: beneficiaryName, phone, senderName, accountNo
        $query->when($searchQuery, function ($q) use ($searchQuery) {
            $q->where(function ($q) use ($searchQuery) {
                $q->where('beneficiaryName', 'like', "%$searchQuery%")
                    ->orWhere('beneficiaryPhone', 'like', "%$searchQuery%")
                    ->orWhere('senderName', 'like', "%$searchQuery%")
                    ->orWhere('accountNo', 'like', "%$searchQuery%");
            });
        });

        // ⭐ Filter by status
        $query->when($status, function ($q) use ($status) {
            $q->where('status', $status);
        });

        $results =  $query->orderBy('id', 'desc')->get();

        // Format output
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
                'created_at'       =>  Carbon::parse($item->created_at)
                    ->timezone('Asia/Dhaka') // set Bangladesh timezone
                    ->format('M d, Y h:i A'), // 12-hour format
            ];
        });

        // Return response
        return response()->json([
            'data' => $modifiedCollection,
        ], 200);
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

        // dd($data);

        $transaction      = Transaction::create($data);

        Transactionlog::create(array_merge($data, [
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

        $user = Auth::user();
        if (! $user->can('edit posts')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create posts',
            ], 403);
        }

        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'categoryId' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user_id = $user->id;
        // dd($user_id);

        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $request->input('name'))));
        $data = [
            'name' => $request->name,
            'slug' => $slug,
            'description_short' => ! empty($request->description_short) ? $request->description_short : '',
            'description_full' => ! empty($request->description_full) ? $request->description_full : '',
            'meta_title' => ! empty($request->meta_title) ? $request->meta_title : '',
            'meta_description' => ! empty($request->meta_description) ? $request->meta_description : '',
            'meta_keyword' => ! empty($request->meta_keyword) ? $request->meta_keyword : '',
            'categoryId' => ! empty($request->categoryId) ? $request->categoryId : '',
            'status' => ! empty($request->status) ? $request->status : '',
            'entry_by' => $user_id,
        ];
        // dd($data);
        if (! empty($request->file('files'))) {
            $files = $request->file('files');
            $fileName = Str::random(20);
            $ext = strtolower($files->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $files->move(public_path('/backend/files/'), $upload_url);
            $file_url = $uploadPath . $path;
            $data['thumnail_img'] = $file_url;
        }

        $data['id'] = $request->id;

        $post = PostModel::find($request->id);
        $post->update($data);
        $resdata['product_id'] = $post->id;

        return response()->json($resdata);
    }
}
