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
            $song = DB::table('music_listener')
            ->select(
                'musics.id_musik',
                'musics.judul',
                'musics.source',
                'musics.artwork',
                'musics.single',
                'albums.foto',
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
            'musics.single',)
            ->orderBy('total_views', 'DESC')
            ->limit(20)
            ->get();
            return response()->json(["song" => $song, "success"=>true]);
        } catch (e) {
            return response()->json(["song" => null, "success"=>false]);
        }

    }


    public function ArtistGet(Request $request, $artist_id) {
        // Fetch the artist by ID
        try {
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
                        DB::raw('COUNT(DISTINCT music_listener.id_music_listener) as total_views'),
                        DB::raw('GROUP_CONCAT(DISTINCT albums.id_artist ORDER BY albums.id_artist ASC SEPARATOR ", ") as id_artist')
                    )
                    ->join('albums', 'musics.id_album', '=', 'albums.id_album')
                    ->leftJoin('music_listener', 'music_listener.id_musik', '=', 'musics.id_musik')
                    ->where('musics.id_album', $album->id_album)
                    ->groupBy('musics.id_musik', 'musics.judul', 'albums.foto','musics.source','musics.artwork','musics.single',
                    'musics.duration',
                    'albums.id_album',)
                    ->orderBy('total_views', 'DESC')
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
                    DB::raw('COUNT(DISTINCT music_listener.id_music_listener) as total_views')
                )
                ->join('penyanyi_musik', 'musics.id_artist', '=', 'penyanyi_musik.id_penyanyi')
                ->leftJoin('music_listener', 'music_listener.id_musik', '=', 'musics.id_musik')
                ->where('musics.id_artist', $artist_id)
                ->groupBy('musics.id_musik', 'musics.judul','musics.source','musics.artwork',
                'musics.duration',)
                ->orderBy('total_views', 'DESC')
                ->get();

            // Merge the album songs into the songs collection
            $songs = $songs->merge($singleSongs);

            // Convert the songs collection to an array if needed
            $finalSongsArray = $songs->toArray();

            return response()->json([
                "success" => true,
                "artist" => $artist,
                "albums" => $albums,
                "musics" => $finalSongsArray,
            ]);
        } catch (e) {
            return response()->json([
                "success" => false,
            ]);
        }
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
}
