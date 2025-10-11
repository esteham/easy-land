<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MouzaMap extends Model
{
    use HasFactory;

    protected $fillable = [
        'zil_id', 'name', 'document'
    ];

    protected $appends = ['document_url'];

    public function zil()
    {
        return $this->belongsTo(Zil::class);
    }

    // for frontend convenience
    public function getDocumentUrlAttribute()
    {
        return $this->document ? route('mouza-map.download', $this->id) : null;
    }
}
