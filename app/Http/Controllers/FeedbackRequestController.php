<?php

namespace App\Http\Controllers;

use App\Models\FeedbackRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\FeedbackRequestMail;
use Illuminate\Support\Facades\Auth;


class FeedbackRequestController extends Controller
{
    /**
     * Envoyer une demande de feedback
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'channel'     => 'required|in:email',
        ]);

        // Sécurité : empêcher les doublons non répondus
        $alreadySent = FeedbackRequest::where('customer_id', $data['customer_id'])
            ->whereIn('status', ['pending', 'sent'])
            ->exists();

        if ($alreadySent) {
            return back()->withErrors([
                'feedback' => 'Un feedback est déjà en attente pour ce client.'
            ]);
        }

        $feedback = FeedbackRequest::create([
            'company_id' => Auth::user()->company->id,    
            'customer_id' => $data['customer_id'],
            'channel'     => 'email',
            'token'       => Str::uuid(),
            'status'      => 'sent',
            'sent_at'     => now(),
        ]);

        // Envoi du mail
        Mail::to($feedback->customer->email)
           ->send(new FeedbackRequestMail($feedback));
        return back()->with('success', 'Demande de feedback envoyée');
    }
}
