<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function edit(Request $request)
    {
        $company = $request->user()->company;

        return Inertia::render('Company/Edit', [
            'company' => $company,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sector' => ['nullable', 'string', 'max:255'],
            'google_place_id' => ['nullable', 'string', 'max:255'],
            'google_review_url' => ['nullable', 'url'],
        ]);

        $company = $request->user()->company;
        $company->update($validated);

        return redirect()
            ->route('company.edit')
            ->with('success', 'Informations de l’entreprise mises à jour');
    }
}
