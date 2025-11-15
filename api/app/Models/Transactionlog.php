<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transactionlog extends Model
{
    use HasFactory;
    public $table = "transactions_log";
    protected $fillable = [
        'transaction_id',
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
        'receivingMoney',
        'charges',
        'fee',
        'totalAmount',
        'senderName',
        'receiving_money',
        'description',
        'created_at',
        'updated_at',
        'type',
        'entry_by'
    ];
}
