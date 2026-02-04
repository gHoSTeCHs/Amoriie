<?php

use App\Http\Controllers\SlugController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\ValentineController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('create')->name('create.')->group(function (): void {
    Route::get('/', [ValentineController::class, 'index'])->name('index');
    Route::get('/{templateId}', [ValentineController::class, 'builder'])->name('builder');
    Route::get('/{templateId}/preview', [ValentineController::class, 'preview'])->name('preview');
});

Route::prefix('api')->group(function (): void {
    Route::middleware('throttle.api:30,1')->group(function (): void {
        Route::post('slugs/check', [SlugController::class, 'check'])->name('api.slugs.check');
        Route::post('slugs/suggestions', [SlugController::class, 'suggestions'])->name('api.slugs.suggestions');
    });

    Route::middleware('throttle.api:10,1')->group(function (): void {
        Route::post('valentines', [ValentineController::class, 'store'])->name('api.valentines.store');
    });

    Route::prefix('valentines/{slug}')->middleware('throttle.api:60,1')->group(function (): void {
        Route::post('view', [ValentineController::class, 'recordView'])->name('api.valentines.view');
        Route::post('progress', [ValentineController::class, 'recordProgress'])->name('api.valentines.progress');
        Route::post('respond', [ValentineController::class, 'recordResponse'])->name('api.valentines.respond');
    });
});

Route::get('for/{slug}', [ValentineController::class, 'show'])->name('valentine.show');

Route::get('stats/{secret}', [StatsController::class, 'show'])->name('stats.show');

require __DIR__.'/settings.php';
