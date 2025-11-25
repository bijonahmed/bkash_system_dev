<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;

class Deposit extends Authenticatable
{
    use HasFactory, Notifiable;


    public $table = "deposit";
 
    protected $fillable = [
        'agent_id',
        'payment_method',
        'payment_date',
        'approval_status',
        'amount_gbp',
        'attachment',
    ];

}
