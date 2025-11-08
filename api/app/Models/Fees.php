<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;

class Fees extends Authenticatable
{
    use HasFactory, Notifiable;


    public $table = "fees";

    protected $fillable = [
        'id',
        'paymentMethod',
        'from_bdt',
        'to_bdt',
        'fee_gbp',
        'created_by'

    ];
}
