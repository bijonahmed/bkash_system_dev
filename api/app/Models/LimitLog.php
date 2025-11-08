<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;

class LimitLog extends Authenticatable
{
    use HasFactory, Notifiable;


    public $table = "limits_log";

    protected $fillable = [
        'limit_id',
        'paymentMethod',
        'walletTypeId',
        'maxLimit',
        'type',
        'created_by',
        'update_by'

    ];
}
