<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class AIReplyService
{
    public function generate(string $feedbackContent, ?int $rating = null, ?string $customerName = null, ?string $context = null): string
    {
        $customerLine = $customerName ? "Client : $customerName\n\n" : '';
        $contextLine = $context ? "Contexte : $context\n\n" : '';

        $prompt = <<<PROMPT
Tu es un support client professionnel pour une application SaaS.

{$customerLine}Feedback du client :
"$feedbackContent"

{$contextLine}Note : {$rating}/5

Consignes :
- Réponse polie et empathique
- Professionnelle
- Claire et concise (2-4 phrases)
- En français

Exemples :
1) Si le client est satisfait mais propose une amélioration :
"Bonjour {Nom}, merci beaucoup pour votre retour. Nous apprécions votre suggestion concernant X. Nous allons l'étudier et voir comment l'intégrer. En attendant, voici une astuce..."

2) Si le client est mécontent :
"Bonjour {Nom}, merci d'avoir partagé votre expérience. Nous sommes désolés d'apprendre que... Nous prenons cela au sérieux et allons..."

Adapte le texte pour inclure le nom du client si fourni, sinon omets-le.
PROMPT;

        $apiKey = config('services.gemini.api_key');
        $model = config('services.gemini.model') ?? 'models/gemini-2.5-flash:generateContent';

        $url = 'https://generativelanguage.googleapis.com/v1beta/' . $model
            . '?key=' . urlencode($apiKey);

        $response = Http::post(
            $url,
            [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt],
                        ],
                    ],
                ],
            ]
        );

        if (! $response->successful()) {
            throw new \Exception('Erreur Gemini API : ' . $response->body());
        }

        return trim(
            $response->json('candidates.0.content.parts.0.text')
        );
    }
}
