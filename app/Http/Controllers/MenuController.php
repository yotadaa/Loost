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

        $startOfWeek = Carbon::now()->startOfMonth();
        $endOfWeek = Carbon::now()->endOfMonth();

        $populer_now = DB::table('music_listener')
            ->select(
                'musics.id_musik',
                'musics.judul',
                'musics.source',
                'musics.artwork',
                'albums.foto',
                DB::raw('COUNT(DISTINCT music_listener.id_music_listener) as total_views'),
                DB::raw('GROUP_CONCAT(DISTINCT artists.nama ORDER BY artists.nama ASC SEPARATOR ", ") as artist_names')
            )
            ->join('musics', 'music_listener.id_musik', '=', 'musics.id_musik')
            ->join('albums', 'musics.id_album', '=', 'albums.id_album')
            ->join('penyanyi_musik', 'musics.id_musik', '=', 'penyanyi_musik.id_musik')
            ->join('artists', 'penyanyi_musik.id_penyanyi', '=', 'artists.id_penyanyi')
            ->whereBetween('music_listener.created_at', [$startOfWeek, $endOfWeek])
            ->groupBy('musics.id_musik', 'musics.judul', 'albums.foto','musics.source','musics.artwork',)
            ->orderBy('total_views', 'DESC')
            ->limit(20)
            ->get();

        return Inertia::render('App', [
            "props" => [
                "menu" => 7,
                "populer_now" => $populer_now,
                "artists" => DB::table("artists")->get(),
            ]
        ]);
    }
}
