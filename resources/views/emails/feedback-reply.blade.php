Bonjour {{ $reply->feedback->feedbackRequest->customer->name }},

Merci pour votre retour.

Voici notre réponse :

"{{ $reply->content }}"

À très bientôt,
{{ config('app.name') }}
