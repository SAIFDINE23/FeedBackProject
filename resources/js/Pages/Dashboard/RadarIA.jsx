import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';

export default function RadarIA({ auth, stats, analysis, lastUpdated, period, trends, signals, recommendedActions, channels, benchmarks, healthScore }) {
    const [loading, setLoading] = useState(false);
    const [creatingTask, setCreatingTask] = useState(false);
    const total = stats?.total || 0;
    const positiveRate = stats?.positiveRate || 0;
    const negativeRate = stats?.negativeRate || 0;
    const neutralRate = total > 0 ? Math.max(0, 100 - positiveRate - negativeRate) : 0;

    useEffect(() => {
        const start = () => setLoading(true);
        const finish = () => setLoading(false);

        const offStart = router.on('start', start);
        const offFinish = router.on('finish', finish);

        return () => {
            offStart();
            offFinish();
        };
    }, []);

    const handleCreateTask = (action) => {
        if (!action?.title) {
            return;
        }

        const priority = (action.priority || '').toUpperCase();
        const importance = priority === 'P0' ? 'high' : priority === 'P1' ? 'medium' : 'low';

        const contextLines = [];
        if (action.context?.signal_title) {
            contextLines.push(`Signal: ${action.context.signal_title}`);
        }
        if (action.context?.signal_detail) {
            contextLines.push(`Détail: ${action.context.signal_detail}`);
        }
        if (Array.isArray(action.context?.evidence) && action.context.evidence.length) {
            contextLines.push('Exemples:');
            action.context.evidence.slice(0, 3).forEach((e) => {
                contextLines.push(`- ${e}`);
            });
        }

        const description = [action.detail, ...contextLines].filter(Boolean).join('\n');

        setCreatingTask(true);

        router.post(
            route('tasks.store'),
            {
                title: action.title,
                description: description || null,
                importance,
            },
            {
                preserveScroll: true,
                onFinish: () => setCreatingTask(false),
            }
        );
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Radar IA">
            <Head title="Radar IA" />

            <div className="space-y-6">
                {loading && (
                    <div className="flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
                        <Spinner />
                        <span>Analyse en cours… merci de patienter quelques secondes.</span>
                    </div>
                )}
                <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg border border-indigo-500/40 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">Radar IA — Entreprise</h1>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/20">
                                    {period?.days ?? 30}j
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-indigo-50/90">
                                Période: <span className="font-semibold text-white">{period?.from}</span> → <span className="font-semibold text-white">{period?.to}</span>
                            </p>
                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-indigo-50/90">
                                    Dernière mise à jour: <span className="font-semibold text-white">{lastUpdated}</span>
                                </span>
                                <span className="hidden sm:inline text-white/40">•</span>
                                <span className="text-xs text-indigo-50/90">
                                    Confiance: <span className="font-semibold text-white">{analysis?.confidence || '—'}</span>
                                </span>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${
                            analysis?.cached 
                                ? 'bg-emerald-500/10 text-white border-emerald-300/40' 
                                : 'bg-white/10 text-white border-white/30'
                        }`}>
                            <span className={`w-2 h-2 rounded-full ${analysis?.cached ? 'bg-emerald-400' : 'bg-white animate-pulse'}`} />
                            {analysis?.cached ? '✓ Mise en cache' : 'Analyse en cours'}
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.location.assign(route('radar.export', { days: period?.days ?? 30 }))}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-indigo-700 text-sm font-semibold hover:bg-indigo-50"
                        >
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Indicateur de cache */}
                {analysis?.cached && (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800 text-sm">
                        <strong>✅ Analyse en cache:</strong> Les mêmes feedbacks génèrent instantanément la même analyse. 
                        <span className="block text-xs mt-1 opacity-75">Mise en cache depuis {analysis?.cached_at}</span>
                    </div>
                )}

                {analysis?.status === 'fallback' && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 text-sm">
                        <strong>Mode local:</strong> {analysis?.note || 'Analyse IA indisponible, affichage d’une analyse locale.'}
                    </div>
                )}

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Feedbacks analysés" value={total} tone="blue" />
                    <StatCard title="Positifs" value={stats?.positive || 0} tone="emerald" />
                    <StatCard title="Négatifs" value={stats?.negative || 0} tone="rose" />
                    <StatCard title="Neutres" value={stats?.neutral || 0} tone="amber" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900">Résumé exécutif</h3>
                        <p className="text-sm text-gray-600 mt-1">Synthèse orientée décision</p>
                        <p className="mt-4 text-gray-700 leading-relaxed">{analysis?.summary || '—'}</p>
                        {analysis?.note && (
                            <p className="text-xs text-gray-500 mt-3">Note: {analysis.note}</p>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Sentiment</h3>
                        <p className="text-xs text-gray-500">Répartition sur la période</p>
                        <div className="mt-4">
                            <SentimentDonut
                                positive={stats?.positive || 0}
                                neutral={stats?.neutral || 0}
                                negative={stats?.negative || 0}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">Tendances clés</h3>
                            <span className="text-xs text-gray-500">Vs période précédente</span>
                        </div>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <TrendCard label="Taux positif" value={trends?.positiveRate?.current} delta={trends?.positiveRate?.delta} unit="%" />
                            <TrendCard label="Taux négatif" value={trends?.negativeRate?.current} delta={trends?.negativeRate?.delta} unit="%" inverse />
                            <TrendCard label="Taux de réponse" value={trends?.responseRate?.current} delta={trends?.responseRate?.delta} unit="%" />
                            <TrendCard label="Note moyenne" value={trends?.avgRating?.current} delta={trends?.avgRating?.delta} unit="" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Health Score</h3>
                        <p className="text-xs text-gray-500">Synthèse globale (0–100)</p>
                        <div className="mt-4">
                            <HealthScoreCard score={healthScore?.score} drivers={healthScore?.drivers} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900">Benchmarks internes</h3>
                    <p className="text-xs text-gray-500">Comparaison anonyme vs autres entreprises</p>
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-600">
                                    <th className="py-2 pr-4">Métrique</th>
                                    <th className="py-2 pr-4">Vous</th>
                                    <th className="py-2 pr-4">Médiane</th>
                                    <th className="py-2">Percentile</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(benchmarks || {}).map((b) => (
                                    <tr key={b.label} className="border-t border-gray-100">
                                        <td className="py-3 pr-4 font-semibold text-gray-900">{b.label}</td>
                                        <td className="py-3 pr-4 text-gray-900">{b.company ?? '—'}</td>
                                        <td className="py-3 pr-4 text-gray-900">{b.median ?? '—'}</td>
                                        <td className="py-3 text-gray-900">{b.percentile !== null ? `${b.percentile}%` : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900">Canaux (30j)</h3>
                    <p className="text-xs text-gray-500">Distribution des demandes</p>
                    <div className="mt-4">
                        <ChannelBars channels={channels} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Signals */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Signaux détectés</h3>
                            <span className="text-xs text-gray-500">Anomalies & opportunités</span>
                        </div>
                        {signals?.length ? (
                            <ul className="mt-4 space-y-3">
                                {signals.map((signal, idx) => (
                                    <li key={`${signal.title}-${idx}`} className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <CategoryBadge category={signal.category} />
                                                    <SeverityBadge severity={signal.severity} />
                                                </div>
                                                <p className="mt-2 font-semibold text-gray-900">{signal.title}</p>
                                                <p className="text-sm text-gray-600 mt-1">{signal.detail}</p>
                                                {signal.evidence?.length ? (
                                                    <div className="mt-3 space-y-2">
                                                        <p className="text-xs font-semibold text-gray-500">Exemples</p>
                                                        {signal.evidence.map((e, eidx) => (
                                                            <div key={`${signal.title}-e-${eidx}`} className="text-xs text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2">
                                                                “{e}”
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : null}
                                            </div>
                                            {typeof signal.evidence_count === 'number' && (
                                                <p className="text-xs text-gray-500">x{signal.evidence_count}</p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-3 text-sm text-gray-500">Aucun signal critique détecté.</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Actions recommandées</h3>
                            <span className="text-xs text-gray-500">Priorisées</span>
                        </div>
                        {recommendedActions?.length ? (
                            <ul className="mt-4 space-y-3">
                                {recommendedActions.map((action, idx) => (
                                    <li key={`${action.title}-${idx}`} className="p-4 border border-gray-100 rounded-lg bg-white">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900">{action.title}</p>
                                                <p className="text-sm text-gray-600 mt-1">{action.detail}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {action.priority && (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                                        {action.priority}
                                                    </span>
                                                )}
                                                <button
                                                    type="button"
                                                    disabled={creatingTask}
                                                    onClick={() => handleCreateTask(action)}
                                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                                                >
                                                    Créer une tâche
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-3 text-sm text-gray-500">Aucune action prioritaire pour l’instant.</p>
                        )}
                    </div>
                </div>

                {/* Key Issues Only */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Liste des problèmes à résoudre</h3>
                        <span className="text-xs text-gray-500">Confiance: {analysis?.confidence || '—'}</span>
                    </div>
                    {analysis?.keyIssues?.length ? (
                        <ul className="mt-4 space-y-3">
                            {analysis.keyIssues.map((issue, idx) => (
                                <li key={`${issue.title}-${idx}`} className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-gray-900">{issue.title}</p>
                                            <p className="text-sm text-gray-600 mt-1">{issue.detail}</p>
                                        </div>
                                        <div className="text-right">
                                            <ImpactBadge impact={issue.impact} />
                                            <p className="text-xs text-gray-500 mt-2">{issue.count || 0} mentions</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-3 text-sm text-gray-500">Aucun problème majeur détecté pour l’instant.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function SentimentDonut({ positive = 0, neutral = 0, negative = 0 }) {
    const total = Math.max(positive + neutral + negative, 0);

    const radius = 16;
    const circumference = 2 * Math.PI * radius;

    const seg = (value) => (total > 0 ? (value / total) * circumference : 0);

    const positiveLen = seg(positive);
    const neutralLen = seg(neutral);
    const negativeLen = seg(negative);

    const positiveOffset = 0;
    const neutralOffset = -positiveLen;
    const negativeOffset = -(positiveLen + neutralLen);

    return (
        <div className="flex items-center gap-5">
            <div className="relative">
                <svg width="120" height="120" viewBox="0 0 40 40" className="block">
                    <circle
                        cx="20"
                        cy="20"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        className="text-gray-200"
                        strokeWidth="6"
                    />

                    <circle
                        cx="20"
                        cy="20"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        className="text-emerald-500"
                        strokeWidth="6"
                        strokeDasharray={`${positiveLen} ${Math.max(circumference - positiveLen, 0)}`}
                        strokeDashoffset={positiveOffset}
                        transform="rotate(-90 20 20)"
                    />

                    <circle
                        cx="20"
                        cy="20"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        className="text-amber-500"
                        strokeWidth="6"
                        strokeDasharray={`${neutralLen} ${Math.max(circumference - neutralLen, 0)}`}
                        strokeDashoffset={neutralOffset}
                        transform="rotate(-90 20 20)"
                    />

                    <circle
                        cx="20"
                        cy="20"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        className="text-rose-500"
                        strokeWidth="6"
                        strokeDasharray={`${negativeLen} ${Math.max(circumference - negativeLen, 0)}`}
                        strokeDashoffset={negativeOffset}
                        transform="rotate(-90 20 20)"
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-xl font-bold text-gray-900">{total}</div>
                    <div className="text-[11px] font-semibold text-gray-500">feedbacks</div>
                </div>
            </div>

            <div className="flex-1">
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <span className="text-sm text-gray-700">Positif</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{positive}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            <span className="text-sm text-gray-700">Neutre</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{neutral}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                            <span className="text-sm text-gray-700">Négatif</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{negative}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, tone }) {
    const tones = {
        blue: 'from-blue-500 to-indigo-600',
        emerald: 'from-emerald-500 to-teal-600',
        rose: 'from-rose-500 to-pink-600',
        amber: 'from-amber-400 to-orange-500',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600">{title}</p>
            <div className="flex items-center justify-between mt-3">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tones[tone]} opacity-90`} />
            </div>
        </div>
    );
}

