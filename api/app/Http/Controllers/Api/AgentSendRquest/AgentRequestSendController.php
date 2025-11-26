<?php

namespace App\Http\Controllers\Api\AgentSendRquest;

use App\Http\Controllers\Controller;
use App\Models\Deposit;
use App\Models\DepositLog;
use App\Models\Roles;
use App\Models\RolesType;
use App\Models\Permission as ModelsPermission;
use App\Models\User;
use DB;
use File;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Contracts\Permission;
use Validator;

class AgentRequestSendController extends Controller
{
    public function index(Request $request)
    {

        $user = Auth::user();

        if (! $user->can('view deposit')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view deposit',
            ], 403);
        }
        $page            = $request->input('page', 1);
        $pageSize        = $request->input('pageSize', 10);
        $selectedFilter  = $request->selectedFilter;




        $query = Deposit::select(
            'deposit.*',
            'users.name as agent_name'
        )->leftJoin('users', 'users.id', '=', 'deposit.agent_id')
            ->where('deposit.agent_id', $user->id)
            ->orderBy('deposit.id', 'desc');


        if ($user->hasRole('admin')) {
            $query = Deposit::select('deposit.*', 'users.name as agent_name')
                ->leftJoin('users', 'users.id', '=', 'deposit.agent_id')
                ->orderBy('deposit.id', 'desc');
        } else if ($user->hasRole('agent')) {
            $query = Deposit::select('deposit.*', 'users.name as agent_name')
                ->leftJoin('users', 'users.id', '=', 'deposit.agent_id')
                ->where('deposit.agent_id', $user->id)
                ->orderBy('deposit.id', 'desc');
        }



        if ($selectedFilter !== null) {
            $query->where('deposit.approval_status', $selectedFilter);
        }

        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);


        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
            return [
                'id'              => $item->id,
                'payment_method'  => ucfirst($item->payment_method),
                'payment_date'    => $item->payment_date,
                'approval_status' => $item->approval_status,
                'amount_gbp'      => $item->amount_gbp,
                'agent_name'      => $item->agent_name,
                'attachment'      => $item->attachment ? url($item->attachment) : "",
            ];
        });

        if ($user->hasRole('admin')) {
            $sumApproved = Deposit::where('approval_status', 1)
                ->sum('amount_gbp');
        } else if ($user->hasRole('agent')) {
            $sumApproved = Deposit::where('approval_status', 1)
                ->where('agent_id', $user->id)
                ->sum('amount_gbp');
        }


        // Return the modified collection along with pagination metadata
        return response()->json([
            'data' => $modifiedCollection,
            'current_page' => $paginator->currentPage(),
            'total_approved_amount' => $sumApproved,
            'total_pages' => $paginator->lastPage(),
            'total_records' => $paginator->total(),
        ], 200);
    }

    public function store(Request $request)
    {

        //  dd($request->all());
        $user = Auth::user();
        if (! $user->can('create deposit')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create deposit',
            ], 403);
        }
        // Validate request
        $validator = Validator::make($request->all(), [
            'payment_method'    => 'required',
            'payment_date'      => 'required|date',
            'approval_status'   => 'required|integer',
            'amount_gbp'        => 'required',
            'attachment'        => 'nullable|file|mimes:jpg,jpeg,png,pdf',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Handle file upload
        $attachmentPath = null;

        if (! empty($request->file('attachment'))) {
            $files = $request->file('attachment');
            $fileName = Str::random(20);
            $ext = strtolower($files->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $files->move(public_path('/backend/files/'), $upload_url);
            $file_url = $uploadPath . $path;
            $attachmentPath = $file_url;
        }
        // Create deposit record
        $depositId = Deposit::create([
            'agent_id'        => $user->id,
            'payment_method'  => $request->payment_method,
            'payment_date'    => $request->payment_date,
            'approval_status' => 0, //$request->approval_status,
            'amount_gbp'      => $request->amount_gbp,
            'attachment'      => $attachmentPath,
        ]);

        DepositLog::create([
            'deposit_id'      => $depositId->id,
            'approval_status' => 0,
            'type'            => 'create',
            'agent_id'        => $user->id,
            'payment_method'  => $request->payment_method,
            'payment_date'    => $request->payment_date,
            'amount_gbp'      => $request->amount_gbp,
            'entry_by'        => $user->id,
            'created_by'      => $user->name,
            //'update_by'     => $user->name,
        ]);

        return response()->json([
            'message' => 'Deposit request submitted successfully',
        ], 201);
    }



    public function update(Request $request)
    {

        // dd($request->all());

        $id = $request->id;

        $user = Auth::user();
        if (! $user->can('edit deposit')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit deposit',
            ], 403);
        }
        // Validate Request
        $validator = Validator::make($request->all(), [
            'approval_status'  => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        Deposit::where('id', $id)->update([
            'approval_status'   => $request->approval_status,
            'entry_by'          => $user->id,
        ]);


        $checkDeposit = Deposit::find($request->id);


        DepositLog::create([
            'deposit_id'      => $request->id,
            'approval_status' => $checkDeposit->approval_status,
            'type'            => 'update',
            'agent_id'        => $checkDeposit->agent_id,
            'payment_method'  => $checkDeposit->payment_method,
            'payment_date'    => $checkDeposit->payment_date,
            'amount_gbp'      => $checkDeposit->amount_gbp,
            'attachment'      => $checkDeposit->attachment,
            'entry_by'        => $checkDeposit->entry_by,
            // 'created_by'      => $user->name,
            'update_by'     => $user->name,
        ]);

        return response()->json([
            'message' => 'updated successfully.'
        ], 200);
    }
}
