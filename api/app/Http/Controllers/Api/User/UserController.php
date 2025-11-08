<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\ModelHasRole;
use App\Models\RolesType;
use App\Models\RuleModel;
use App\Models\User;
use App\Models\UserLog;
use DB;
use File;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Validator;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        //dd($user);
        if (! $user->can('view users')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view users',
            ], 403);
        }
        $page            = $request->input('page', 1);
        $pageSize        = $request->input('pageSize', 10);
        $searchQuery     = $request->searchQuery;
        $selectedFilter  = (int) $request->selectedFilter;
        $selectRulesType = (int) $request->selectRulesType;

        $query = User::orderBy('users.id', 'desc')->select('users.*');

        if ($searchQuery !== null) {
            $query->where('users.name', 'like', '%' . $searchQuery . '%');
        }

        if ($selectedFilter !== null) {
            $query->where('users.status', $selectedFilter);
        }


        if (!empty($selectRulesType) && $selectRulesType == 1) {
            $query->whereNull('users.role_type');
        }

        if (!empty($selectRulesType) && $selectRulesType == 2) {
            $query->where('users.role_type', $selectRulesType);
        }

        // $query->where('users.role_id', 1);
        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);
        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
            $status    = $item->status == 1 ? 'Active' : 'Inactive';
            $createdBy = User::where('id', $item->entry_by)->select('name')->first();

            $modelType = ModelHasRole::where('model_id', $item->id)->first();
            $roleName = $modelType
                ? ($modelType->role_id == 1
                    ? 'Admin'
                    : ($modelType->role_id == 2 ? 'Agent' : 'Admin'))
                : 'None';

            return [
                'id'            => $item->id,
                'name'          => $item->name,
                'rulename'      => $roleName,
                'email'         => $item->email,
                'phone_number'  => $item->phone_number,
                'show_password' => $item->show_password,
                'createdBy'     => $createdBy->name,
                'status'        => $status,
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
        if (! $user->can('create users')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create users',
            ], 403);
        }


        $validator = Validator::make($request->all(), [
            'rules_type'    => 'required',
            'name'          => 'required',
            'phone'         => 'required',
            'email'         => 'required|email',
            // 'email' => 'required|email|unique:users',
            'password'      => 'min:2|required_with:password_confirmation|same:password_confirmation',
            'password_confirmation' => 'min:2',
            // Conditional validation for Agent
            'agentCode'     => $request->rules_type == 2 ? 'required|string' : 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        // Assign agentCode only if rules_type == 2
        $agentCode = $request->rules_type == 2 ? $request->agentCode : null;
        // Current user ID (who is creating this user)
        $user_id = $user->id;

        $data = [
            'role_type'     => $request->rules_type,
            'name'          => $request->name,
            'address'       => $request->address ?? '',
            'phone_number'  => $request->phone,
            'email'         => $request->email,
            'agentCode'     => $agentCode,
            'password'      => !empty($request->password) ? Hash::make($request->password) : null,
            'status'        => $request->status,
            'entry_by'      => $user_id,
        ];

        if (! empty($request->file('file'))) {
            $files = $request->file('file');
            $fileName = Str::random(20);
            $ext = strtolower($files->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $files->move(public_path('/backend/files/'), $upload_url);
            $file_url = $uploadPath . $path;
            $data['image'] = $file_url;
        }
        if (empty($request->id)) {
            $userId = User::insertGetId($data);

            $rdata['role_id'] = $request->rules_type;
            $rdata['model_type'] = 'App\Models\User';
            $rdata['model_id'] = $userId;
            ModelHasRole::insert([$rdata]); // ✅ wrap in array


            $rulestype = RolesType::find($request->rules_type);
            // $walletCheck = Wallet::find($request->walletType);
            UserLog::create([
                'user_id'       => $userId,
                'type'          => 'create',
                'role_type'     => $rulestype->name,
                'name'          => $request->name,
                'address'       => $request->address ?? '',
                'phone_number'  => $request->phone,
                'email'         => $request->email,
                'agentCode'     => $agentCode,
                'password'      => !empty($request->password) ? Hash::make($request->password) : null,
                'status'        => $request->status,
                'created_by'    => $user->name,
                // 'update_by'     => $user->name,
            ]);
        } else {
            $userId = $request->id;
            User::where('id', $request->id)->update($data);
        }
        $response = [
            'message' => 'User register successfully insert UserID:' . $userId,
        ];
        return response()->json($response);
    }


    public function update(Request $request)
    {
      
        //dd($request->all());
        $user = Auth::user();
        if (! $user->can('edit users')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit users',
            ], 403);
        }
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name'   => 'required|max:255',
            'status' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user_id = $request->id;
        $user = User::find($user_id);

        $data['name']      = $request->name;
        $data['agentCode'] = $request->agentCode;
        $data['status']    = $request->status;


        if (! empty($request->phone_number)) {
            $data['phone_number'] = $request->phone_number;
        }

        // dd($data);
        if (! empty($request->file('file'))) {
            $files = $request->file('file');
            $fileName = Str::random(20);
            $ext = strtolower($files->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $files->move(public_path('/backend/files/'), $upload_url);
            $file_url = $uploadPath . $path;
            $data['image'] = $file_url;
        }


        if (!empty($request->agentCode) && $request->agentCode !== $user->agentCode) {
            $agentExists = User::where('agentCode', $request->agentCode)
                ->where('id', '!=', $user_id)
                ->exists();

            if (!$agentExists) {
                $data['agentCode'] = $request->agentCode;
            } else {
                $data['agentCode'] = $user->agentCode;
            }
        } else {
            $data['agentCode'] = $user->agentCode;
        }


        if (!empty($request->email) && $request->email !== $user->email) {
            $emailExists = User::where('email', $request->email)
                ->where('id', '!=', $user_id)
                ->exists();
            if (!$emailExists) {
                $data['email'] = $request->email;
            } else {
                $data['email'] = $user->email;
            }
        } else {
            $data['email'] = $user->email;
        }



        $rulestype = RolesType::find($request->rules_type);
          $userUpdate = Auth::user();
        // $walletCheck = Wallet::find($request->walletType);
        UserLog::create([
            'user_id'       => $user_id,
            'type'          => 'udpate',
            'role_type'     => $rulestype->name,
            'name'          => $request->name,
            'address'       => $request->address ?? '',
            'phone_number'  => $request->phone,
            'email'         => $request->email,
            'agentCode'     => $data['agentCode'],
            'status'        => $request->status,
            // 'created_by'    => $user->name,
            'update_by'     => $userUpdate->name,
        ]);


        User::where('id', $user_id)->update($data);
        $response = [
            'message' => 'User successfully update:',
        ];
        return response()->json($response);
    }

    public function editUserId($id)
    {
        $data = User::find($id);
        $response = [
            'data' => $data,
            'dataImg' => ! empty($data->image) ? url($data->image) : '',
            'doc_file' => ! empty($data->doc_file) ? url($data->doc_file) : '',
            'message' => 'success',
        ];
        return response()->json($response, 200);
    }

    public function roleCheck($id)
    {
        $data = User::checkRoleRow($id);
        $response = [
            'data' => $data,
            'message' => 'success',
        ];
        return response()->json($response, 200);
    }

    public function checkUserrow($id)
    {
        $userData = User::find($id);
        $response = [
            'data' => $userData,
            'message' => 'success',
        ];
        return response()->json($response, 200);
    }


    public function destroy($id)
    {
        $user = Auth::user();

        if (! $user->can('delete users')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to delete user',
            ], 403);
        }

        $data = User::find($id);
        if (! $data) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }
        // $data->delete();
        return response()->json([
            'message' => 'User deleted successfully',
            'id' => $id,
        ], 200);
    }


    public function updateUserProfileImg(Request $request)
    {
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            // 'file'    => 'required',
            'file' => 'required|image|mimes:jpeg,png,jpg,gif', // Adjust max file size as needed
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $userData = Helper::UserData();
        $user_id = $userData['userId'];
        if (! empty($request->file('file'))) {
            $files = $request->file('file');
            $fileName = Str::random(20);
            $ext = strtolower($files->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $files->move(public_path('/backend/files/'), $upload_url);
            $file_url = $uploadPath . $path;
            $data['image'] = $file_url;
            DB::table('users')->where('id', $user_id)->update($data);
            $response = [
                'dataImg' => ! empty($file_url) ? url($file_url) : '',
                'message' => 'success',
            ];
        } else {
            $response = [
                'dataImg' => '',
                'message' => 'failed',
            ];
        }
        return response()->json($response);
    }








    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'password' => 'min:2|required_with:password_confirmation|same:password_confirmation',
            'password_confirmation' => 'min:2',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $user = User::find($request->id);
        $user->password = Hash::make($request->password);
        $user->show_password = $request->password;
        $user->save();
        $response = 'Password successfully changed!';
        return response()->json($response);
    }
}
