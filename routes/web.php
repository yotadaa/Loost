<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AppController;
use App\Http\Controllers\AudioStreamController;
use App\Http\Controllers\ListenerController;
use App\Http\Controllers\MenuController;
use Illuminate\Support\Facades\Route;


Route::get('/', [AppController::class, 'index'])->name('index');


Route::get('/add-artists', [AdminController::class, 'addArtists'])->name('add-artists');
Route::get('/add-albums', [AdminController::class, 'addAlbums'])->name('add-albums');
Route::get('/add-musics', [AdminController::class, 'addMusics'])->name('add-musics');


Route::get('/list-artists', [AdminController::class, 'listArtists'])->name('list-artists');
Route::get('/list-albums', [AdminController::class, 'listAlbums'])->name('list-albums');
Route::get('/play-musics', [AppController::class, 'playMusics'])->name('play-musics');

Route::post('/store-artists', [AdminController::class, 'storeArtists'])->name('store-artists');
Route::post('/store-albums', [AdminController::class, 'storeAlbums'])->name('store-albums');
Route::post('/store-musics', [AdminController::class, 'storeMusics'])->name('store-musics');



Route::post('/listen-to-music', [ListenerController::class, 'listenSong'])->name('listen-to-music');

Route::get('/home', [MenuController::class, 'Home'])->name('home');
Route::get('/audio/{filename}', [AudioStreamController::class, 'streamAudio'])->name('stream-audio');
Route::get('/song/{song_id}', [ListenerController::class, 'getCompleteSong'])->name("get-complete-song");
Route::get('/image/{category}/{filename}',[AudioStreamController::class, 'getImage'])->name("get-image");

Route::get('/dashboard-only', [ListenerController::class, 'DashboardOnly'])->name("dashboard-only");
Route::get('/artist/{artist_id}', [MenuController::class, 'ArtistPage'])->name("artist-page");


Route::get('/artist/{artist_id}', [MenuController::class, 'ArtistPage'])->name("artist-page");
Route::get('/artist-only/{artist_id}', [ListenerController::class, 'ArtistGet'])->name("artist-only");

Route::get('/album/{album_id}', [MenuController::class, 'AlbumPage'])->name("album-page");
Route::get('/album-only/{album_id}', [ListenerController::class, 'AlbumGet'])->name("album-only");

Route::get('/music/{song_id}', [MenuController::class, 'SongPage'])->name("song-page");
Route::get('/music-only/{song_id}', [ListenerController::class, 'SongGet'])->name("song-only");


Route::get('/search', [MenuController::class, 'SearchPage'])->name("search-page");
Route::post("/lyrics/{id}", [ListenerController::class, "getLyrics"])->name("get-lyrics");


Route::get("/auth/login", [MenuController::class, 'LoginPage'])->name("login-page");

