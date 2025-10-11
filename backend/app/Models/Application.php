<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = ['user_id', 'dag_id', 'mouza_map_id', 'type', 'description', 'status', 'submitted_at', 'fee_amount', 'payment_status', 'payment_method', 'payer_identifier', 'transaction_id'];

    protected $casts = [
        'submitted_at' => 'datetime',
        'fee_amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function dag()
    {
        return $this->belongsTo(Dag::class);
    }

    public function mouzaMap()
    {
        return $this->belongsTo(MouzaMap::class);
    }
}
