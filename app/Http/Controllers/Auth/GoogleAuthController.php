<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Laravel\Socialite\Facades\Socialite;
use Inertia\Inertia;

class GoogleAuthController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            // Check if user already exists
            $user = User::where('google_id', $googleUser->getId())->first();

            if ($user) {
                // User exists, log them in
                Auth::login($user, remember: true);
                return redirect('/dashboard');
            }

            // Check if email exists (user might have registered with email/password)
            $existingUser = User::where('email', $googleUser->getEmail())->first();

            if ($existingUser) {
                // Email exists, link Google account
                $existingUser->update([
                    'google_id' => $googleUser->getId(),
                    'google_avatar_url' => $googleUser->getAvatar(),
                    'avatar_url' => $googleUser->getAvatar(),
                ]);

                Auth::login($existingUser, remember: true);
                return redirect('/dashboard');
            }

            // New user - store in session and redirect to company selection
            session([
                'google_user' => [
                    'google_id' => $googleUser->getId(),
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_avatar_url' => $googleUser->getAvatar(),
                ],
            ]);

            return redirect('/auth/select-company');

        } catch (\Throwable $e) {
            Log::error('Google OAuth Error: ' . $e->getMessage());
            return redirect('/login')->with('error', 'Authentication failed. Please try again.');
        }
    }

    /**
     * Show company selection page for new users
     */
    public function showSelectCompany()
    {
        $googleUser = session('google_user');

        if (!$googleUser) {
            return redirect('/login');
        }

        // Get user's companies if they exist (for existing users who logged in via Google)
        $userCompanies = null;
        if (Auth::check()) {
            $userCompanies = Auth::user()
                ->companies()
                ->select('companies.id', 'companies.name', 'companies.sector')
                ->with(['users' => function ($query) {
                    $query->where('user_id', Auth::id());
                }])
                ->get();
        }

        return Inertia::render('Auth/SelectCompany', [
            'googleUser' => $googleUser,
            'userCompanies' => $userCompanies,
        ]);
    }

    /**
     * Store the new user and link to company
     */
    public function storeUserAndCompany()
    {
        $googleUser = session('google_user');

        if (!$googleUser) {
            return redirect('/login');
        }

        $validated = request()->validate([
            'company_option' => 'required|in:new,existing',
            'company_id' => 'required_if:company_option,existing|exists:companies,id',
            'company_name' => 'required_if:company_option,new|string|max:255',
            'company_sector' => 'nullable|string|max:255',
        ]);

        try {
            // Create new user
            $user = User::create([
                'name' => $googleUser['name'],
                'email' => $googleUser['email'],
                'google_id' => $googleUser['google_id'],
                'google_avatar_url' => $googleUser['google_avatar_url'],
                'avatar_url' => $googleUser['google_avatar_url'],
                'password' => bcrypt(str()->random(32)), // Random password since using Google
            ]);

            if ($validated['company_option'] === 'new') {
                // Create new company
                $company = Company::create([
                    'user_id' => $user->id, // For V1 backward compatibility
                    'name' => $validated['company_name'],
                    'sector' => $validated['company_sector'] ?? null,
                ]);

                // Link user to company as admin
                $user->companies()->attach($company->id, ['role' => 'admin']);
                $user->update(['company_id' => $company->id]);

            } else {
                // Join existing company
                $company = Company::findOrFail($validated['company_id']);

                // Link user to company as member
                $user->companies()->attach($company->id, ['role' => 'member']);
                $user->update(['company_id' => $company->id]);
            }

            // Clear session
            session()->forget('google_user');

            // Log user in
            Auth::login($user, remember: true);

            return redirect('/dashboard');

        } catch (\Throwable $e) {
            Log::error('User creation error: ' . $e->getMessage());
            return back()->with('error', 'Failed to create account. Please try again.');
        }
    }

    /**
     * Logout user
     */
    public function logout()
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect('/');
    }
}
