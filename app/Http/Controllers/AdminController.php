<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminController extends Controller
{
    //
    public function generateUniqueString(int $length = 20): string
    {
        while (true) {
            $string = Str::random($length);
            $unique = DB::table("artist")->where('nama', $string)->exists();

            if (!$unique) {
                return $string;
            }
        }
    }

    public function addArtists(Request $request){
        return Inertia::render('App', [
            "props" => [
                "menu" => 1,
                "countries" => DB::table("countries")->get(),
            ]
        ]);
    }

    public function listArtists(Request $request){
        return Inertia::render('App', [
            "props" => [
                "menu" => 3,
                "artists" => DB::table("artists")->get(),
            ]
        ]);
    }

    public function listAlbums(Request $request){
        return Inertia::render('App', [
            "props" => [
                "menu" => 4,
                "albums" => DB::table("albums")->get(),
                "artists" => DB::table("artists")->get(),
            ]
        ]);
    }

    public function addAlbums(Request $request){
        return Inertia::render('App', [
            "props" => [
                "menu" => 2,
                "artists" => DB::table("artists")->get(),
            ]
        ]);
    }

    public function addMusics(Request $request){
        return Inertia::render('App', [
            "props" => [
                "menu" => 5,
                "artists" => DB::table("artists")->get(),
                "genres" => DB::table("genres")->get(),
                "albums" => DB::table("albums")->get(),
                "languages" => DB::table("languages")->get(),
                "countries" => DB::table("countries")->get(),
            ]
        ]);
    }

    public function storeArtists(Request $request)
    {
        try {
            $validatedData = Validator::make($request->all(), [
                'nama' => 'required|string',
                'description' => 'required|string',
                'image' => 'nullable|image|mimes:jpg,png,webp',
                'country' => 'required|int'
            ])->validate();
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed: ' . $e->getMessage(),
                'errors' => $e->errors()
            ], 422);
        }

        $artistData = $validatedData;

        if ($request->hasFile('image')) {
            $imageName = time() . '.' . $request->file('image')->getClientOriginalExtension();
            $request->file('image')->storeAs('public/assets/loost/artists', $imageName);
            $artistData['image'] = "assets/loost/artists/" . $imageName;

        }

        try {
            DB::table('artists')
            ->insert(['nama' => $artistData['nama'],
                'description' => $artistData['description'],
                'profil' => $artistData['image'],
                'cover' =>  "assets/cover/default.png",
                'country' => $artistData['country']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Artist created successfully!',
                'value' => $artistData,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create artist: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function storeAlbums(Request $request)
    {
        try {
            $validatedData = Validator::make($request->all(), [
                'nama' => 'required|string',
                'image' => 'nullable|image|mimes:jpg,png,webp',
                'release_date' => 'required|date',
                'id_artist' => 'required|int'
            ])->validate();
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed: ' . $e->getMessage(),
                'errors' => $e->errors()
            ], 422);
        }

        $artistData = $validatedData;

        if ($request->hasFile('image')) {
            $imageName = time() . '.' . $request->file('image')->getClientOriginalExtension();
            $request->file('image')->storeAs('public/assets/loost/albums', $imageName);
            $artistData['image'] = "assets/loost/albums/" . $imageName;

        }

        try {
            DB::table('albums')
            ->insert(['nama' => $artistData['nama'],
                'release_date' => Carbon::parse($artistData['release_date']),
                'foto' => $artistData['image'],
                'id_artist' => $artistData['id_artist'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Artist created successfully!',
                'value' => $artistData,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create artist: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function storeMusics(Request $request) {
        try {
            $validatedData = Validator::make($request->all(), [
                'judul' => 'required|string|max:255',
                'id_genre' => 'integer',
                'id_artist' => 'integer',
                'id_language' => 'integer',
                'id_country' => 'integer',
                'source' => 'required|file',
                'release_date' => 'required|date',
                'composer' => 'required|string|max:255',
                'id_album' => 'nullable|string',
                'duration' => 'required|integer|min:0',
                'single' => 'required|string',
                'lyrics' => 'required',
                'artist' => 'required',
                'genre' => 'required'
            ])->validate();

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed: ' . $e->getMessage(),
                'errors' => $e->errors()
            ], 422);
        }



        $musicData = $validatedData;

        if ($request->hasFile('source')) {
            $musicName = time() . '.' . $request->file('source')->getClientOriginalExtension();
            $request->file('source')->storeAs('public/assets/loost/musics', $musicName);
            $musicData['source'] = "assets/loost/musics/" . $musicName;
        }

        $id_musik = time();
        $lyrics = json_decode($musicData['lyrics'], true);
        $artist = json_decode($musicData['artist'], true);
        $genre = json_decode($musicData['genre'], true);

        try {
            DB::table('musics')
            ->insert([
                "id_musik" => intval($id_musik),
                "judul" => $musicData['judul'],
                "source" => $musicData['source'],
                "release_date" => $musicData['release_date'],
                "duration" => intval($musicData['duration']),
                "id_album" => intval($musicData['id_album']),
                "id_language" => intval($musicData['id_language']),
                "id_country" => intval($musicData['id_country']),
                "id_genre" => intval($musicData['id_genre']),
                "id_artist" => intval($musicData['id_artist']),
            ]);

            for ($i = 0; $i < count($lyrics);$i++) {
                DB::table('lyrics')
                ->insert([
                    "id_musik" => $id_musik,
                    "seconds" => $lyrics[$i]['timestamp'],
                    "sentences" => $lyrics[$i]['sentence']
                ]);
            }

            for ($i = 0; $i < count($artist);$i++) {
                DB::table('penyanyi_musik')
                ->insert([
                    "id_musik" => $id_musik,
                    "id_artist" => $lyrics[$i]
                ]);
            }

            for ($i = 0; $i < count($genre);$i++) {
                DB::table('genre_musik')
                ->insert([
                    "id_musik" => $id_musik,
                    "id_genre" => $genre[$i]
                ]);
            }


            return response()->json([
                'success' => true,
                'message' => 'Music created successfully!',
                'value' => $musicData,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create artist: ' . $e->getMessage(),
            ], 500);
        }

    }

}
