<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;

class ListenerController extends Controller
{
    //

    public function listenSong(Request $request) {
        try {
            $validatedData = Validator::make($request->all(), [
                'id_musik' => 'required|string',
            ])->validate();
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed: ' . $e->getMessage(),
                'errors' => $e->errors()
            ], 422);
        }

        $musicData = $validatedData;

        try {
            DB::table('music_listener')
            ->insert([
                'email' => auth()->check() ? auth()->user()->email : "guest",
                'id_musik' => intval($musicData['id_musik']),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Artist created successfully!',
                'value' => $musicData,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create artist: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getCompleteSong(Request $request, $song_id) {
        try {
            $song = DB::table('musics')
                ->selectRaw('musics.id_musik,
                             musics.judul,
                             musics.source,
                             musics.artwork,
                             musics.single,
                             albums.foto,
                             musics.release_date,
                             albums.id_album,
                             albums.nama,
                             artists.id_penyanyi as id_artist,
                             COUNT(DISTINCT music_listener.id_music_listener) as total_views,
                             GROUP_CONCAT(DISTINCT artists.nama ORDER BY artists.nama ASC SEPARATOR ", ") as artist_names,
                             GROUP_CONCAT(DISTINCT artists.id_penyanyi ORDER BY artists.id_penyanyi ASC SEPARATOR ", ") as id_artist')
                ->leftJoin('music_listener', 'musics.id_musik', '=', 'music_listener.id_musik')
                ->leftJoin('albums', 'musics.id_album', '=', 'albums.id_album')
                ->join('penyanyi_musik', 'musics.id_musik', '=', 'penyanyi_musik.id_musik')
                ->leftJoin('artists', 'penyanyi_musik.id_penyanyi', '=', 'artists.id_penyanyi')
                ->where('musics.id_musik', '=', $song_id)
                ->groupBy('musics.id_musik',
                          'musics.judul',
                          'albums.foto',
                          'musics.source',
                          'musics.artwork',
                          'musics.single',
                          'musics.release_date',
                          'albums.id_album',
                          'albums.nama',
                          'artists.id_penyanyi')
                ->orderBy('total_views', 'desc')
                ->get();
            $lyrics = DB::table("lyrics")
                    ->where("id_musik", $song_id)
                    ->get();
            return response()->json([
                "song" => $song,
                "success"=>true,
                "songId" => $song_id,
                "lyrics" => $lyrics
            ]);
        } catch (e) {
            return response()->json(["song" => "Cant get song: "+e, "success"=>false]);
        }

    }


    public function ArtistGet(Request $request, $artist_id) {
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
            ->selectRaw('musics.id_musik,
                         musics.judul,
                         musics.source,
                         musics.artwork,
                         musics.single,
                         albums.foto,
                         musics.release_date,
                         albums.id_album,
                         albums.nama,
                         artists.id_penyanyi as id_artist,
                         COUNT(DISTINCT music_listener.id_music_listener) as total_views,
                         GROUP_CONCAT(DISTINCT artists.nama ORDER BY artists.nama ASC SEPARATOR ", ") as artist_names,
                         GROUP_CONCAT(DISTINCT artists.id_penyanyi ORDER BY artists.id_penyanyi ASC SEPARATOR ", ") as id_artist')
            ->leftJoin('music_listener', 'musics.id_musik', '=', 'music_listener.id_musik')
            ->leftJoin('albums', 'musics.id_album', '=', 'albums.id_album')
            ->join('penyanyi_musik', 'musics.id_musik', '=', 'penyanyi_musik.id_musik')
            ->leftJoin('artists', 'penyanyi_musik.id_penyanyi', '=', 'artists.id_penyanyi')
            ->where('artists.id_penyanyi', $artist[0]->id_penyanyi)
            ->where('musics.single', "T")
            ->groupBy('musics.id_musik',
                      'musics.judul',
                      'albums.foto',
                      'musics.source',
                      'musics.artwork',
                      'musics.single',
                      'musics.release_date',
                      'albums.id_album',
                      'albums.nama',
                      'artists.id_penyanyi')
            ->orderBy('total_views', 'desc')
            ->get();

            // Merge the album songs into the songs collection
            $songs =  $songs->merge($singleSongs);
            $songsArray = $songs->toArray();
            usort($songsArray, function($a, $b) {
                return $b->total_views <=> $a->total_views;
            });
            $songs = collect($songsArray);
            // $singleSongs = DB::table("musics")->where(1)->get();

            return response()->json([
                "success" => true,
                "artist" => $artist,
                "albums" => $albums,
                "musics" => $songs,
            ]);
    }

    public function DashboardOnly(Request $request) {
        try {
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
                ->groupBy('musics.id_musik', 'musics.judul', 'albums.foto','musics.source','musics.artwork',)
                ->orderBy('total_views', 'DESC')
                ->limit(20)
                ->get();
                return response()->json([
                        "success" => true,
                        "menu" => 7,
                        "populer_now" => $populer_now,
                        "artists" => DB::table("artists")->get(),
                    ]);
        } catch( e) {
            return response()->json([
                "success" => true,
            ]);
        }
    }

    public function AlbumGet(Request $request, $album_id) {
        try {
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

                return response()->json([
                    "success" => true,
                    "album" => $album,
                    "musics" => $songs,
                    "artist" => $artist
                ]
            );
        } catch (e)  {
            return response()->json([
                "success" => false,
                "message" => e
            ]);
        }
    }

    public function SongGet(Request $request, $album_id) {
    }


    public function searchQuery(Request $request, $query) {
        $lagu = null;
        $album = null;
        $penyanyi = null;
        $playlist = null;
        $genre = null;
    }

    public function getLyrics(Request $request, $id) {
        try {
            $lyrics = DB::table("lyrics")->where("id_musik", $id)->get();
            return response()->json([
                "success"=>true,
                "lyrics"=>$lyrics
            ]);
        } catch (e) {
            return response()->json([
                "success"=>false,
                "message"=>e
            ]);
        }
    }
}
