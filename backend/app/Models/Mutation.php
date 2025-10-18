<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mutation extends Model
{
    protected $fillable = [
        'user_id',
        'application_id',
        'mutation_type',
        'reason',
        'documents',
        'fee_amount',
        'status',
        'remarks',
        'reviewed_by',
        'reviewed_at',
        'payment_status',
        'payment_method',
        'payer_identifier',
        'transaction_id',
        'paid_at',
        'mouza_name',
        'khatian_number',
        'dag_number',
        'buyer_name',
        'buyer_nid',
        'buyer_address',
        'previous_owner_name',
        'previous_owner_nid',
        'previous_owner_address',
        'deed_number',
        'deed_date',
        'registry_office',
        'land_type',
        'contact_number',
    ];

    protected $casts = [
        'documents' => 'array',
        'fee_amount' => 'decimal:2',
        'reviewed_at' => 'datetime',
        'paid_at' => 'datetime',
        'deed_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
