<?php
namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;
class ModelHasRole extends Authenticatable
{
    use HasFactory, Notifiable;
    public $table = "model_has_roles";
    protected $fillable = [
        'role_id',
        'model_type',
        'model_id'
    ];

     
}
