import { router, Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, stats, recentFeedbacks }) {
    return (
        <AuthenticatedLayout user={auth.user} header="Dashboard">
            <Head title="Dashboard" />

            <div className="space-y-6">

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                    <Link
                        href={route('customers.create')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Ajouter un client
                    </Link>

                    <Link
                        href={route('customers.index')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg shadow-sm border"
                    >
                        <UsersIcon className="w-5 h-5" />
                        Gérer les clients
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Clients" value={stats.customers} icon={<UsersIconSolid />} />
                    <StatCard title="Feedbacks Envoyés" value={stats.feedbacks_sent} icon={<SendIcon />} />
                    <StatCard title="Feedbacks Complétés" value={stats.feedbacks_completed} icon={<CheckIcon />} />
                    <StatCard title="Taux de Réponse" value={`${stats.response_rate}%`} icon={<ChartIcon />} />
                </div>

                {/* ⭐ RÉPARTITION DES NOTES */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Répartition des notes
                    </h3>

                    <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = stats.ratings?.[star] ?? 0;
                            const total = stats.feedbacks_completed || 1;

                            return (
                                <div key={star} className="flex items-center gap-4">
                                    <div className="w-16 font-medium text-sm">
                                        {star} ★
                                    </div>

                                    <div className="flex-1 bg-gray-100 rounded-full h-3">
                                        <div
                                            className="bg-yellow-400 h-3 rounded-full transition-all"
                                            style={{ width: `${(count / total) * 100}%` }}
                                        />
                                    </div>

                                    <div className="w-10 text-right text-sm text-gray-600">
                                        {count}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bonus UX */}
                    {(stats.ratings?.[4] + stats.ratings?.[5] > 0) && (
                        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                            ⭐ Clients satisfaits détectés — prêts pour Google Reviews
                        </div>
                    )}
                </div>

                {/* Recent Feedbacks Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-lg font-semibold">Derniers Feedbacks</h2>
                    </div>

                    <table className="w-full">
                        <tbody>
                            {recentFeedbacks.map((fb) => (
                                <tr key={fb.id} className="border-t">
                                    <td className="px-6 py-4">{fb.customer?.name}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={fb.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Rating value={fb.rating} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <FeedbackAction feedback={fb} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ title, value, icon }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <div className="mt-2 text-blue-600">{icon}</div>
        </div>
    );
}

function StatusBadge({ status }) {
    const map = {
        sent: 'bg-blue-100 text-blue-700',
        pending: 'bg-yellow-100 text-yellow-700',
        completed: 'bg-green-100 text-green-700',
    };
    return <span className={`px-3 py-1 rounded-full text-xs ${map[status]}`}>{status}</span>;
}

function Rating({ value }) {
    if (!value) return <span className="text-gray-400">—</span>;
    return (
        <span className="text-yellow-500 font-medium">{value} ★</span>
    );
}

function FeedbackAction({ feedback }) {
    if (feedback.status === 'completed') {
        return (
            <Link href={route('feedback.show', feedback.token)} className="text-green-600">
                Voir
            </Link>
        );
    }
    return <span className="text-gray-400">—</span>;
}

/* ---------------- ICONS ---------------- */
const PlusIcon = () => <span>＋</span>;
const UsersIcon = () => <span>👥</span>;
const UsersIconSolid = () => <span>👤</span>;
const SendIcon = () => <span>📤</span>;
const CheckIcon = () => <span>✅</span>;
const ChartIcon = () => <span>📊</span>;
