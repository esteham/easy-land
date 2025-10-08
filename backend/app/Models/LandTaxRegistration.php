<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandTaxRegistration extends Model
{
    protected $fillable = [
        'user_id',
        'division_id',
        'district_id',
        'upazila_id',
        'mouza_id',
        'survey_type_id',
        'khatiyan_number',
        'dag_number',
        'status',
        'submitted_at',
        'reviewed_at',
        'reviewer_id',
        'notes',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

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

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
