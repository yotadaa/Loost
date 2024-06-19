<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
        $middleware->append(\App\Http\Middleware\HandleInertiaRequests::class);
        // $middleware->group('web', function ($middleware) {
        //     $middleware->push(\Illuminate\Session\Middleware\StartSession::class);
        //     $middleware->push(\Illuminate\View\Middleware\ShareErrorsFromSession::class);
        // });

    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
