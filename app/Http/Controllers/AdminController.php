<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

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

    public function listAlbums(Request $request){
        return Inertia::render('App', [
            "props" => [
                "menu" => 3,
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

    public function storeArtists(Request $request)
    {
        try {
            // Validate the request data
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
            // Validate the request data
            $validatedData = Validator::make($request->all(), [
                'nama' => 'required|string',
                'description' => 'required|string',
                'image' => 'nullable|image|mimes:jpg,png,webp',
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
}
