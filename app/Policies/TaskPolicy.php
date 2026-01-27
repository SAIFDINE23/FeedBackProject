<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    /**
     * L'utilisateur peut voir toutes les tâches de sa compagnie
     */
    public function viewAny(User $user): bool
    {
        return $user->company !== null;
    }

    /**
     * L'utilisateur peut voir une tâche si elle appartient à sa compagnie
     */
    public function view(User $user, Task $task): bool
    {
        return $user->company_id === $task->company_id;
    }

    /**
     * L'utilisateur peut créer des tâches pour sa compagnie
     */
    public function create(User $user): bool
    {
        return $user->company !== null;
    }

    /**
     * L'utilisateur peut modifier une tâche de sa compagnie
     */
    public function update(User $user, Task $task): bool
    {
        return $user->company_id === $task->company_id;
    }

    /**
     * L'utilisateur peut supprimer une tâche de sa compagnie
     */
    public function delete(User $user, Task $task): bool
    {
        return $user->company_id === $task->company_id;
    }
}
