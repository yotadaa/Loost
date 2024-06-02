<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class AudioStreamController extends Controller
{
    public function streamAudio(Request $request, $filename)
    {
        $path = storage_path('app/public/assets/loost/musics/' . $filename);

        if (!file_exists($path)) {
            return response()->json(['error' => 'File not found.'], 404);
        }

        $size = filesize($path);
        $start = 0;
        $end = $size - 1;

        if ($request->headers->has('Range')) {
            $range = $request->header('Range');
            [$start, $end] = explode('-', str_replace('bytes=', '', $range));
            $start = intval($start);
            $end = $end === '' ? $size - 1 : intval($end);
        }

        $length = $end - $start + 1;
        $file = fopen($path, 'rb');
        fseek($file, $start);

        $headers = [
            'Content-Type' => 'audio/mpeg',
            'Content-Length' => $length,
            'Content-Range' => "bytes $start-$end/$size",
            'Accept-Ranges' => 'bytes',
        ];

        return response()->stream(function () use ($file, $length) {
            echo fread($file, $length);
            fclose($file);
        }, 206, $headers);
    }
}
