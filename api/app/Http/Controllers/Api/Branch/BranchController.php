<?php

namespace App\Http\Controllers\Api\Branch;

use App\Http\Controllers\Controller;
use App\Models\Banks;
use App\Models\Branch;
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

class BranchController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if (! $user->can('view branch')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view bank',
            ], 403);
        }
        $page         = $request->input('page', 1);
        $pageSize     = $request->input('pageSize', 10);
        $searchQuery  = $request->searchQuery;

        $query = Branch::select('branches.*')
            ->orderBy('id', 'desc');

        if ($searchQuery !== null) {
            $query->where('name', 'like', '%' . $searchQuery . '%');
        }

        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);
        $modifiedCollection = $paginator->getCollection()->map(function ($item) {

            $chkBank = Banks::find($item->bank_id);

            return [
                'id'            => $item->id,
                'bank_name'     => $chkBank->bank_name ?? '',
                'branch_name'   => $item->branch_name,
                'branch_code'   => $item->branch_code,
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
        if (! $user->can('create branch')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create branch',
            ], 403);
        }
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'bank_id'         => 'required',
            'branch_name'     => 'required',
            'branch_code'     => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [
            'bank_id'          => $request->bank_id,
            'branch_name'      => $request->branch_name,
            'branch_code'      => $request->branch_code,
            'phone'            => $request->phone,
            'address'          => $request->address,
            'status'           => $request->status,
        ];

        Branch::insertGetId($data);

        $response = [
            'message' => 'Successfully insert:',
        ];
        return response()->json($response);
    }


    public function update(Request $request)
    {

        $id = $request->id;

        $user = Auth::user();
        if (! $user->can('edit branch')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit bank',
            ], 403);
        }
        // Validate Request
        $validator = Validator::make($request->all(), [
            'bank_id'         => 'required',
            'branch_name'     => 'required',
            'branch_code'     => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update Role by Role ID, not User ID!
        Branch::where('id', $id)->update([
            'bank_id'          => $request->bank_id,
            'branch_name'      => $request->branch_name,
            'branch_code'      => $request->branch_code,
            'phone'            => $request->phone,
            'address'          => $request->address,
            'status'           => $request->status,
        ]);

        return response()->json([
            'message' => 'Updated successfully.'
        ], 200);
    }



    public function checkrow($id)
    {
        $data = Branch::find($id);
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
                'message' => 'Unauthorized: You do not have permission to delete',
            ], 403);
        }

        $data = Branch::find($id);
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
}
