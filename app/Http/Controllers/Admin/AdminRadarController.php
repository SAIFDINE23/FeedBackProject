<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\GlobalRadarBuilder;
use App\Services\RadarAnalysisService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminRadarController extends Controller
{
    public function index(Request $request, GlobalRadarBuilder $builder, RadarAnalysisService $radar): Response
    {
        $days = (int) ($request->query('days', 30));
        $days = max(7, min($days, 90));

        $data = $builder->build($days);

        $analysis = $radar->analyzeGlobalWithCache(
            feedbacks: $data['analysis_feedbacks'],
            sentimentStats: $data['sentiment'],
            feedbacksWithComments: $data['feedbacks_with_comments'],
            context: [
                'period' => $data['period'],
                'kpis' => $data['kpis'],
                'ops' => $data['ops'],
            ]
        );

        $lastUpdated = $analysis['cached_at'] ?? now()->format('Y-m-d H:i');

        return Inertia::render('Admin/RadarIA', [
            'period' => $data['period'],
            'kpis' => $data['kpis'],
            'sentiment' => $data['sentiment'],
            'ops' => $data['ops'],
            'companiesAtRisk' => $data['companies_at_risk'],
            'analysis' => $analysis,
            'lastUpdated' => $lastUpdated,
        ]);
    }

    public function regenerate(Request $request, GlobalRadarBuilder $builder, RadarAnalysisService $radar): RedirectResponse
    {
        $days = (int) ($request->input('days', 30));
        $days = max(7, min($days, 90));

        $data = $builder->build($days);

        $radar->analyzeGlobalWithCache(
            feedbacks: $data['analysis_feedbacks'],
            sentimentStats: $data['sentiment'],
            feedbacksWithComments: $data['feedbacks_with_comments'],
            context: [
                'period' => $data['period'],
                'kpis' => $data['kpis'],
                'ops' => $data['ops'],
            ],
            force: true
        );

        return back()->with('success', 'Radar IA global régénéré.');
    }
}
