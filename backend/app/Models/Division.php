<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Division extends Model
{
    use HasFactory;

    protected $fillable = ['name_en','name_bn','bbs_code'];

    public function districts()
    {
        return $this->hasMany(District::class);
    }
}
