<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Liste des clients de la company.
     */
    public function index()
    {
        $company = Auth::user()->company;

        $customers = $company->customers()
            ->with(['feedbackRequests' => fn ($q) => $q->latest()])
            ->get()
            ->map(function ($customer) {
                $customer->qr_code_data = $this->generateQRBase64($customer);
                return $customer;
            });

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
        ]);
    }

    /**
     * Générer QR code en base64 pour un client
     */
    private function generateQRBase64($customer)
    {
        $feedbackRequest = $customer->feedbackRequests()->latest()->first();
        
        if (!$feedbackRequest) {
            $feedbackRequest = $customer->feedbackRequests()->create([
                'company_id' => $customer->company_id,
                'token' => \Illuminate\Support\Str::uuid(),
                'channel' => 'qr',
                'status' => 'sent',
            ]);
        }

        $url = route('feedback.show', ['token' => $feedbackRequest->token]);

        $qrCode = new \Endroid\QrCode\QrCode(
            data: $url,
            size: 300,
            margin: 10
        );

        $writer = new \Endroid\QrCode\Writer\SvgWriter();
        $result = $writer->write($qrCode);

        return 'data:' . $result->getMimeType() . ';base64,' . base64_encode($result->getString());
    }

    /**
     * Formulaire d'ajout manuel.
     */
    public function create()
    {
        return Inertia::render('Customers/Create');
    }
  
    /**
     * Ajouter un customer manuel.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        $company = Auth::user()->company;

        // Vérifier si le client existe déjà
        if (Customer::where('email', $request->email)
            ->where('company_id', $company->id)
            ->exists()) {
            return back()->withErrors(['email' => 'Ce client existe déjà.']);
        }

        Customer::create([
            'company_id' => $company->id,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        return back()->with('success', 'Client ajouté avec succès.');
    }

    /**
     * Formulaire d'édition d'un client
     */
    public function edit(Customer $customer)
    {
        // Vérifier que le client appartient à la company de l'utilisateur
        if ($customer->company_id !== Auth::user()->company->id) {
            abort(403);
        }

        return Inertia::render('Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    /**
     * Mettre à jour un client
     */
    public function update(Request $request, Customer $customer)
    {
        // Vérifier que le client appartient à la company de l'utilisateur
        if ($customer->company_id !== Auth::user()->company->id) {
            abort(403);
        }

        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        // Vérifier si l'email n'est pas déjà utilisé par un autre client
        if (Customer::where('email', $request->email)
            ->where('company_id', $customer->company_id)
            ->where('id', '!=', $customer->id)
            ->exists()) {
            return back()->withErrors(['email' => 'Ce client existe déjà.']);
        }

        $customer->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        return redirect()->route('customers.index')->with('success', 'Client modifié avec succès.');
    }

    public function destroy(Request $request, Customer $customer)
{
    // 🔐 Sécurité : vérifier que le client appartient bien à l'utilisateur connecté
    if ($customer->company_id !== $request->user()->company->id) {
        abort(403);
    }

    // 🧹 Suppression propre (feedbacks liés)
    $customer->feedbackRequests()->delete();

    // ❌ Suppression du client
    $customer->delete();

    return back()->with('success', 'Client supprimé avec succès');
}

    /**
     * Générer un QR code pour un client
     */
    public function qrCode(Customer $customer)
    {
        // Vérifier que le client appartient à la company de l'utilisateur
        if ($customer->company_id !== Auth::user()->company->id) {
            abort(403, 'Accès non autorisé');
        }

        // Créer ou récupérer une demande de feedback pour ce client
        $feedbackRequest = $customer->feedbackRequests()->latest()->first();
        
        if (!$feedbackRequest) {
            // Créer une nouvelle demande si aucune n'existe
            $feedbackRequest = $customer->feedbackRequests()->create([
                'company_id' => $customer->company_id,
                'token' => \Illuminate\Support\Str::uuid(),
                'channel' => 'qr',
                'status' => 'sent',
            ]);
        }

        $url = route('feedback.show', ['token' => $feedbackRequest->token]);

        // Créer le QR code (v6 utilise readonly class avec constructeur)
        $qrCode = new \Endroid\QrCode\QrCode(
            data: $url,
            size: 300,
            margin: 10
        );

        $writer = new \Endroid\QrCode\Writer\PngWriter();
        $result = $writer->write($qrCode);

        // Retourner l'image avec cache headers pour permettre le chargement
        return response($result->getString())
            ->header('Content-Type', $result->getMimeType())
            ->header('Cache-Control', 'public, max-age=3600');
    }

    /**
     * Upload CSV pour créer plusieurs clients.
     */
    public function importCSV(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $company = $user->company;
        
        $filePath = $request->file('csv_file')->getRealPath();
        
        // Détecter l'encodage du fichier
        $content = file_get_contents($filePath);
        $encoding = mb_detect_encoding($content, ['UTF-8', 'ISO-8859-1', 'Windows-1252', 'ASCII'], true);
        
        // Convertir en UTF-8 si nécessaire
        if ($encoding && $encoding !== 'UTF-8') {
            $content = mb_convert_encoding($content, 'UTF-8', $encoding);
            file_put_contents($filePath, $content);
        }
        
        $file = fopen($filePath, 'r');

        // Lire le header avec gestion des BOM UTF-8
        $header = fgetcsv($file);
        if ($header && isset($header[0])) {
            // Supprimer le BOM UTF-8 si présent
            $header[0] = str_replace("\xEF\xBB\xBF", '', $header[0]);
            // Nettoyer les espaces et caractères invisibles
            $header = array_map(function($col) {
                return trim(preg_replace('/[\x00-\x1F\x7F]/u', '', $col));
            }, $header);
        }

        $added = 0;
        $skipped = 0;
        $errors = [];

        while (($row = fgetcsv($file)) !== false) {
            // Nettoyer chaque cellule
            $row = array_map(function($cell) {
                if ($cell === null) return null;
                // Supprimer les caractères de contrôle et espaces multiples
                $cell = preg_replace('/[\x00-\x1F\x7F]/u', '', $cell);
                $cell = preg_replace('/\s+/', ' ', $cell);
                return trim($cell);
            }, $row);

            if (count($row) !== count($header)) {
                $skipped++;
                $errors[] = "Ligne ignorée : nombre de colonnes incorrect";
                continue;
            }

            $data = array_combine($header, $row);

            // Validation email
            if (!isset($data['email']) || empty($data['email'])) {
                $skipped++;
                $errors[] = "Email manquant";
                continue;
            }

            $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $skipped++;
                $errors[] = "Email invalide : {$data['email']}";
                continue;
            }

            // Vérifier les doublons
            if (Customer::where('email', $email)
                ->where('company_id', $company->id)
                ->exists()) {
                $skipped++;
                $errors[] = "Email déjà existant : {$email}";
                continue;
            }

            // Nettoyer le nom
            $name = isset($data['name']) && !empty($data['name']) 
                ? mb_convert_case(trim($data['name']), MB_CASE_TITLE, 'UTF-8') 
                : null;

            // Nettoyer le téléphone
            $phone = isset($data['phone']) && !empty($data['phone'])
                ? preg_replace('/[^0-9+\s\-\(\)]/', '', $data['phone'])
                : null;

            Customer::create([
                'company_id' => $company->id,
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
            ]);

            $added++;
        }

        fclose($file);

        $message = "$added clients ajoutés";
        if ($skipped > 0) {
            $message .= ", $skipped ignorés";
        }

        return back()->with('success', $message);
    }
}
