<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Inertia\Inertia;

use App\Http\Controllers\{
    CompanyController,
    DashboardController,
    CustomerController,
    FeedbackController,
    FeedbackRequestController,
    ProfileController,
    FeedbackReplyController
};
use App\Services\SmsService;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Feedback public (clients)
|--------------------------------------------------------------------------
*/

Route::get('/feedback/{token}', [FeedbackController::class, 'show'])
    ->name('feedback.show');

Route::post('/feedback/{token}', [FeedbackController::class, 'store'])
    ->name('feedback.store');

/*
|--------------------------------------------------------------------------
| Authenticated routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/feedbacks/{id}', [FeedbackController::class, 'adminShow'])
        ->name('feedback.adminShow');

    // Liste des réponses pour un feedback
    Route::get('/feedback/{id}/replies', [FeedbackReplyController::class, 'index'])
        ->name('feedback.replies.index');

    // Création d'une réponse manuelle
    Route::post('/feedback/{id}/replies', [FeedbackReplyController::class, 'store'])
        ->name('feedback.replies.store');

    // Génération IA d'une réponse
    Route::post('/feedback/{id}/replies/ai', [FeedbackReplyController::class, 'generateAIReply'])
        ->name('feedback.replies.ai');

    // Génération IA synchrone (retourne le contenu généré en JSON)
    Route::post('/feedback/{id}/replies/ai/generate', [FeedbackReplyController::class, 'generateAIReplySync'])
        ->name('feedback.replies.ai.generate');

    /*
    | Dashboard
    */
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    /*
    | Profile
    */
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    /*
    | Customers
    */
    Route::get('/customers', [CustomerController::class, 'index'])
        ->name('customers.index');

    Route::get('/customers/create', [CustomerController::class, 'create'])
        ->name('customers.create');

    Route::post('/customers', [CustomerController::class, 'store'])
        ->name('customers.store');
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])
    ->name('customers.destroy');


    Route::post('/customers/import-csv', [CustomerController::class, 'importCSV'])
        ->name('customers.importCSV');

    Route::get('/company/settings', [CompanyController::class, 'edit'])
        ->name('company.edit');

    Route::put('/company/settings', [CompanyController::class, 'update'])
        ->name('company.update');

    /*
    | Feedback requests (send / resend)
    */
    Route::post('/feedback-requests', [FeedbackRequestController::class, 'store'])
        ->name('feedback-requests.store');
});




require __DIR__.'/auth.php';
