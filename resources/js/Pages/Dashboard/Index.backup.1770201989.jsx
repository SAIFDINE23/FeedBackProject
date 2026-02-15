import { Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    TrendingUp, 
    MessageSquare, 
    Users, 
    Send,
    Mail,
    Smartphone,
    MessageCircle,
    ExternalLink,
    Calendar,
    Star
} from 'lucide-react';

export default function Dashboard({ 
    totalCustomers = 0,
    totalFeedbacks = 0,
    totalRequests = 0,
    avgRating = 0,
    insights = null,
    recentFeedbacks = [],
    channelData = null,
    trendData = null,
    ratingDistribution = null,
    sentimentCounts = null,
}) {
    // Calculate sentiment totals
    const positive = sentimentCounts?.positive || 0;
    const neutral = sentimentCounts?.neutral || 0;
    const negative = sentimentCounts?.negative || 0;
    const totalSentiment = positive + neutral + negative;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de votre plateforme de feedback</p>
                    </div>
                    <Link
                        href={route('customers.create')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <Users className="w-4 h-4" />
                        Ajouter un client
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={<Users className="w-5 h-5" />}
                        label="Total Clients"
                        value={totalCustomers}
                        subtext="clients actifs"
                        color="blue"
                    />
                    <StatCard
                        icon={<MessageSquare className="w-5 h-5" />}
                        label="Feedbacks Reçus"
                        value={totalFeedbacks}
                        subtext="feedbacks collectés"
                        color="blue"
                    />
                    <StatCard
                        icon={<Send className="w-5 h-5" />}
                        label="Demandes Envoyées"
                        value={totalRequests}
                        subtext="demandes envoyées"
                        color="blue"
                    />
                    <StatCard
                        icon={<Star className="w-5 h-5" />}
                        label="Note Moyenne"
                        value={avgRating ? avgRating.toFixed(1) : '—'}
                        subtext="sur 5 étoiles"
                        color="blue"
                    />
                </div>

                {/* Insight Badge */}
                {insights && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-blue-900">{insights.message}</p>
                                <p className="text-xs text-blue-700 mt-1">{insights.detail}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Rating Distribution */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution des Notes</h3>
                        <div className="space-y-3">
                            {ratingDistribution && Object.keys(ratingDistribution)
                                .sort((a, b) => b - a)
                                .map((rating) => {
                                    const count = ratingDistribution[rating] || 0;
                                    const maxCount = Math.max(...Object.values(ratingDistribution), 1);
                                    const percentage = (count / maxCount) * 100;
                                    
                                    return (
                                        <div key={rating} className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-gray-700 w-16">{rating} étoiles</span>
                                            <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-600 transition-all duration-500 flex items-center justify-end pr-3"
                                                    style={{ width: `${percentage}%` }}
                                                >
                                                    {count > 0 && (
                                                        <span className="text-xs font-semibold text-white">{count}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Sentiment Analysis */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse des Sentiments</h3>
                        <div className="flex items-center gap-6">
                            {/* Donut Chart */}
                            <SentimentDonut positive={positive} neutral={neutral} negative={negative} />
                            
                            {/* Legend */}
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-emerald-500" />
                                        <span className="text-sm text-gray-700">Positif</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{positive}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-amber-500" />
                                        <span className="text-sm text-gray-700">Neutre</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{neutral}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-rose-500" />
                                        <span className="text-sm text-gray-700">Négatif</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{negative}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trends */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendance des Feedbacks</h3>
                    <TrendBars data={trendData} />
                </div>

                {/* Channels */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Canaux de Communication</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ChannelCard
                            channel="Email"
                            icon={<Mail className="w-6 h-6 text-blue-600" />}
                            count={channelData?.email || 0}
                            total={totalRequests}
                        />
                        <ChannelCard
                            channel="SMS"
                            icon={<Smartphone className="w-6 h-6 text-blue-600" />}
                            count={channelData?.sms || 0}
                            total={totalRequests}
                        />
                        <ChannelCard
                            channel="WhatsApp"
                            icon={<MessageCircle className="w-6 h-6 text-blue-600" />}
                            count={channelData?.whatsapp || 0}
                            total={totalRequests}
                        />
                    </div>
                </div>

                {/* Recent Feedbacks */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Feedbacks Récents</h3>
                        <Link
                            href={route('feedbacks.index')}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                            Voir tout
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>
                    
                    {recentFeedbacks && recentFeedbacks.length > 0 ? (
                        <div className="space-y-3">
                            {recentFeedbacks.map((feedback) => (
                                <div
                                    key={feedback.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <p className="text-sm font-medium text-gray-900">{feedback.customer_name}</p>
                                            {feedback.rating && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                                                    <span className="text-sm font-medium text-gray-700">{feedback.rating}</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{feedback.comment || '—'}</p>
                                    </div>
                                    <div className="flex items-center gap-4 ml-4">
                                        <span className="text-xs text-gray-500">
                                            {new Date(feedback.created_at).toLocaleDateString('fr-FR')}
                                        </span>
                                        {feedback.status === 'completed' && (
                                            <Link
                                                href={route('feedback.adminShow', feedback.id)}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                            >
                                                Voir
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-8">Aucun feedback récent</p>
                    )}
                </div>

                {/* CTA - Google Reviews */}
                {avgRating >= 4 && totalFeedbacks > 0 && (
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Vos clients sont satisfaits ! 🎉</h3>
                                <p className="text-sm text-blue-100 mt-1">
                                    Encouragez-les à laisser un avis sur Google pour booster votre réputation.
                                </p>
                            </div>
                            <a
                                href="https://search.google.com/local/writereview"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                            >
                                Demander des avis
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

/* ================== COMPONENTS ================== */

function StatCard({ icon, label, value, subtext, color = 'blue' }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    <p className="text-xs text-gray-500 mt-1">{subtext}</p>
                </div>
                <div className={`flex-shrink-0 w-12 h-12 bg-${color}-600 rounded-lg flex items-center justify-center text-white`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

function ChannelCard({ channel, icon, count, total }) {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    {icon}
                </div>
                <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
            </div>
            
            <p className="text-sm font-medium text-gray-700">{channel}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
            <p className="text-xs text-gray-500 mt-1">demandes envoyées</p>

            {/* Progress bar */}
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-blue-600 transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
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
                <div className="text-[11px] font-medium text-gray-500">feedbacks</div>
            </div>
        </div>
    );
}

function TrendBars({ data }) {
    if (!data?.length) {
        return (
            <div className="flex items-center justify-center h-40 text-sm text-gray-500">
                Aucune donnée disponible
            </div>
        );
    }

    const max = Math.max(...data.map((d) => d.count), 1);

    return (
        <div className="flex items-end gap-3 h-40">
            {data.map((point) => {
                const height = Math.round((point.count / max) * 100);
                return (
                    <div key={point.date} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full bg-gray-100 rounded-lg overflow-hidden h-32 flex items-end relative">
                            <div
                                className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-t-lg relative"
                                style={{ height: `${height}%` }}
                                title={`${point.count} feedback(s) - ${point.date}`}
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                    {point.count} feedbacks
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] font-medium text-gray-500 group-hover:text-blue-600 transition-colors">
                            {point.date.slice(5)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
