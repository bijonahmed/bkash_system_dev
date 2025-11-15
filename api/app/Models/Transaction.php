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
        'entry_by'
    ];
}
