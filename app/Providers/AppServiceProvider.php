<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->registerServices();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    protected function registerServices(): void
    {
        $this->app->bind(
            \App\Services\Contracts\MediaServiceInterface::class,
            \App\Services\MediaService::class
        );

        $this->app->bind(
            \App\Services\Contracts\SlugServiceInterface::class,
            \App\Services\SlugService::class
        );

        $this->app->bind(
            \App\Services\Contracts\ValentineServiceInterface::class,
            \App\Services\ValentineService::class
        );

        $this->app->bind(
            \App\Services\Contracts\OgImageServiceInterface::class,
            \App\Services\OgImageService::class
        );
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}
