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
                    "musics.id_musik",
                    "musics.judul",
                    "musics.release_date",
                    "musics.duration",
                    "musics.id_genre",
                    "musics.id_artist",
                    "musics.single",
                    "musics.source",
                    "musics.artwork",
                    DB::raw('COUNT(music_listener.id_musik) as total_views')
                )
                ->join('penyanyi_musik', 'penyanyi_musik.id_musik','=','musics.id_musik')
                ->join("artists", "artists.id_penyanyi","=","penyanyi_musik.id_penyanyi")
                ->leftJoin('music_listener', 'music_listener.id_musik', '=', 'musics.id_musik')
                ->where('musics.single',"=", "T")
                ->groupBy(
                    "musics.id_musik",
                    "musics.judul",
                    "musics.release_date",
                    "musics.duration",
                    "musics.id_genre",
                    "musics.id_artist",
                    "musics.single",
                    "musics.source",
                    "musics.artwork"
                 )
                ->orderBy('total_views', 'DESC')
                ->get();


        // Merge the album songs into the songs collection
        $songs = $songs->merge($singleSongs);
        $songsArray = $songs->toArray();
        usort($songsArray, function($a, $b) {
            return $b->total_views <=> $a->total_views;
        });
        $songs = collect($songsArray);

        // Return the artist, albums, and songs to the view
        return Inertia::render('App', [
            "props" => [
                "menu" => 8,
                "artist" => $artist,
                "albums" => $albums,  // Pass $albums instead of $album
                "musics" => $songs,
            ]
        ]);
    }

    public function AlbumPage(Request $request, $album_id) {

        $album = DB::table("albums")
                    ->where("id_album", $album_id)
                    ->get();

        $artist = DB::table("artists")
                    ->select(
                        "artists.*"
                    )
                    ->join("albums", "albums.id_artist","=", "artists.id_penyanyi")
                    ->where('albums.id_album', $album_id)
                    ->get();


        $songs =DB::table('musics')
                ->select(
                    'musics.id_musik',
                    'musics.judul',
                    'musics.artwork',
                    'musics.duration',
                    'musics.single',
                    'albums.foto',
                    'musics.source',
                    'albums.id_album',
                    'albums.release_date',
                    DB::raw('COUNT(DISTINCT music_listener.id_music_listener) as total_views')
                )
                ->join('albums', 'musics.id_album', '=', 'albums.id_album')
                ->leftJoin('music_listener', 'music_listener.id_musik', '=', 'musics.id_musik')
                ->where('musics.id_album', $album_id)
                ->groupBy(
                    'musics.id_musik',
                    'musics.judul',
                    'albums.foto',
                    'musics.artwork',
                    'musics.single',
                    'musics.duration',
                    'albums.id_album',
                    'musics.source',
                    'albums.release_date',
                )
                ->get();

        return Inertia::render('App', [
            "props" => [
                "menu" => 9,
                "album" => $album,
                "musics" => $songs,
                "artist" => $artist
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
}
