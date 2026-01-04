<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\FeedbackRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $company = Auth::user()->company;

        // Clients avec stats sur les feedbacks
        $customers = Customer::where('company_id', $company->id)
        ->withCount([
        'feedbackRequests as total_feedbacks',
        'feedbackRequests as completed_feedbacks' => function ($q) {
            $q->where('status', 'completed');
        }
    ])
    ->latest()
    ->get()
    ->map(fn($c) => [
        'id' => $c->id,
        'name' => $c->name,
        'email' => $c->email,
        'phone' => $c->phone,
        'total_feedbacks' => $c->total_feedbacks,
        'completed_feedbacks' => $c->completed_feedbacks,
    ]);

 $feedbacks = FeedbackRequest::where('company_id', $company->id)
    ->whereHas('customer')
    ->with(['customer', 'feedback']) // 🔴 IMPORTANT
    ->latest()
    ->get()
    ->map(fn ($f) => [
    'id' => $f->id,
    'token' => $f->token, // ✅ AJOUT OBLIGATOIRE
    'customer' => [
        'id' => $f->customer->id,
        'name' => $f->customer->name,
    ],
    'status' => $f->status,
    'rating' => $f->feedback?->rating,
    'created_at' => $f->created_at->format('Y-m-d H:i'),
]);




$stats = [
    'customers' => $customers->count(),
    'feedbacks_total' => $feedbacks->count(),
    'feedbacks_sent' => $feedbacks->whereIn('status', ['sent', 'pending'])->count(),
    'feedbacks_completed' => $feedbacks->where('status', 'completed')->count(),
    'response_rate' => $feedbacks->count() > 0
        ? round(($feedbacks->where('status', 'completed')->count() / $feedbacks->count()) * 100, 1)
        : 0,
];

$stats['ratings'] = collect([1, 2, 3, 4, 5])->mapWithKeys(function ($star) use ($feedbacks) {
    return [
        $star => $feedbacks->where('rating', $star)->count()
    ];
});





        return Inertia::render('Dashboard/Index', [
            'stats' => $stats,
            'customers' => $customers,
            'recentFeedbacks' => $feedbacks,
        ]);
    }
}
