<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Upazila extends Model
{
    use HasFactory;

    protected $fillable = ['district_id','name_en','name_bn','bbs_code'];

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function mouzas()
    {
        return $this->hasMany(Mouza::class);
    }
}
