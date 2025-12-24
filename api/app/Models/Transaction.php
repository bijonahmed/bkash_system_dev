<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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
        'pr_rate',
        'description',
        'created_at',
        'updated_at',
        'transection_status',
        'agent_settlement',
        'entry_by'
    ];


    // Creator (entry_by) relation
    public function creator()
    {
        return $this->belongsTo(User::class, 'entry_by');
    }

    // Wallet relation
    public function wallet()
    {
        return $this->belongsTo(Wallet::class, 'wallet_id');
    }

    // Bank relation
    public function bank()
    {
        return $this->belongsTo(Banks::class, 'bank_id');
    }

    // Branch relation
    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }
}
