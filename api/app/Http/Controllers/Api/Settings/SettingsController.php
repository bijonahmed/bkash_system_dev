<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use DB;
use File;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Contracts\Permission;
use Validator;
use App\Helpers\PermissionHelper;

class SettingsController extends Controller
{

    public function settingrow()
    {


        $data = Setting::find(1);
        $data['qa_pages_meta_description'] = $data['q&a_pages_meta_description'];
        $data['qa_pages_meta_keywords']    = $data['q&a_pages_meta_keywords'];
        $response = [
            'data' => $data,
            'message' => 'success'
        ];

        return response()->json($response, 200);
    }


    public function upateSetting(Request $request)
    {
        $user = Auth::user();
        if ($user->hasRole('admin')) {

            $validator = Validator::make($request->all(), [
                'name'        => 'required',
                'email'       => 'required',

            ]);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            $data = array(
                'name'              => !empty($request->name) ? $request->name : "",
                'email'             => !empty($request->email) ? $request->email : "",
                'address'           => !empty($request->address) ? $request->address : "",
                'whatsApp'          => !empty($request->whatsApp) ? $request->whatsApp : "",
                'description'       => !empty($request->description) ? $request->description : "",
                'copyright'         => !empty($request->copyright) ? $request->copyright : "",
                'currency'          => !empty($request->currency) ? $request->currency : "",
                'fblink'            => !empty($request->fblink) ? $request->fblink : "",
                'website'           => !empty($request->website) ? $request->website : "",
                'telegram'          => !empty($request->telegram) ? $request->telegram : "",
            );

            //dd($data);
            Setting::where('id', 1)->update($data);

            $response = [
                'message' => 'Successfull',
            ];
            return response()->json($response);
        } else {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to update settings',
            ], 403);
        }
    }
}
