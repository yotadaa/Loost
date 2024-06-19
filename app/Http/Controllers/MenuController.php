<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MenuController extends Controller
{
    //
    public function Home()
    {

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
                DB::raw('GROUP_CONCAT(DISTINCT artists.nama ORDER BY artists.nama ASC SEPARATOR ", ") as artist_names'),
                DB::raw('GROUP_CONCAT(DISTINCT artists.id_penyanyi ORDER BY artists.id_penyanyi ASC SEPARATOR ", ") as id_artist')
            )
            ->join('musics', 'music_listener.id_musik', '=', 'musics.id_musik')
            ->join('albums', 'musics.id_album', '=', 'albums.id_album')
            ->join('penyanyi_musik', 'musics.id_musik', '=', 'penyanyi_musik.id_musik')
            ->join('artists', 'penyanyi_musik.id_penyanyi', '=', 'artists.id_penyanyi')
            ->whereBetween('music_listener.created_at', [$startOfWeek, $endOfWeek])
            ->groupBy('musics.id_musik', 'musics.judul', 'albums.foto', 'musics.source', 'musics.artwork', )
            ->orderBy('total_views', 'DESC')
            ->limit(20)
            ->get();

        return Inertia::render('App', [
            "props" => [
                "login" => auth()->check(),
                "menu" => 7,
                "populer_now" => $populer_now,
                "artists" => DB::table("artists")->get(),
            ]
        ]);
    }

    public function ArtistPage(Request $request, $artist_id)
    {
        // Return the artist, albums, and songs to the view
        return Inertia::render('App', [
            "props" => [
                "menu" => 8,
                "artistId" => $artist_id,
            ]
        ]);
    }

    public function AlbumPage(Request $request, $album_id) {

        return Inertia::render('App', [
            "props" => [
                "menu" => 9,
                "albumId" => $album_id,
            ]
        ]);
    }

    public function SongPage(Request $request, $song_id){
       $song = DB::table('music_listener')
        ->select(
            'musics.id_musik',
            'musics.judul',
            'musics.source',
            'musics.artwork',
            'musics.single',
            'albums.foto',
            'musics.release_date',
            "penyanyi_musik.id_penyanyi",
            "albums.nama",
            "albums.id_album",
            DB::raw('COUNT(DISTINCT music_listener.id_music_listener) as total_views'),
            DB::raw('GROUP_CONCAT(DISTINCT artists.nama ORDER BY artists.nama ASC SEPARATOR ", ") as artist_names'),
            DB::raw('GROUP_CONCAT(DISTINCT artists.id_penyanyi ORDER BY artists.id_penyanyi ASC SEPARATOR ", ") as id_artist')

        )
        ->join('musics', 'music_listener.id_musik', '=', 'musics.id_musik')
        ->join('albums', 'musics.id_album', '=', 'albums.id_album')
        ->join('penyanyi_musik', 'musics.id_musik', '=', 'penyanyi_musik.id_musik')
        ->join('artists', 'penyanyi_musik.id_penyanyi', '=', 'artists.id_penyanyi')
        ->where('musics.id_musik', $song_id)
        ->groupBy('musics.id_musik', 'musics.judul', 'albums.foto','musics.source','musics.artwork',
        'musics.single',
        "penyanyi_musik.id_penyanyi","albums.nama",
        'musics.release_date',
        "albums.id_album",)
        ->orderBy('total_views', 'DESC')
        ->limit(20)
        ->get();

        return Inertia::render('App', [
            "props" => [
                "menu" => 10,
                "music" => $song,
                "musicId" => $song_id,
            ]
        ]);
    }

    public function SearchPage(Request $request) {

        return Inertia::render('App', [
            "props" => [
                "menu" => 11,
            ]]
        );
    }

    public function LoginPage(Request $request){
        return Inertia::render('App', [
            "props" => [
                "menu" => 13,
            ]
        ]);
    }
}
