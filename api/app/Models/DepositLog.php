<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;

class DepositLog extends Authenticatable
{
    use HasFactory, Notifiable;


    public $table = "deposit_log";

    protected $fillable = [
        'deposit_id',
        'agent_id',
        'payment_method',
        'payment_date',
        'approval_status',
        'amount_gbp',
        'attachment',
        'entry_by',
        'type',
        'created_by',
        'update_by'
    ];
}
