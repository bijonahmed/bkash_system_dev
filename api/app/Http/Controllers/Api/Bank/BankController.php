<?php

namespace App\Http\Controllers\Api\Bank;

use App\Http\Controllers\Controller;
use App\Models\Banks;
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

class BankController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if (! $user->can('view bank')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view bank',
            ], 403);
        }
        $page         = $request->input('page', 1);
        $pageSize     = $request->input('pageSize', 10);
        $searchQuery  = $request->searchQuery;

        $query = Banks::select('banks.*')
            ->orderBy('id', 'desc');

        if ($searchQuery !== null) {
            $query->where('name', 'like', '%' . $searchQuery . '%');
        }

        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);
        $modifiedCollection = $paginator->getCollection()->map(function ($item) {

            return [
                'id'            => $item->id,
                'name'          => Str::title(Str::replace('_', ' ', $item->bank_name)),
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
        if (! $user->can('create bank')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create bank',
            ], 403);
        }
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name'          => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [
            'bank_name'      => $request->name,
            'status'        => 1,
        ];

        Banks::insertGetId($data);

        $response = [
            'message' => 'Successfully insert:',
        ];
        return response()->json($response);
    }


    public function update(Request $request)
    {

        $id = $request->id;

        $user = Auth::user();
        if (! $user->can('edit bank')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit bank',
            ], 403);
        }
        // Validate Request
        $validator = Validator::make($request->all(), [
            'bank_name'  => 'required|unique:banks,bank_name,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        // Update Role by Role ID, not User ID!
        Banks::where('id', $id)->update([
            'bank_name'      => $request->bank_name,
        ]);

        return response()->json([
            'message' => 'Updated successfully.'
        ], 200);
    }



    public function checkrow($id)
    {
        $data = Banks::find($id);
        $response = [
            'data' => $data,
            'message' => 'success',
        ];
        return response()->json($response, 200);
    }


    public function destroy($id)
    {
        $user = Auth::user();

        if (! $user->can('delete bank')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to delete bank',
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

     

    
}
