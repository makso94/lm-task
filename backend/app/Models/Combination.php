<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Combination extends Model
{
    protected $fillable = [
        'title',
        'side',
        'matrix',
        'visible_count',
        'visible_positions',
        'not_visible_positions',
    ];

    protected $casts = [
        'matrix' => 'array',
        'visible_positions' => 'array',
        'not_visible_positions' => 'array',
        'side' => 'integer',
        'visible_count' => 'integer',
    ];
}
