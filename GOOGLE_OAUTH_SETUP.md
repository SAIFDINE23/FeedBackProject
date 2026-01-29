# Google OAuth Setup Guide

## Configuration initiale

### 1. Créer une application Google Cloud

1. Aller sur [Google Cloud Console](https://console.cloud.google.com)
2. Créer un nouveau projet ou en sélectionner un
3. Activer les APIs:
   - Google+ API
   - Google OAuth 2.0

### 2. Créer les credentials OAuth 2.0

1. Aller à **Credentials** dans le panneau latéral
2. Cliquer sur **Create Credentials** → **OAuth 2.0 Client IDs**
3. Sélectionner **Web application**
4. Ajouter les Authorized redirect URIs:
   ```
   http://127.0.0.1:8000/auth/google/callback          # Local
   https://votre-domaine.com/auth/google/callback      # Production
   ```
5. Copier le **Client ID** et **Client Secret**

### 3. Configurer .env

Ajouter dans `.env`:
```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/auth/google/callback
```

**⚠️ IMPORTANT**: Ne JAMAIS commiter les vraies credentials dans Git

---

## Flux d'authentification

### Nouveau utilisateur avec Google

```
1. User clique "Continuer avec Google"
   └─ GET /auth/google (redirectToGoogle)
   
2. Google OAuth consent screen
   └─ User approve
   
3. Google redirige vers /auth/google/callback
   └─ handleGoogleCallback():
      - Récupérer les infos Google
      - Check si user existe (google_id)
      - Check si email existe
      - Si non exist: Stocker en session et rediriger vers company selection
      
4. GET /auth/select-company
   └─ showSelectCompany(): Afficher le formulaire
   
5. POST /auth/select-company
   └─ storeUserAndCompany():
      - Créer le user avec google_id
      - Créer ou joindre une company
      - Attacher user à company via pivot table avec role
      - Log in et rediriger vers dashboard
```

### Utilisateur existant

```
Si le user a déjà un compte (email existant):
- Google ID est lié automatiquement au compte
- Avatar Google est stocké
- User est loggé directement
```

---

## Structure de données

### Users table
```php
'google_id' => 'string|nullable|unique'              // ID Google unique
'google_avatar_url' => 'string|nullable'             // Avatar Google
'avatar_url' => 'string|nullable'                    // Avatar générique
'company_id' => 'foreignId|nullable'                 // Entreprise par défaut
```

### Company User (Pivot)
```php
// Rôles disponibles:
'admin'   // Peut gérer la company
'member'  // Peut utiliser la platform
'viewer'  // Accès lecture seule
```

### Session data
```php
'google_user' => [
    'google_id' => '...',
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'google_avatar_url' => '...',
]
```

---

## Routes OAuth

### Public routes (Guest only)
```php
GET  /auth/google                  // Redirect to Google OAuth
GET  /auth/google/callback         // Google callback handler
GET  /auth/select-company          // Company selection form
POST /auth/select-company          // Store user + company
```

### Protected routes (Auth only)
```php
POST /auth/google/logout           // Logout user
```

---

## Controllers

### GoogleAuthController

**Methods:**

1. **redirectToGoogle()** - Redirige vers Google OAuth
2. **handleGoogleCallback()** - Traite la réponse Google
   - Cherche user par google_id
   - Cherche user par email
   - Crée session et redirige vers company selection
   - Retourne erreur si problème

3. **showSelectCompany()** - Affiche le formulaire de sélection
   - Récupère les companies de l'user (si existe)
   - Rend la page SelectCompany.jsx

4. **storeUserAndCompany()** - Crée l'user et le lie à une company
   - Valide les inputs (option, company_id/name/sector)
   - Crée le user avec google_id + avatar
   - Crée ou rejoint une company
   - Attache user à company avec rôle
   - Log in automatiquement

5. **logout()** - Déconnecte l'user
   - Invalide la session
   - Regenerate token
   - Redirige vers home

---

## Pages React

### SelectCompany.jsx
Formulaire avec deux options:
1. **Créer une nouvelle company**
   - Input: Nom de l'entreprise
   - Input: Secteur (optional)
   - User devient `admin` de cette company

2. **Rejoindre une company existante**
   - Select: Choisir parmi ses companies
   - User devient `member` de cette company

**Props:**
- `googleUser` - Infos Google (name, email, avatar)
- `userCompanies` - Companies existantes (optionnel)

---

## Sécurité

✅ **Implemented:**
- Google ID unique dans users table
- Scopes minimaux (openid, profile, email par défaut)
- Random password pour OAuth users
- Session invalidation au logout
- Token regeneration au logout
- Validation des inputs côté serveur
- Foreign key constraints avec cascadeOnDelete

⏳ **À faire (Future):**
- Rate limiting sur /auth/google/callback
- Email verification pour nouveaux users
- Domain-based auto-join (ex: @company.com)
- Invitation system pour rejoindre companies
- Log des OAuth attempts
- CSRF protection (Laravel natif)

---

## Troubleshooting

### "Invalid client" error
- Vérifier que GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET sont corrects
- Vérifier que l'URL de callback correspond exactement dans Google Cloud Console

### "Undefined method 'companies'"
- Intelephense parfois ne reconnaît pas les relations dynamiques
- C'est OK, Laravel les reconnaît à runtime

### User reste sur /auth/select-company
- Vérifier que la session 'google_user' existe
- Vérifier les logs Laravel (storage/logs)
- Vérifier les validations (company_option, company_name, etc)

### Avatar ne s'affiche pas
- Vérifier que google_avatar_url est bien stocké
- Vérifier que CORS n'est pas un problème
- Avatar peut être un URL externe, c'est normal

---

## Testing

### Test Manuel - Nouveau User

1. Aller sur `/login`
2. Cliquer "Continuer avec Google"
3. Approuver le consent
4. Remplir le formulaire de company selection
5. Vérifier que:
   - User créé avec google_id
   - User attaché à company avec rôle admin
   - Session 'google_user' effacée
   - User loggé et redirecté vers /dashboard

### Test Manuel - User Existant

1. Créer un user avec email: test@example.com
2. Aller sur `/login`
3. Cliquer "Continuer avec Google" avec le même email
4. Vérifier que:
   - google_id lié au user existant
   - Avatar mise à jour
   - User loggé directement sans company selection

---

## Documentation des fichiers modifiés

| Fichier | Statut | Description |
|---------|--------|-------------|
| `.env` | ✅ Modified | Ajout GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI |
| `config/services.php` | ✅ Modified | Config Google OAuth |
| `routes/auth.php` | ✅ Modified | Routes OAuth + company selection |
| `app/Http/Controllers/Auth/GoogleAuthController.php` | ✅ Created | Logic OAuth complète |
| `resources/js/Pages/Auth/SelectCompany.jsx` | ✅ Created | UI company selection |
| `resources/js/Pages/Auth/Login.jsx` | ✅ Modified | Bouton "Continuer avec Google" |
| `app/Models/User.php` | ✅ Modified | Relations companies + helpers |
| `app/Models/Company.php` | ✅ Modified | Relations users + helpers |
| `app/Models/CompanyUser.php` | ✅ Created | Pivot model avec methods |
| `database/migrations/2026_01_29_*` | ✅ Created | 3 migrations pour OAuth |

---

## Prochaines étapes

1. ✅ Infrastructure OAuth créée
2. ⏳ Tests en local (avec Google credentials de dev)
3. ⏳ Domain-based auto-join logic
4. ⏳ Invitation system pour companies
5. ⏳ Microsoft OAuth (optional)
6. ⏳ User management dashboard (admin)
