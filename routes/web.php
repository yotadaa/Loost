<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AppController;
use Illuminate\Support\Facades\Route;


Route::get('/', [AppController::class, 'index'])->name('index');


Route::get('/add-artists', [AdminController::class, 'addArtists'])->name('add-artists');
Route::post('/store-artists', [AdminController::class, 'storeArtists'])->name('store-artists');
