<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    //
    public function Home() {
        return Inertia::render('App', [
            "props" => [
                "menu" => 7
            ]
        ]);
    }
}
