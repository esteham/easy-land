<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Land_Record extends Model
{
    protected $fillable = [
        'division_id',
        'district_id',
        'upazila_id',
        'mouza_id',
        'survey_type_id',
        'khatiyan_number',
        'dag_number',
        'land_area',
    ];

    public function division()
    {
        return $this->belongsTo(Division::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function upazila()
    {
        return $this->belongsTo(Upazila::class);
    }

    public function mouza()
    {
        return $this->belongsTo(Mouza::class);
    }

    public function surveyType()
    {
        return $this->belongsTo(SurveyType::class);
    }
}
