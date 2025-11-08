<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Fees;
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
use App\Models\FeesLog;
use App\Models\Limit;
use App\Models\LimitLog;
use App\Models\Wallet;

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
    public function updateRate(Request $request)
    {
        $user = Auth::user();
        if ($user->hasRole('admin')) {
            $validator = Validator::make($request->all(), [
                'exchange_rate_wallet'  => 'required',
                'exchange_rate_bank'    => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            $data = array(
                'exchange_rate_wallet'   => !empty($request->exchange_rate_wallet) ? $request->exchange_rate_wallet : "",
                'exchange_rate_bank'     => !empty($request->exchange_rate_bank) ? $request->exchange_rate_bank : "",
                'update_by'              => $user->id,
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
    public function upateSetting(Request $request)
    {
        //dd($request->all());
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
    public function createFee(Request $request)
    {
        $user = Auth::user();
        if ($user->hasRole('admin')) {
            $rules = [
                'paymentMethod' => 'required|string',
                'from_bdt'      => 'required|numeric|min:1',
                'to_bdt'        => 'required|numeric|min:1',
                'fee_gbp'       => 'required|numeric|min:1',
            ];
            $validator = Validator::make($request->all(), $rules);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            $newFee = Fees::create([
                'paymentMethod' => $request->paymentMethod,
                'from_bdt'      => $request->from_bdt,
                'to_bdt'        => $request->to_bdt,
                'fee_gbp'       => $request->fee_gbp,
                'created_by'    => $user->id, // optional audit
            ]);


            FeesLog::create([
                'fees_id'       => $newFee->id,
                'type'          => 'create',
                'paymentMethod' => $request->paymentMethod,
                'from_bdt'      => $request->from_bdt,
                'to_bdt'        => $request->to_bdt,
                'fee_gbp'       => $request->fee_gbp,
                'created_by'    => $user->name,
            ]);

            return response()->json([
                'message' => 'Successfully added!',
            ], 201);
            return response()->json($response);
        } else {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to update settings',
            ], 403);
        }
    }
    public function createLimit(Request $request)
    {
        $user = Auth::user();
        if ($user->hasRole('admin')) {
            $rules = [
                'paymentMethod' => 'required|string',
                'maxLimit'      => 'required|numeric|min:1',
            ];
            if ($request->paymentMethod === 'Wallet') {
                $rules['walletType'] = 'required|string';
            } else {
                // Bank selected → walletType not required
                $rules['walletType'] = 'nullable|string';
            }
            $validator = Validator::make($request->all(), $rules);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            $exists = Limit::where('paymentMethod', $request->paymentMethod)
                ->where('walletTypeId', $request->walletType)
                ->exists();
            if ($exists) {
                return response()->json([
                    'message' => 'Duplicate entry: this Payment Method and Wallet Type already exist.',
                ], 409); // 409 = Conflict
            }

            $limit = Limit::create([
                'paymentMethod' => $request->paymentMethod,
                'walletTypeId'  => $request->walletType,
                'maxLimit'      => $request->maxLimit,
                'created_by'    => $user->id, // optional audit
            ]);

            $walletCheck = Wallet::find($request->walletType);
            //  dd($walletCheck->name);

            LimitLog::create([
                'limit_id'      => $limit->id,
                'type'          => 'create',
                'paymentMethod' => $request->paymentMethod,
                'walletTypeId'  => $walletCheck->name ?? "",
                'maxLimit'      => $request->maxLimit,
                'created_by'    => $user->name,
            ]);


            return response()->json([
                'message' => 'Successfully added!',
                'data'    => $limit,
            ], 201);
            return response()->json($response);
        } else {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to update settings',
            ], 403);
        }
    }
    public function updateFees(Request $request, $id)
    {
        $user = Auth::user();
        $chkedData = Fees::findOrFail($id);
        $rules = [
            'paymentMethod' => 'required|string',
            'from_bdt'      => 'required|numeric|min:1',
            'to_bdt'        => 'required|numeric|min:1',
            'fee_gbp'       => 'required|numeric|min:1',
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $chkedData->update([
            'paymentMethod'  => $request->paymentMethod,
            'from_bdt'       => $request->from_bdt,
            'to_bdt'         => $request->to_bdt,
            'fee_gbp'        => $request->fee_gbp,
            'update_by'      => $user->id, // optional audit
        ]);

        FeesLog::create([
            'fees_id'       => $chkedData->id,
            'type'          => 'update',
            'paymentMethod' => $chkedData->paymentMethod,
            'from_bdt'      => $chkedData->from_bdt,
            'to_bdt'        => $chkedData->to_bdt,
            'fee_gbp'       => $chkedData->fee_gbp,
            'update_by'     => $user->name,
        ]);




        return response()->json(['message' => 'Fees updated successfully']);
    }
    public function updateLimit(Request $request, $id)
    {
        $user  = Auth::user();
        $limit = Limit::findOrFail($id);
        $rules = [
            'paymentMethod' => 'required',
            'maxLimit'      => 'required|numeric|min:1',
        ];
        // Conditional validation using if…else
        if ($request->paymentMethod === 'Wallet') {
            $rules['walletType'] = 'required';
        } else {
            // Bank selected → walletType not required
            $rules['walletType'] = 'nullable';
        }
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $limit->update([
            'paymentMethod'  => $request->paymentMethod,
            'walletTypeId'   => $request->walletType,
            'maxLimit'       => $request->maxLimit,
        ]);

        $walletCheck = Wallet::find($request->walletType);
        LimitLog::create([
            'limit_id'      => $id,
            'type'          => 'update',
            'paymentMethod' => $request->paymentMethod,
            'walletTypeId'  => $walletCheck->name ?? "",
            'maxLimit'      => $request->maxLimit,
            'update_by'     => $user->name,
        ]);


        return response()->json(['message' => 'Limit updated successfully']);
    }
    public function getLimits()
    {
        $limits = Limit::select(
            'limits.*',
            'users.name as created_by_name'
        )
            ->leftJoin('users', 'users.id', '=', 'limits.created_by')
            ->get();
        return response()->json([
            'data' => $limits,
            'message' => 'success',
        ]);
    }
    public function getFees()
    {
        $limits = Fees::select(
            'fees.*',
            'users.name as created_by_name'
        )
            ->leftJoin('users', 'users.id', '=', 'fees.created_by')
            ->get();
        return response()->json([
            'data' => $limits,
            'message' => 'success',
        ]);
    }
    public function getwallet()
    {
        $data = Wallet::where('status', 1)->get();
        return response()->json([
            'data' => $data,
            'message' => 'success',
        ]);
    }
}
