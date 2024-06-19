<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //

    public function login(Request $request) {
        try {
          $data = $request->input('data');
          $creds = [
            "email" => $data["email"],
            "password" => $data["password"]
          ];
      
          if (Auth::attempt($creds)) {
            $request->session()->regenerate();
            // Store user ID in the session
            $auth = [
                "check" => Auth::check(),
                "user" => Auth::user(),
            ];
            $request->session()->put('auth', $auth);
            $request->session()->put('authenticated', true);
            return response()->json([
              "success" => true,
              "message" => "Login Successful",
            ]);
          } else {
            return response()->json([
              "success" => false,
              "message" => "Login Failed",
            ]);
          }
        } catch (\Exception $e) {
          return response()->json([
            "success" => false,
            "message" => "Error: " . $e->getMessage(),
          ]);
        }
      }
      
      
    private function generateId() {
       return time();
    }

    public function register(Request $request) {
        $req = $request->input("data");
        $emailExists = DB::table("users")->where('email', $req["email"])->exists();
        if ($emailExists) {
            return response()->json([
                "success"=>false,
                "message"=>"Email exists",
            ]);
        }

        $data = [
            "nama" =>  $req["nama"],
            "email" =>  $req["email"],
            "password" =>  $req["password"],
            "number" =>  $req["number"],
            "country" =>  $req["country"],
            "id_users" => time(),
            "profile" => "assets/loost/albums/1716994561.webp",
        ];
        $user = User::create($data);

        if ($user) {

            DB::table("playlists")->insert([
                "nama" => "Favorite",
                "id_playlist" => $this->generateId(),
                "email" => $data["email"],

            ]);

            DB::table("playlists")->insert([
                "nama" => "Queue",
                "id_playlist" => $this->generateId()+1,
                "email" => $data["email"],
            ]);

            return response()->json([
                "success" => true,
                "message" => "Successfull register"
            ]);
        }
        else return response()->json([
            "success" => false,
            "Message" => "Register failed"
        ]);
    }

    public function logout(Request $request) {
        Auth::logout();
        $request->session()->put('authenticated', false);
        return response()->json(["success" => true, "message" => "success logout"]);
    }
}
