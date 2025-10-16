<?php

use App\Http\Controllers\CombinationController;
use Illuminate\Support\Facades\Route;

Route::apiResource('combinations', CombinationController::class);
