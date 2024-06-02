<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MenuController extends Controller
{
    //
    public function Home() {

        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        $populer_now = DB::table('MUSIC_LISTENER')
        ->select('musics.id_musik', 'musics.judul', DB::raw('COUNT(MUSIC_LISTENER.id_music_listener) as total_views'))
        ->join('musics', 'MUSIC_LISTENER.id_musik', '=', 'musics.id_musik')
        ->whereBetween('MUSIC_LISTENER.created_at', [$startOfWeek, $endOfWeek])
        ->groupBy('musics.id_musik', 'musics.judul')
        ->orderBy('total_views', 'DESC')
        ->limit(20)
        ->get();

        return Inertia::render('App', [
            "props" => [
                "menu" => 7,
                "populer_now" => $populer_now,
            ]
        ]);
    }
}
