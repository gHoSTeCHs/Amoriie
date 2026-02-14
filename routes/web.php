<?php

use App\Http\Controllers\AudioLibraryController;
use App\Http\Controllers\SlugController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\ValentineController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'ogImageUrl' => asset('ogimage.jpg'),
        'appUrl' => config('app.url'),
        'og_title' => 'Amoriie — Create Beautiful Love Letters & Valentines',
        'og_description' => 'Create beautiful, personalized love letters and valentines for your special someone. Choose from stunning themes, add music, and share your feelings.',
        'og_image_url' => asset('ogimage.jpg'),
        'og_url' => config('app.url'),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('create')->name('create.')->group(function (): void {
    Route::get('/', [ValentineController::class, 'index'])->name('index');
    Route::get('/success/{slug}', [ValentineController::class, 'success'])->name('success');
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

    Route::get('audio-library', [AudioLibraryController::class, 'index'])
        ->name('api.audio-library.index');
});

Route::get('privacy', fn () => Inertia::render('privacy'))->name('privacy');
Route::get('terms', fn () => Inertia::render('terms'))->name('terms');

Route::get('for/{slug}', [ValentineController::class, 'show'])->name('valentine.show');

Route::get('stats/{secret}', [StatsController::class, 'show'])
    ->middleware('throttle:60,1')
    ->name('stats.show');

if (app()->isLocal()) {
    Route::prefix('preview')->name('preview.')->group(function (): void {
        Route::get('/image-uploader', fn () => Inertia::render('preview/image-uploader'))->name('image-uploader');
        Route::get('/audio-trimmer', fn () => Inertia::render('preview/audio-trimmer'))->name('audio-trimmer');
        Route::get('/love-letter', fn () => Inertia::render('preview/love-letter-viewer'))->name('love-letter');
    });

    Route::get('/envelope', fn () => Inertia::render('envelope'))->name('envelope');
}

require __DIR__.'/settings.php';
