<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Setting;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'User created successfully']);
    }

    public function login(Request $request)
    {

        try {
            // Include 'status' in the credentials
            $credentials = $request->only('email', 'password');
            $credentials['status'] = 1; // ✅ only allow active users

            if (!$token = auth()->attempt($credentials)) {
                return response()->json(['error' => 'Invalid Credentials or Inactive Account'], 401);
            }

            $user = Auth::user();

            return response()->json([
                'token' => $token,
                'user' => $user,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }


    public function profile()
    {

        $user = Auth::user();

        return response()->json([
            'user' => $user,
            'roles' => $user->getRoleNames(),   // Spatie Roles
            'permissions' => $user->getAllPermissions()->pluck('name'),  // Spatie Permissions
        ]);
    }

    public function updateProfile(Request $request)
    {
        // dd($request->all());
        $user = Auth::user();
        $authId = $user->id;

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required',
            'phone_number' => 'required',
            'address' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = [
            'id'             => $authId,
            'name'           => ! empty($request->name) ? $request->name : '',
            'email'          => ! empty($request->email) ? $request->email : '',
            'phone_number'   => ! empty($request->phone_number) ? $request->phone_number : '',
            'address'        => ! empty($request->address) ? $request->address : '',
            'website'        => ! empty($request->website) ? $request->website : '',
            'github'         => ! empty($request->github) ? $request->github : '',
            'twitter'        => ! empty($request->twitter) ? $request->twitter : '',
            'instagram'      => ! empty($request->instagram) ? $request->instagram : '',
            'facebook'       => ! empty($request->facebook) ? $request->facebook : '',
        ];
        if (! empty($request->file('file'))) {
            $documents = $request->file('file');
            $fileName = Str::random(20);
            $ext = strtolower($documents->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $documents->move(public_path('/backend/files/'), $upload_url);
            $data['image'] = $upload_url;
        }
        // dd($data);
        User::where('id', $authId)->update($data);
        $response = [
            'imagelink' => ! empty($user) ? url($user->image) : '',
            'message' => 'User successfully update',
        ];

        return response()->json($response);
    }


    public function changePassword(Request $request)
    {
        try {
            $request->validate([
                'user_id'  => 'required|exists:users,id',
                'password' => 'required|string|min:3',
            ]);

            $user = User::find($request->user_id);

            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not found'
                ], 404);
            }

            $user->password = Hash::make($request->password);
            $user->save();

            return response()->json([
                'status'  => true,
                'message' => 'Password updated successfully',
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => false,
                'error'  => $e->getMessage(),
            ], 500);
        }
    }
}
