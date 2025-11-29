<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;

class AssignWallet extends Authenticatable
{
    use HasFactory, Notifiable;


    public $table = "assign_wallet";

    protected $fillable = [
        'id',
        'agent_id',
        'wallet_id',
        'amount'

    ];

   
}
