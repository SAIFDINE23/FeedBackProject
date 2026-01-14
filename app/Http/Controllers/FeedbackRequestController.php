<?php

namespace App\Http\Controllers;

use App\Models\FeedbackRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use App\Mail\FeedbackRequestMail;
use App\Services\SmsService;
use Illuminate\Support\Facades\Log;

class FeedbackRequestController extends Controller
{
    /**
     * Envoyer une demande de feedback (Email ou SMS)
     */
    public function store(Request $request)
    {
        // 🔹 Log de l'arrivée de la requête
        Log::info('FeedbackRequest.store called', [
            'user_id' => Auth::id(),
            'company_id' => Auth::user()->company->id ?? null,
            'payload' => $request->all(),
        ]);

        // ✅ Validation
        $data = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'channel'     => 'required|in:email,sms',
        ]);

        // 🔹 Log après validation
        Log::info('FeedbackRequest validated', $data);

        $company = Auth::user()->company;

        // 🔒 Sécurité : empêcher plusieurs feedbacks actifs
        $alreadySent = FeedbackRequest::where('customer_id', $data['customer_id'])
            ->where('company_id', $company->id)
            ->whereIn('status', ['pending', 'sent'])
            ->exists();

        if ($alreadySent) {
            Log::warning('FeedbackRequest already exists', [
                'customer_id' => $data['customer_id'],
                'company_id' => $company->id,
            ]);
            return back()->withErrors([
                'feedback' => 'Un feedback est déjà en attente pour ce client.'
            ]);
        }

        // ✅ Création de la demande
        $feedbackRequest = FeedbackRequest::create([
            'company_id'  => $company->id,
            'customer_id' => $data['customer_id'],
            'channel'     => $data['channel'],
            'token'       => Str::uuid(),
            'status'      => 'sent',
            'sent_at'     => now(),
        ]);

        // 🔹 Log création
        Log::info('FeedbackRequest created', [
            'id' => $feedbackRequest->id,
            'status' => $feedbackRequest->status,
            'token' => $feedbackRequest->token,
        ]);

        /**
         * ==========================
         * EMAIL
         * ==========================
         */
        if ($data['channel'] === 'email') {
            Log::info('Email flow triggered', [
                'to' => $feedbackRequest->customer->email,
            ]);

            try {
                Mail::to($feedbackRequest->customer->email)
                    ->queue(new FeedbackRequestMail($feedbackRequest));

                Log::info('Email queued successfully', [
                    'to' => $feedbackRequest->customer->email,
                ]);
            } catch (\Throwable $e) {
                Log::error('Email failed', [
                    'to' => $feedbackRequest->customer->email,
                    'error' => $e->getMessage(),
                ]);

                return back()->withErrors([
                    'email' => 'Erreur lors de l’envoi de l’email : ' . $e->getMessage()
                ]);
            }
        }

        /**
         * ==========================
         * SMS
         * ==========================
         */
        if ($data['channel'] === 'sms') {
            // 🔐 Validation du numéro
            if (empty($feedbackRequest->customer->phone)) {
                Log::warning('Customer phone missing', [
                    'customer_id' => $feedbackRequest->customer_id,
                ]);

                return back()->withErrors([
                    'phone' => 'Le client ne possède pas de numéro de téléphone.'
                ]);
            }

            Log::info('SMS flow triggered', [
                'customer_id' => $feedbackRequest->customer_id,
                'phone' => $feedbackRequest->customer->phone,
            ]);

            try {
                $link = rtrim(config('app.url'), '/') . '/feedback/' . $feedbackRequest->token;

                $sms = app(SmsService::class)->send(
                    $feedbackRequest->customer->phone,
                    "Bonjour 👋\nMerci de donner votre avis : " . $link
                );


                Log::info('Twilio response', $sms);

                // 📦 Tracking provider
                $feedbackRequest->update([
                    'provider'             => 'twilio',
                    'provider_message_id'  => $sms['sid'] ?? null,
                    'provider_response'    => json_encode($sms),
                ]);

            } catch (\Throwable $e) {
                Log::error('Twilio SMS FAILED', [
                    'to' => $feedbackRequest->customer->phone,
                    'error' => $e->getMessage(),
                ]);

                return back()->withErrors([
                    'sms' => 'Erreur lors de l’envoi du SMS : ' . $e->getMessage()
                ]);
            }
        }

        Log::info('FeedbackRequest flow completed successfully', [
            'id' => $feedbackRequest->id,
            'channel' => $data['channel'],
        ]);

        return back()->with('success', 'Demande de feedback envoyée avec succès');
    }
}
