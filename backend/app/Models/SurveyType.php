<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyType extends Model
{
    protected $fillable = ['code', 'name_en', 'name_bn', 'description'];
}
