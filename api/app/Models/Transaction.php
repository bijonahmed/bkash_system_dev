<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;
    public $table = "transactions";
    protected $fillable = [
        'beneficiaryName',
        'beneficiaryPhone',
        'status',
        'paymentMethod',
        'wallet_id',
        'bank_id',
        'branch_id',
        'branchCode',
        'admin_fund_deposit_id',
        'admin_buying_rate',
        'accountNo',
        'sendingMoney',
        'walletrate',
        'bankRate',
        'agent_id',
        'receivingMoney',
        'charges',
        'fee',
        'totalAmount',
        'senderName',
        'receiving_money',
        'description',
        'created_at',
        'updated_at',
        'transection_status',
        'entry_by'
    ];
}
