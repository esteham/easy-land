<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    ];

    protected $casts = [
        'documents' => 'array',
        'fee_amount' => 'decimal:2',
        'reviewed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
