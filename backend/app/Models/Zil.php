<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Zil extends Model
{
    use HasFactory;

    protected $fillable = ['mouza_id', 'zil_no', 'map_url', 'meta'];

    protected $casts = [
        'meta' => 'array',
    ];

    public function mouza()
    {
        return $this->belongsTo(Mouza::class);
    }

    public function dags()
    {
        return $this->hasMany(Dag::class);
    }

    public function mouzaMaps()
    {
        return $this->hasMany(MouzaMap::class);
    }
}
