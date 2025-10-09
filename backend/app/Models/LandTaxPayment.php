<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandTaxPayment extends Model
{
    protected $fillable = [
        'user_id',
        'land_tax_registration_id',
        'year',
        'amount',
        'status',
        'paid_at',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'year' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function landTaxRegistration()
    {
        return $this->belongsTo(LandTaxRegistration::class);
    }
}
