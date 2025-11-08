<?php

namespace App\Http\Controllers\Api\Report;

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
use App\Models\User;
use App\Models\UserLog;
use App\Models\Wallet;

class ReportController extends Controller
{
    public function getByReportRate()
    {
        $settingData = Setting::find(1);
        $chkData = User::where('id', $settingData->update_by)->first();

        $data['update_by']              = $chkData->name ?? "";
        $data['update_date']            = date("d-M-Y", strtotime($settingData->updated_at));
        $data['sending_currency']       = $settingData->sending_currency ?? "";
        $data['receiving_currency']     = $settingData->receiving_currency ?? "";
        $data['exchange_rate_wallet']   = $settingData->exchange_rate_wallet ?? "";
        $data['exchange_rate_bank']     = $settingData->exchange_rate_bank ?? "";

        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }

    public function getByReportFee(Request $request)
    {

        $fromDate = $request->input('fromDate'); // e.g., "2025-11-01"
        $toDate   = $request->input('toDate');   // e.g., "2025-11-18"

        $logs = FeesLog::whereBetween('created_at', [
            $fromDate . ' 00:00:00',
            $toDate   . ' 23:59:59'
        ])->get();

        if ($logs->isEmpty()) {
            return response()->json([
                'data'    => [],
                'message' => 'No records found for the given date range.'
            ], 404);
        }

        return response()->json([
            'data'    => $logs,
            'message' => 'Success'
        ], 200);
    }


    public function getByReportLimit(Request $request)
    {
        $fromDate = $request->input('fromDate'); // e.g., "2025-11-01"
        $toDate   = $request->input('toDate');   // e.g., "2025-11-18"

        $logs     = LimitLog::whereBetween('created_at', [
            $fromDate . ' 00:00:00',
            $toDate   . ' 23:59:59'
        ])->get();

        if ($logs->isEmpty()) {
            return response()->json([
                'data'    => [],
                'message' => 'No records found for the given date range.'
            ], 404);
        }

        return response()->json([
            'data'    => $logs,
            'message' => 'Success'
        ], 200);
    }

    public function getByReportUser(Request $request)
    {
        $fromDate = $request->input('fromDate'); // e.g., "2025-11-01"
        $toDate   = $request->input('toDate');   // e.g., "2025-11-18"

        $logs     = UserLog::whereBetween('created_at', [
            $fromDate . ' 00:00:00',
            $toDate   . ' 23:59:59'
        ])->get();

        if ($logs->isEmpty()) {
            return response()->json([
                'data'    => [],
                'message' => 'No records found for the given date range.'
            ], 404);
        }

        return response()->json([
            'data'    => $logs,
            'message' => 'Success'
        ], 200);
    }
}
