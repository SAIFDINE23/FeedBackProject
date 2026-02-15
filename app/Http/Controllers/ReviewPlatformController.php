<?php

namespace App\Http\Controllers;

use App\Models\ReviewPlatform;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewPlatformController extends Controller
{
    /**
     * Liste des plateformes disponibles
     */
    private function getAvailablePlatforms()
    {
        return [
            // Moteurs de recherche et maps
            ['name' => 'Google', 'key' => 'google', 'icon' => 'SiGoogle'],
            ['name' => 'Google Maps', 'key' => 'google_maps', 'icon' => 'SiGooglemaps'],
            
            // Plateformes d'avis génériques
            ['name' => 'Trustpilot', 'key' => 'trustpilot', 'icon' => 'SiTrustpilot'],
            ['name' => 'Avis Vérifiés', 'key' => 'avis_verifies', 'icon' => 'Star'],
            ['name' => 'Reviews.io', 'key' => 'reviews_io', 'icon' => 'MessageSquare'],
            ['name' => 'Verified Reviews', 'key' => 'verified_reviews', 'icon' => 'CheckCircle'],
            
            // Réseaux sociaux
            ['name' => 'Facebook', 'key' => 'facebook', 'icon' => 'SiFacebook'],
            ['name' => 'Instagram', 'key' => 'instagram', 'icon' => 'SiInstagram'],
            ['name' => 'Twitter/X', 'key' => 'twitter', 'icon' => 'SiX'],
            ['name' => 'LinkedIn', 'key' => 'linkedin', 'icon' => 'SiLinkedin'],
            
            // Voyages et hébergement
            ['name' => 'TripAdvisor', 'key' => 'tripadvisor', 'icon' => 'SiTripadvisor'],
            ['name' => 'Booking.com', 'key' => 'booking', 'icon' => 'SiBookingdotcom'],
            ['name' => 'Airbnb', 'key' => 'airbnb', 'icon' => 'SiAirbnb'],
            ['name' => 'Expedia', 'key' => 'expedia', 'icon' => 'SiExpedia'],
            ['name' => 'Hotels.com', 'key' => 'hotels', 'icon' => 'Building2'],
            
            // Restaurants et livraison
            ['name' => 'Yelp', 'key' => 'yelp', 'icon' => 'SiYelp'],
            ['name' => 'TheFork', 'key' => 'thefork', 'icon' => 'UtensilsCrossed'],
            ['name' => 'Uber Eats', 'key' => 'uber_eats', 'icon' => 'SiUber'],
            ['name' => 'Deliveroo', 'key' => 'deliveroo', 'icon' => 'SiDeliverroo'],
            ['name' => 'Just Eat', 'key' => 'just_eat', 'icon' => 'SiJusteat'],
            
            // E-commerce
            ['name' => 'Amazon', 'key' => 'amazon', 'icon' => 'SiAmazon'],
            ['name' => 'eBay', 'key' => 'ebay', 'icon' => 'SiEbay'],
            ['name' => 'Etsy', 'key' => 'etsy', 'icon' => 'SiEtsy'],
            
            // Services locaux
            ['name' => 'PagesJaunes', 'key' => 'pagesjaunes', 'icon' => 'BookOpen'],
            ['name' => 'Foursquare', 'key' => 'foursquare', 'icon' => 'SiFoursquare'],
            
            // Application mobile
            ['name' => 'App Store', 'key' => 'app_store', 'icon' => 'SiAppstore'],
            ['name' => 'Google Play', 'key' => 'google_play', 'icon' => 'SiGoogleplay'],
            
            // Santé et beauté
            ['name' => 'Doctolib', 'key' => 'doctolib', 'icon' => 'Stethoscope'],
            ['name' => 'Treatwell', 'key' => 'treatwell', 'icon' => 'Scissors'],
            
            // Autres
            ['name' => 'Glassdoor', 'key' => 'glassdoor', 'icon' => 'SiGlassdoor'],
            ['name' => 'Indeed', 'key' => 'indeed', 'icon' => 'SiIndeed'],
            ['name' => 'Capterra', 'key' => 'capterra', 'icon' => 'SiCapterra'],
            ['name' => 'G2', 'key' => 'g2', 'icon' => 'SiG2'],
        ];
    }

    /**
     * Afficher la page de gestion des plateformes
     */
    public function index()
    {
        $company = Auth::user()->company;
        $availablePlatforms = $this->getAvailablePlatforms();

        // Récupérer les plateformes configurées
        $platforms = ReviewPlatform::where('company_id', $company->id)->get();

        // Fusionner avec les plateformes disponibles
        $platformsData = collect($availablePlatforms)->map(function ($platform) use ($platforms) {
            $existing = $platforms->firstWhere('platform_name', $platform['key']);
            return [
                'id' => $existing->id ?? null,
                'name' => $platform['name'],
                'key' => $platform['key'],
                'icon' => $platform['icon'],
                'url' => $existing->platform_url ?? '',
                'is_active' => $existing->is_active ?? false,
            ];
        });

        return Inertia::render('ReviewPlatforms/Index', [
            'platforms' => $platformsData,
        ]);
    }

    /**
     * Mettre à jour ou créer une plateforme
     */
    public function upsert(Request $request)
    {
        $company = Auth::user()->company;

        $request->validate([
            'platform_key' => 'required|string',
            'platform_url' => 'nullable|url',
            'is_active' => 'required|boolean',
        ]);

        ReviewPlatform::updateOrCreate(
            [
                'company_id' => $company->id,
                'platform_name' => $request->platform_key,
            ],
            [
                'platform_url' => $request->platform_url,
                'is_active' => $request->is_active,
            ]
        );

        return back()->with('success', 'Plateforme mise à jour avec succès.');
    }
}
