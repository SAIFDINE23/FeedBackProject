<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Admin2FA
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Vérifie si c'est ton admin
        if ($user && $user->email === 'saifdineelkhantache@gmail.com') {
            // Si 2FA non validé, redirige vers le challenge
            if (!$request->session()->get('two_factor_passed', false)) {
                return redirect()->route('two-factor.challenge');
            }
        }

        return $next($request);
    }
}
