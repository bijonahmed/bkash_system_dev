<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;

class UserLog extends Authenticatable
{
    use HasFactory, HasRoles, Notifiable;

      public $table = "users_log";

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone_number',
        'address',
        'facebook',
        'website',
        'github',
        'twitter',
        'instagram',
        'role_type',
        'type',
        'phone_number',
        'status',
        'password',
        'agentCode',
        'created_at',
        'created_by',
        'update_by',

    ];
}
