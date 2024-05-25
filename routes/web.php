<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AppController;
use Illuminate\Support\Facades\Route;


Route::get('/', [AppController::class, 'index'])->name('index');


Route::get('/add-artists', [AdminController::class, 'addArtists'])->name('add-artists');
Route::get('/add-albums', [AdminController::class, 'addAlbums'])->name('add-albums');
Route::get('/add-musics', [AdminController::class, 'addMusics'])->name('add-musics');


Route::get('/list-artists', [AdminController::class, 'listArtists'])->name('list-artists');
Route::get('/list-albums', [AdminController::class, 'listAlbums'])->name('list-albums');

Route::post('/store-artists', [AdminController::class, 'storeArtists'])->name('store-artists');
Route::post('/store-albums', [AdminController::class, 'storeAlbums'])->name('store-albums');
