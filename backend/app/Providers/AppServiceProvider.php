<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Fix Passport key paths for Windows with spaces
        $privateKeyPath = str_replace('\\', '/', storage_path('oauth-private.key'));
        $publicKeyPath = str_replace('\\', '/', storage_path('oauth-public.key'));
        $this->app['config']['passport.private_key'] = $privateKeyPath;
        $this->app['config']['passport.public_key'] = $publicKeyPath;
    }
}
