<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Services\GlobalRadarBuilder;
use App\Services\RadarAnalysisService;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('radar:global {--days=30} {--force}', function (GlobalRadarBuilder $builder, RadarAnalysisService $radar) {
    $days = (int) $this->option('days');
    $days = max(7, min($days, 90));
    $force = (bool) $this->option('force');

    $data = $builder->build($days);

    $analysis = $radar->analyzeGlobalWithCache(
        feedbacks: $data['analysis_feedbacks'],
        sentimentStats: $data['sentiment'],
        feedbacksWithComments: $data['feedbacks_with_comments'],
        context: [
            'period' => $data['period'],
            'kpis' => $data['kpis'],
            'ops' => $data['ops'],
        ],
        force: $force
    );

    $this->info('Radar IA global généré.');
    $this->line('Période: ' . $data['period']['from'] . ' → ' . $data['period']['to']);
    $this->line('Status: ' . ($analysis['status'] ?? 'unknown') . ' | Cached: ' . (($analysis['cached'] ?? false) ? 'yes' : 'no'));
})->purpose('Générer le Radar IA global (admin plateforme)');
