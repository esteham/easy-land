<?php

namespace App\Providers;

use Laravel\Passport\Passport;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // Model::class => ModelPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();

        // Optional token lifetimes:
        // Passport::tokensExpireIn(now()->addDays(7));
        // Passport::refreshTokensExpireIn(now()->addDays(30));
    }
}
