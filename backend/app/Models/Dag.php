<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Dag extends Model
{
    use HasFactory;

    protected $fillable = [
                'zil_id', 'dag_no', 'khotiyan', 'meta', 'document', 'survey_type_id'
            ];

    protected $appends = ['document_url'];

    protected $casts = [
        'meta' => 'array',
        'khotiyan' => 'array',
    ];

    public function zil()
    {
        return $this->belongsTo(Zil::class);
    }

    public function surveyType()
    {
        return $this->belongsTo(SurveyType::class);
    }
    
    // for frontend convenience
    public function getDocumentUrlAttribute()
    {
        return $this->document ? route('dag.download', $this->id) : null;
    }
}
