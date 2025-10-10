<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Mutation;
use Illuminate\Auth\Access\HandlesAuthorization;

class MutationPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'acland';
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Mutation $mutation): bool
    {
        if ($user->role === 'admin' || $user->role === 'acland') {
            return true;
        }

        return $mutation->user_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'user';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Mutation $mutation): bool
    {
        return $user->role === 'admin' || $user->role === 'acland';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Mutation $mutation): bool
    {
        return $user->role === 'admin';
    }
}
