<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Combination extends Model
{
    protected $fillable = [
        'title',
        'side',
        'matrix',
    ];

    protected $casts = [
        'matrix' => 'array',
        'side' => 'integer',
    ];
}
