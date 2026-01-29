<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code de sécurité Luminea</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; color: white; }
        .header img { max-height: 50px; margin-bottom: 15px; }
        .content { padding: 40px 30px; }
        .code-box { background: #f9f9f9; border: 2px solid #667eea; padding: 30px; margin: 30px 0; border-radius: 8px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace; }
        .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0; font-size: 14px; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{ asset('images/logo_Luminea.png') }}" alt="Luminea">
            <h1 style="margin: 0; font-size: 20px;">Code de Sécurité</h1>
        </div>
        
        <div class="content">
            <h2>Bienvenue Admin</h2>
            
            <p>Vous avez demandé un accès à votre compte d'administration Luminea. Voici votre code de vérification à deux facteurs :</p>
            
            <div class="code-box">
                {{ $code }}
            </div>
            
            <p style="text-align: center; color: #999;">Ce code expire dans <strong>30 secondes</strong></p>
            
            <div class="warning">
                ⚠️ <strong>Important :</strong> Ne partagez jamais ce code avec quiconque. L'équipe Luminea ne vous demandera jamais ce code par email ou téléphone.
            </div>
            
            <p>Si vous n'avez pas demandé cet accès, ignorez simplement cet email.</p>
            
            <p>Sécurité en premier,<br><strong>L'équipe {{ config('app.name') }}</strong></p>
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} {{ config('app.name') }} - Tous droits réservés</p>
            <p>Cet email contient un code de sécurité sensible</p>
        </div>
    </div>
</body>
</html>