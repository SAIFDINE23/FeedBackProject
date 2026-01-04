<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\FeedbackRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    // Pour le client
public function show(string $token)
{
    $feedbackRequest = FeedbackRequest::where('token', $token)->firstOrFail();

    if ($feedbackRequest->status === 'completed') {
        return Inertia::render('Feedback/Show', [
            'feedback' => $feedbackRequest->feedback,
            'status' => 'completed',
            'company' => $feedbackRequest->company->name,
            'customer' => optional($feedbackRequest->customer)->name,
        ]);
    }

    return Inertia::render('Feedback/Show', [
        'token' => $token,
        'status' => 'pending',
        'company' => $feedbackRequest->company->name,
        'customer' => optional($feedbackRequest->customer)->name,
    ]);
}

// Pour l’admin
public function adminShow(int $id)
{
    $feedbackRequest = FeedbackRequest::with('feedback', 'customer', 'company')
        ->findOrFail($id);

    return Inertia::render('Feedback/ShowAdmin', [
        'feedback' => $feedbackRequest->feedback,
        'status' => $feedbackRequest->status,
        'company' => $feedbackRequest->company->name,
        'customer' => optional($feedbackRequest->customer)->name,
    ]);
}


    public function store(Request $request, string $token)
    {
        $request->validate([
        'rating' => ['required', 'integer', 'between:1,5'],
        'comment' => ['nullable', 'string'],
    ]);

    $feedbackRequest = FeedbackRequest::where('token', $token)
        ->where('status', '!=', 'completed')
        ->firstOrFail();

    // ✅ Création du feedback (CE QUI MANQUAIT)
    Feedback::create([
        'feedback_request_id' => $feedbackRequest->id,
        'rating' => $request->rating,
        'comment' => $request->comment,
        'is_public' => true,
    ]);

    // ✅ Mise à jour du statut
    $feedbackRequest->update([
        'status' => 'completed',
        'responded_at' => now(),
    ]);

        return Inertia::render('Feedback/ThankYou');
    }
}
