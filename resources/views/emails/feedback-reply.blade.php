<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réponse à votre feedback</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; color: white; }
        .header img { max-height: 50px; margin-bottom: 15px; }
        .content { padding: 40px 30px; }
        .content h2 { color: #333; margin-bottom: 20px; }
        .reply-box { background: #f9f9f9; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; font-style: italic; color: #555; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0; }
        .company-name { font-weight: 600; color: #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{ asset('images/logo_Luminea.png') }}" alt="Luminea">
            <h1 style="margin: 0; font-size: 24px;">Réponse à votre Feedback</h1>
        </div>
        
        <div class="content">
            <h2>Bonjour {{ $reply->feedback->feedbackRequest->customer->name }},</h2>
            
            <p>Merci beaucoup pour votre précieux feedback. Voici la réponse de <span class="company-name">{{ $reply->feedback->feedbackRequest->company->name }}</span> :</p>
            
            <div class="reply-box">
                "{{ $reply->content }}"
            </div>
            
            <p>Nous apprécions votre engagement et comptons sur votre retour continu pour nous aider à améliorer nos services.</p>
            
            <p>Si vous avez d'autres questions ou commentaires, n'hésitez pas à nous contacter.</p>
            
            <p>À très bientôt,<br><strong>L'équipe {{ config('app.name') }}</strong></p>
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} {{ config('app.name') }} - Tous droits réservés</p>
            <p>Cet email contient une réponse à votre feedback</p>
        </div>
    </div>
</body>
</html>
