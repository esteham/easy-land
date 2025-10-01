<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Mouza extends Model
{
    use HasFactory;

    protected $fillable = ['upazila_id','name_en','name_bn','jl_no','mouza_code','meta'];

    protected $casts = [
        'meta' => 'array',
    ];

    public function upazila()
    {
        return $this->belongsTo(Upazila::class);
    }

    public function zils()
    {
        return $this->hasMany(Zil::class);
    }
}
