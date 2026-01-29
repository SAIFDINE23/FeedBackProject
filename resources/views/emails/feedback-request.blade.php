<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demande de feedback</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; color: white; }
        .header img { max-height: 50px; margin-bottom: 15px; }
        .content { padding: 40px 30px; }
        .content h2 { color: #333; margin-bottom: 20px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0; }
        .company-name { font-weight: 600; color: #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{ asset('images/logo_Luminea.png') }}" alt="Luminea">
            <h1 style="margin: 0; font-size: 24px;">Demande de Feedback</h1>
        </div>
        
        <div class="content">
            <h2>Bonjour {{ $customer }},</h2>
            
            <p>Nous espérons que vous appréciez votre expérience avec <span class="company-name">{{ $company }}</span>.</p>
            
            <p>Votre avis nous est précieux et nous aide à améliorer continuellement nos services. Pourriez-vous prendre quelques minutes pour partager votre feedback?</p>
            
            <div style="text-align: center;">
                <a href="{{ $link }}" class="cta-button">👉 Partager votre avis</a>
            </div>
            
            <p>Merci beaucoup pour votre temps et vos commentaires précieux! 🙏</p>
            
            <p>Cordialement,<br><strong>L'équipe {{ config('app.name') }}</strong></p>
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} {{ config('app.name') }} - Tous droits réservés</p>
            <p>Vous recevez cet email car vous êtes client de {{ $company }}</p>
        </div>
    </div>
</body>
</html>
