<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AppController extends Controller
{
    public function index() {
        return Inertia::render('App', [
            "props" => [
                "menu" => null,
            ]
        ]);
    }

    public function playMusics() {
        return Inertia::render('App', [
            "props" => [
                "menu" => 6,
                "musics" => DB::table("musics")->get(),
                "lyrics" => DB::table("lyrics")->get(),
                "artists" => DB::table("artists")->get(),
                "albums" => DB::table("albums")->get(),
            ]
        ]);
    }

}
