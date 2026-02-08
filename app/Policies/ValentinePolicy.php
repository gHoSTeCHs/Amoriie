<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Valentine;

class ValentinePolicy
{
    /**
     * Anyone can create valentines (no authentication required for MVP).
     */
    public function create(?User $user): bool
    {
        return true;
    }

    /**
     * Only the creator can view stats.
     */
    public function viewStats(?User $user, Valentine $valentine): bool
    {
        return true;
    }

    /**
     * Only the creator can update their valentine.
     */
    public function update(?User $user, Valentine $valentine): bool
    {
        if ($user === null) {
            return false;
        }

        return $valentine->user_id === $user->id;
    }

    /**
     * Only the creator can delete their valentine.
     */
    public function delete(?User $user, Valentine $valentine): bool
    {
        if ($user === null) {
            return false;
        }

        return $valentine->user_id === $user->id;
    }
}
