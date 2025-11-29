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
        $modifiedCollection = $paginator->getCollection()->map(function ($item) {

            return [
                'id'            => $item->id,
                'name'          => Str::title(Str::replace('_', ' ', $item->name)),
                'amount'        => $item->amount,
                'status'        => $item->status,
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
            'status'    => 1,
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

    public function getRolesType()
    {
        try {
            $data = RolesType::all(); // Fetch all roles

            return response()->json([
                'data' => $data,
                'message' => 'success',
            ], 200);
        } catch (\Exception $e) {
            // Catch any error and send error response
            return response()->json([
                'message' => 'Something went wrong while fetching roles.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function checkRoleType(Request $request)
    {

        try {
            $roleType = $request->input('role_type');
            // Get all unique parent IDs
            $parentIds = ModelsPermission::pluck('parent_id')->unique()->filter(fn($id) => $id != 0);
            $result = [];

            foreach ($parentIds as $parentId) {
                // Get parent name
                $parent = ModelsPermission::find($parentId);
                $groupName = $parent ? $parent->name : 'Unknown Group';
                // Get permissions under this parent where role_type includes $roleType
                $permissions = ModelsPermission::where('parent_id', $parentId)
                    ->whereRaw("FIND_IN_SET(?, role_type)", [$roleType])
                    ->get(['id', 'name']); // ✅ important

                if ($permissions->count() > 0) {
                    $result[] = [
                        'group_name'  => $groupName,
                        'permissions' => $permissions
                    ];
                }
            }
            return response()->json([
                'message' => 'success',
                'data'    => $result
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong while fetching permissions.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
