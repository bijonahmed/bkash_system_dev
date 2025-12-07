<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminFundDeposit extends Model
{
    use HasFactory;
    public $table = "admin_fund_deposit";
    protected $fillable = [
        'deposit_by',
        'buying_rate',
        'reason',
        'depsoit_amount',
        'status',
    ];
}
