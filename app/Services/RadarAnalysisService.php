<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class RadarAnalysisService
{
	public function analyze(array $feedbacks, array $sentimentStats = []): array
	{
		if (empty($feedbacks)) {
			return $this->fallbackAnalysis($feedbacks, $sentimentStats, 'Aucun feedback à analyser pour le moment.');
		}

		$prompt = $this->buildPrompt($feedbacks, $sentimentStats);

		try {
			$apiKey = config('services.gemini.api_key');
			$model = config('services.gemini.model') ?? 'models/gemini-2.5-flash:generateContent';

			if (! $apiKey) {
				return $this->fallbackAnalysis($feedbacks, $sentimentStats, 'Clé Gemini absente, analyse locale utilisée.');
			}

			$url = 'https://generativelanguage.googleapis.com/v1beta/' . $model
				. '?key=' . urlencode($apiKey);

			$response = Http::post($url, [
				'contents' => [
					[
						'parts' => [
							['text' => $prompt],
						],
					],
				],
			]);

			if (! $response->successful()) {
				return $this->fallbackAnalysis($feedbacks, $sentimentStats, 'Erreur Gemini API, analyse locale utilisée.');
			}

			$text = $response->json('candidates.0.content.parts.0.text');
			$parsed = $this->extractJson($text);

			if (! $parsed) {
				return $this->fallbackAnalysis($feedbacks, $sentimentStats, 'Réponse IA non exploitable, analyse locale utilisée.');
			}

			return [
				'status' => 'ok',
				'summary' => $parsed['summary'] ?? 'Analyse IA disponible.',
				'keyIssues' => $parsed['key_issues'] ?? [],
				'positiveDrivers' => $parsed['positive_drivers'] ?? [],
				'recommendations' => $parsed['recommendations'] ?? [],
				'confidence' => $parsed['confidence'] ?? 'moyenne',
				'model' => $model,
				'note' => $parsed['note'] ?? null,
			];
		} catch (\Throwable $e) {
			return $this->fallbackAnalysis($feedbacks, $sentimentStats, 'Exception IA, analyse locale utilisée.');
		}
	}

	private function buildPrompt(array $feedbacks, array $sentimentStats): string
	{
		$entries = collect($feedbacks)
			->take(120)
			->map(function ($f, $index) {
				$rating = $f['rating'] ?? 'N/A';
				$comment = trim($f['comment'] ?? '');
				$comment = mb_substr($comment, 0, 600);
				return ($index + 1) . ") Note: {$rating}/5 | Commentaire: {$comment}";
			})
			->implode("\n");

		$sentimentLine = ! empty($sentimentStats)
			? "Stats sentiment: positif={$sentimentStats['positive']}, neutre={$sentimentStats['neutral']}, negatif={$sentimentStats['negative']}."
			: '';

				return <<<PROMPT
Tu es un analyste CX senior. Analyse les feedbacks clients suivants pour produire une liste des PROBLÈMES À RÉSOUDRE.

Objectif: identifier uniquement les problèmes majeurs (pas de résumé général, pas de points positifs, pas de recommandations).

Contraintes:
- Répondre uniquement en JSON valide.
- Ne pas inventer de données.
- Utiliser un ton professionnel et concis.
- Se concentrer sur les problèmes concrets et actionnables.

Format JSON attendu:
{
	"key_issues": [
		{"title": "...", "detail": "...", "count": 0, "impact": "faible|moyen|fort"}
	],
	"confidence": "faible|moyenne|haute",
	"note": "..."
}

$sentimentLine

Feedbacks:
$entries
PROMPT;
	}

	private function extractJson(?string $text): ?array
	{
		if (! $text) {
			return null;
		}

		$start = strpos($text, '{');
		$end = strrpos($text, '}');

		if ($start === false || $end === false || $end <= $start) {
			return null;
		}

		$json = substr($text, $start, $end - $start + 1);
		$decoded = json_decode($json, true);

		return json_last_error() === JSON_ERROR_NONE ? $decoded : null;
	}

	private function fallbackAnalysis(array $feedbacks, array $sentimentStats, string $note): array
	{
		$issues = $this->extractTopKeywords($feedbacks, 6);

		return [
			'status' => 'fallback',
			'summary' => 'Analyse rapide basée sur les tendances les plus fréquentes dans les commentaires.',
			'keyIssues' => $issues,
			'positiveDrivers' => [],
			'recommendations' => [
				'Prioriser les problèmes les plus cités et communiquer un plan d’action.',
				'Suivre l’évolution mensuelle des notes et de la satisfaction.',
			],
			'confidence' => 'faible',
			'model' => null,
			'note' => $note,
		];
	}

	private function extractTopKeywords(array $feedbacks, int $limit = 5): array
	{
		$negative = collect($feedbacks)->filter(function ($f) {
			$rating = $f['rating'] ?? null;
			return $rating !== null && (int) $rating <= 2;
		})->values();

		$source = $negative->isNotEmpty() ? $negative : collect($feedbacks);

		$stopwords = [
			'avec','pour','dans','tout','mais','plus','moins','tres','très','etre','être','avoir','cela','cette',
			'nous','vous','leur','leurs','mon','ma','mes','ton','ta','tes','son','sa','ses','notre','votre','comme',
			'sur','sous','entre','ainsi','donc','alors','car','parce','ceci','cela','ici','là','trop','bien','pas',
			'que','qui','quoi','dont','quand','comment','où','oui','non','est','sont','avait','vais','fait','faire',
			'service','application','plateforme','produit','client','clients','été','etait','était','gentil','aimé',
			'aime','aimée','mere','mère','super','parfait','excellent','sympa','merci','bonjour','soir','tres','très'
		];

		$text = $source
			->pluck('comment')
			->filter()
			->implode(' ');

		if ($text === '') {
			return [];
		}

		$text = mb_strtolower($text);
		$text = preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $text);
		$words = preg_split('/\s+/', $text);

		$counts = [];
		foreach ($words as $word) {
			if (mb_strlen($word) < 4) {
				continue;
			}
			if (in_array($word, $stopwords, true)) {
				continue;
			}
			$counts[$word] = ($counts[$word] ?? 0) + 1;
		}

		arsort($counts);
		$top = array_slice($counts, 0, $limit, true);

		return collect($top)->map(function ($count, $word) {
			return [
				'title' => ucfirst($word),
				'detail' => 'Mention fréquente dans les commentaires.',
				'count' => $count,
				'impact' => $count >= 5 ? 'fort' : ($count >= 3 ? 'moyen' : 'faible'),
			];
		})->values()->all();
	}
}
