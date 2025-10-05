<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = ['user_id', 'dag_id', 'type', 'description', 'status', 'submitted_at', 'fee_amount', 'payment_status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function dag()
    {
        return $this->belongsTo(Dag::class);
    }
}
