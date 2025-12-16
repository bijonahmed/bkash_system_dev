<?php

namespace App\Http\Controllers\Api\Wallet;

use App\Http\Controllers\Controller;
use App\Models\AssignWallet;
use App\Models\Roles;
use App\Models\RolesType;
use App\Models\Permission as ModelsPermission;
use App\Models\User;
use App\Models\Wallet;
use DB;
use File;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Contracts\Permission;
use Validator;

class WalletController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if (! $user->can('view wallet')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view wallet',
            ], 403);
        }
        $page         = $request->input('page', 1);
        $pageSize     = $request->input('pageSize', 10);
        $searchQuery  = $request->searchQuery;

        $query = Wallet::select('wallet.*')
            ->orderBy('id', 'desc');

        if ($searchQuery !== null) {
            $query->where('name', 'like', '%' . $searchQuery . '%');
        }

        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);
        $assignedWallets = AssignWallet::where('agent_id', $user->id)->get()->keyBy('wallet_id');

        $modifiedCollection = $paginator->getCollection()->map(function ($item) use ($user, $assignedWallets) {
            // Find assigned wallet for this specific item
            $wallet = $assignedWallets->get($item->id);

            return [
                'id'     => $item->id,
                'name'   => Str::title(Str::replace('_', ' ', $item->name)),
                'amount' => $user->role === 'admin'
                    ? $item->amount
                    : ($wallet ? $wallet->amount : $item->amount),
                'status' => $item->status,
            ];
        });
        // Return the modified collection along with pagination metadata
        return response()->json([
            'data' => $modifiedCollection,
            'current_page' => $paginator->currentPage(),
            'total_pages' => $paginator->lastPage(),
            'total_records' => $paginator->total(),
        ], 200);
    }
    public function getwalletAgent(Request $request)
    {
        $user = Auth::user();

        if (! $user->can('view wallet')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view wallet',
            ], 403);
        }

        $searchQuery  = $request->searchQuery;

        $query = AssignWallet::select('assign_wallet.*', 'wallet.name as wallet_name', 'users.name as agent_name')
            ->leftJoin('wallet', 'wallet.id', '=', 'assign_wallet.wallet_id')
            ->leftJoin('users', 'users.id', '=', 'assign_wallet.agent_id')
            ->orderBy('id', 'desc');

        if ($searchQuery !== null) {
            $query->where('users.name', 'like', '%' . $searchQuery . '%');
        }

        $collection = $query->get()->map(function ($item) {
            return [
                'id'            => $item->id,
                'wallet_id'     => $item->wallet_id ?? "",
                'agent_id'      => $item->agent_id ?? "",
                'wallet_name'   => $item->wallet_name ?? "",
                'agent_name'    => $item->agent_name ?? "",
                'amount'        => $item->amount ?? "",
            ];
        });

        return response()->json([
            'data' => $collection,
        ], 200);
    }

    public function store(Request $request)
    {

        $user = Auth::user();
        if (! $user->can('create wallet')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create wallet',
            ], 403);
        }
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name'          => 'required',
            'amount'        => 'required',
            'status'        => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [
            'name'          => $request->name,
            'status'        => 1,
        ];

        Wallet::insertGetId($data);

        $response = [
            'message' => 'Successfully insert:',
        ];
        return response()->json($response);
    }




    public function assignWallet(Request $request)
    {
        $user = Auth::user();

        if (! $user->can('create wallet')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create wallet',
            ], 403);
        }

        // VALIDATION
        $validator = Validator::make($request->all(), [
            'agent_id'  => 'required',
            'wallet_id' => 'required',
            'amount'    => 'required',
            'status'    => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // CHECK IF EXISTS
        $exists = AssignWallet::where('agent_id', $request->agent_id)
            ->where('wallet_id', $request->wallet_id)
            ->first();

        $data = [
            'agent_id'  => $request->agent_id,
            'wallet_id' => $request->wallet_id,
            'amount'    => $request->amount,
        ];

        //dd($data);

        // INSERT
        if (empty($request->id)) {
            if ($exists) {
                return response()->json([
                    'message' => 'This wallet is already assigned to this agent!',
                    'status'  => 'error'
                ], 409);
            }

            AssignWallet::create($data);

            return response()->json([
                'message' => 'Wallet Assigned Successfully',
                'status'  => 'success'
            ]);
        }

        // UPDATE
        if ($exists && $exists->id != $request->id) {
            return response()->json([
                'message' => 'Another record already exists with same Agent & Wallet!',
                'status'  => 'error'
            ], 409);
        }

        AssignWallet::where('id', $request->id)->update($data);

        return response()->json([
            'message' => 'Wallet Updated Successfully',
            'status'  => 'success'
        ]);
    }





    public function walletcalculateCheck(Request $request)
    {
        // dd($request->all());
        $wallet_id = $request->wallet_id;
        $user      = Auth::user();
        $agent_id  = $user->id;

        // Check general wallet and agent-specific wallet
        $chkGeneral = Wallet::where('id', $wallet_id)->first();
        $chkPoint   = AssignWallet::where('agent_id', $agent_id)
            ->where('wallet_id', $wallet_id)
            ->first();

        // Determine wallet rate
        if (!empty($chkPoint)) {
            $walletRate = $chkPoint->amount;
        } else {
            $walletRate = $chkGeneral ? $chkGeneral->amount : 0; // fallback to 0 if general wallet not found
        }

        // Return JSON response
        return response()->json([
            'walletrate' => $walletRate,
        ]);
        //dd($chkPoint);
    }


    public function update(Request $request)
    {

        $id = $request->id;

        $user = Auth::user();
        if (! $user->can('edit wallet')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit wallet',
            ], 403);
        }
        // Validate Request
        $validator = Validator::make($request->all(), [
            'name'      => 'required|unique:wallet,name,' . $id,
            'amount'    => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        // Update Role by Role ID, not User ID!
        Wallet::where('id', $id)->update([
            'name'      => $request->name,
            'amount'    => $request->amount,
        ]);

        return response()->json([
            'message' => 'Role updated successfully.'
        ], 200);
    }



    public function checkrow($id)
    {
        $data = Wallet::find($id);
        $response = [
            'data' => $data,
            'message' => 'success',
        ];
        return response()->json($response, 200);
    }


    public function destroy($id)
    {
        $user = Auth::user();

        if (! $user->can('delete wallet')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to delete wallet',
            ], 403);
        }

        $data = Roles::find($id);
        if (! $data) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }
        // $data->delete();
        return response()->json([
            'message' => 'Data deleted successfully',
            'id' => $id,
        ], 200);
    }


    public function deleteAgentRate($id)
    {

        $data = AssignWallet::find($id);
        if (! $data) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }
        $data->delete();
        return response()->json([
            'message' => 'Data deleted successfully',
            'id' => $id,
        ], 200);
    }


    
}
