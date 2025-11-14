<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;

class Branch extends Authenticatable
{
    use HasFactory, Notifiable;


    public $table = "branches";

    protected $fillable = [
        'id',
        'bank_id',
        'branch_name',
        'branch_code',
        'district',
        'city',
        'address',
        'phone',

        'status'

    ];
}
