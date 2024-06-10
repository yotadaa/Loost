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
                "menu" => 7,
                "populer_now" => $populer_now,
                "artists" => DB::table("artists")->get(),
            ]
        ]);
    }

    public function ArtistPage(Request $request, $artist_id)
    {
        // Fetch the artist by ID
        $artist = DB::table("artists")->where("id_penyanyi", $artist_id)->get();

        // Fetch the albums by artist ID
        $albums = DB::table("albums")->where("id_artist", $artist_id)->get();

        // Initialize an empty collection for songs
        $songs = collect();

        // Iterate through each album to get its songs
        foreach ($albums as $album) {
            $albumSongs = DB::table('musics')
                ->select(
                    'musics.id_musik',
                    'musics.judul',
                    'musics.source',
                    'musics.artwork',
                    'musics.duration',
                    'musics.single',
                    'albums.foto',
                    'albums.id_album',
                    DB::raw('COUNT(DISTINCT music_listener.id_music_listener) as total_views')
                )
                ->join('albums', 'musics.id_album', '=', 'albums.id_album')
                ->leftJoin('music_listener', 'music_listener.id_musik', '=', 'musics.id_musik')
                ->where('musics.id_album', $album->id_album)
                ->groupBy(
                    'musics.id_musik',
                    'musics.judul',
                    'albums.foto',
                    'musics.source',
                    'musics.artwork',
                    'musics.single',
                    'musics.duration',
                    'albums.id_album',
                )
                ->get();

            // Merge the album songs into the songs collection
            $songs = $songs->merge($albumSongs);
        }
        $singleSongs = DB::table('musics')
            ->select(
                'musics.id_musik',
                'musics.judul',
                'musics.source',
                'musics.artwork',
                'musics.duration',
                'musics.single',
                DB::raw('COUNT(DISTINCT music_listener.id_music_listener) as total_views')
            )
            ->join('penyanyi_musik', 'musics.id_musik', '=', 'penyanyi_musik.id_musik')
            ->join('music_listener', 'music_listener.id_musik', '=', 'musics.id_musik')
            ->where('penyanyi_musik.id_penyanyi', $artist_id)
            ->where("musics.single", 'T')
            ->groupBy('musics.id_musik', 'musics.judul', 'musics.source', 'musics.artwork', 'musics.duration', 'musics.single', )
            ->orderBy('total_views', 'DESC')
            ->get();

        // Merge the album songs into the songs collection
        $songs = $songs->merge($singleSongs);
        $songs = $songs->sortByDesc('total_views');

        // Convert the songs collection to an array if needed
        $finalSongsArray = $songs->toArray();

        // Return the artist, albums, and songs to the view
        return Inertia::render('App', [
            "props" => [
                "menu" => 8,
                "artist" => $artist,
                "albums" => $albums,  // Pass $albums instead of $album
                "musics" => $finalSongsArray,
            ]
        ]);
    }

    public function AlbumPage(Request $request, $album_id) {

        $album = DB::table("albums")
                    ->where("id_album", $album_id)
                    ->get();

        return Inertia::render('App', [
            "props" => [
                "menu" => 9,
                "album" => $album,
            ]
        ]);
    }
}
