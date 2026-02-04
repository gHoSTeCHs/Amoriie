<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class StatsController extends Controller
{
    /**
     * Display the stats dashboard for a valentine.
     */
    public function show(string $secret): Response
    {
        return Inertia::render('stats/show', [
            'secret' => $secret,
        ]);
    }
}
