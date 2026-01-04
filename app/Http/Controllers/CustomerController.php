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
            ->get();

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
        ]);
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
     * Upload CSV pour créer plusieurs clients.
     */
    public function importCSV(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt',
        ]);

        $company = Auth::user()->company;
        $file = fopen($request->file('csv_file')->getRealPath(), 'r');

        $header = fgetcsv($file); // name,email,phone

        $added = 0;
        $skipped = 0;

        while (($row = fgetcsv($file)) !== false) {
            if (count($row) !== count($header)) {
                $skipped++;
                continue;
            }

            $data = array_combine($header, $row);

            if (!isset($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $skipped++;
                continue;
            }

            if (Customer::where('email', $data['email'])
                ->where('company_id', $company->id)
                ->exists()) {
                $skipped++;
                continue;
            }

            Customer::create([
                'company_id' => $company->id,
                'name' => $data['name'] ?? null,
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
            ]);

            $added++;
        }

        fclose($file);

        return back()->with('success', "$added clients ajoutés, $skipped ignorés.");
    }
}