function TrendCard({ label, value, delta, unit = '', inverse = false }) {
    const numeric = typeof value === 'number' ? value : null;
    const deltaNumber = typeof delta === 'number' ? delta : null;
    const isPositive = deltaNumber !== null ? deltaNumber >= 0 : null;
    const tone = isPositive === null
        ? 'text-gray-500'
        : (inverse ? !isPositive : isPositive)
            ? 'text-emerald-600'
            : 'text-rose-600';

    return (
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
            <p className="text-sm text-gray-600">{label}</p>
            <div className="flex items-end justify-between mt-2">
                <p className="text-2xl font-bold text-gray-900">
                    {numeric === null ? '—' : `${numeric}${unit}`}
                </p>
                {deltaNumber !== null ? (
                    <span className={`text-xs font-semibold ${tone}`}>
                        {deltaNumber >= 0 ? '▲' : '▼'} {Math.abs(deltaNumber)}{unit}
                    </span>
                ) : (
                    <span className="text-xs text-gray-400">—</span>
                )}
            </div>
        </div>
    );
}

function ChannelBars({ channels }) {
    if (!channels?.length) {
        return <p className="text-sm text-gray-500">Aucune donnée disponible.</p>;
    }

    const max = Math.max(...channels.map((c) => c.count), 1);

    return (
        <div className="space-y-3">
            {channels.map((c) => (
                <div key={c.channel}>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span className="uppercase tracking-wide">{c.channel}</span>
                        <span className="font-semibold text-gray-900">{c.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${Math.round((c.count / max) * 100)}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

function HealthScoreCard({ score, drivers }) {
    const value = typeof score === 'number' ? score : null;
    const tone = value === null
        ? 'bg-gray-200'
        : value >= 80
            ? 'bg-emerald-500'
            : value >= 60
                ? 'bg-amber-500'
                : 'bg-rose-500';

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-3xl font-bold text-gray-900">{value ?? '—'}</p>
                    <p className="text-xs text-gray-500">Score global</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500">Drivers</p>
                    <p className="text-xs text-gray-600">Note / Négatif / Réponse / Échecs</p>
                </div>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                    className={`h-full ${tone}`}
                    style={{ width: `${value ?? 0}%` }}
                />
            </div>
            {drivers && (
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                    <div>Score note: <span className="font-semibold text-gray-900">{drivers.rating_score ?? '—'}</span></div>
                    <div>Pénalité négatif: <span className="font-semibold text-gray-900">{drivers.negative_penalty ?? '—'}</span></div>
                    <div>Pénalité réponse: <span className="font-semibold text-gray-900">{drivers.response_penalty ?? '—'}</span></div>
                    <div>Pénalité échecs: <span className="font-semibold text-gray-900">{drivers.failed_penalty ?? '—'}</span></div>
                </div>
            )}
        </div>
    );
}

function ImpactBadge({ impact }) {
    const map = {
        faible: 'bg-green-100 text-green-700',
        moyen: 'bg-amber-100 text-amber-700',
        fort: 'bg-rose-100 text-rose-700',
    };
    const tone = map[impact] || 'bg-gray-100 text-gray-600';

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${tone}`}>
            {impact || '—'}
        </span>
    );
}

function SeverityBadge({ severity }) {
    const normalized = (severity || '').toLowerCase();
    const style =
        normalized === 'high'
            ? 'bg-rose-100 text-rose-700'
            : normalized === 'medium'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-emerald-100 text-emerald-700';

    const label = normalized === 'high' ? 'High' : normalized === 'medium' ? 'Medium' : 'Low';

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${style}`}>
            {label}
        </span>
    );
}

function CategoryBadge({ category }) {
    const normalized = (category || '').toLowerCase();
    const style =
        normalized === 'risk'
            ? 'bg-rose-100 text-rose-700'
            : normalized === 'ops'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-violet-100 text-violet-700';
    const label = normalized === 'risk' ? 'Risk' : normalized === 'ops' ? 'Ops' : 'Opportunity';

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${style}`}>
            {label}
        </span>
    );
}

function Spinner() {
    return (
        <span className="relative flex h-5 w-5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-50" />
            <span className="relative inline-flex h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </span>
    );
}
