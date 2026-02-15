import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, feedbacks }) {
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [selectedFeedbackForQR, setSelectedFeedbackForQR] = useState(null);

    // Filtrage des feedbacks
    const filteredFeedbacks = feedbacks.data.filter(fb => {
        const matchesStatus = filterStatus === 'all' || fb.status === filterStatus;
        const matchesSearch = !searchTerm || 
            fb.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fb.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Stats calculées
    const stats = {
        total: feedbacks.data.length,
        sent: feedbacks.data.filter(fb => fb.status === 'sent').length,
        pending: feedbacks.data.filter(fb => fb.status === 'pending').length,
        completed: feedbacks.data.filter(fb => fb.status === 'completed').length,
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Feedbacks">
            <Head title="Feedbacks" />

            <div className="space-y-6">
                {/* Header Premium */}
                <div className="relative rounded-3xl overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700"></div>
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    </div>
                    <div className="relative p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-black text-white mb-2">Tous les Feedbacks</h1>
                                <p className="text-blue-100 text-lg">Gérez toutes les demandes et réponses de feedback</p>
                            </div>
                            <Link
                                href={route('customers.index')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                Envoyer une demande
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Cards Premium */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Total"
                        value={stats.total}
                        icon={<span className="text-2xl">📊</span>}
                        tone="slate"
                    />
                    <StatCard 
                        title="Envoyés"
                        value={stats.sent}
                        icon={<span className="text-2xl">📤</span>}
                        tone="blue"
                    />
                    <StatCard 
                        title="En attente"
                        value={stats.pending}
                        icon={<span className="text-2xl">⏳</span>}
                        tone="amber"
                    />
                    <StatCard 
                        title="Complétés"
                        value={stats.completed}
                        icon={<span className="text-2xl">✅</span>}
                        tone="emerald"
                    />
                </div>

                {/* Filters Premium */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search Premium */}
                        <div className="flex-1">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher un client..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Status Filter Premium */}
                        <div className="flex gap-2">
                            <FilterButton
                                active={filterStatus === 'all'}
                                onClick={() => setFilterStatus('all')}
                                label="Tous"
                                gradient="from-indigo-600 to-violet-600"
                            />
                            <FilterButton
                                active={filterStatus === 'sent'}
                                onClick={() => setFilterStatus('sent')}
                                label="Envoyés"
                                gradient="from-blue-600 to-cyan-600"
                            />
                            <FilterButton
                                active={filterStatus === 'pending'}
                                onClick={() => setFilterStatus('pending')}
                                label="En attente"
                                gradient="from-amber-500 to-orange-600"
                            />
                            <FilterButton
                                active={filterStatus === 'completed'}
                                onClick={() => setFilterStatus('completed')}
                                label="Complétés"
                                gradient="from-emerald-600 to-teal-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Feedbacks Table Premium */}
                <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
                    {filteredFeedbacks.length === 0 ? (
                        <div className="px-6 py-20 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {searchTerm || filterStatus !== 'all' ? 'Aucun feedback trouvé' : 'Aucun feedback pour le moment'}
                            </h3>
                            <p className="text-gray-500">
                                {searchTerm || filterStatus !== 'all' 
                                    ? 'Essayez de modifier vos filtres' 
                                    : 'Les feedbacks apparaîtront ici une fois envoyés'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                                Client
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                                Canal
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                                Note
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                                Commentaire
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-black text-gray-700 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredFeedbacks.map((fb) => (
                                            <tr key={fb.id} className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-transparent transition-all group">
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="relative">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-violet-600 rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
                                                            <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                                                {fb.customer?.name?.charAt(0).toUpperCase() || fb.customer?.email?.charAt(0).toUpperCase() || '?'}
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-bold text-gray-900">
                                                                {fb.customer?.name || 'Client supprimé'}
                                                            </div>
                                                            <div className="text-xs text-gray-500 font-medium">
                                                                {fb.customer?.email || '—'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <StatusBadge status={fb.status} />
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <ChannelBadge channel={fb.channel} />
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <Rating value={fb.feedback?.rating} />
                                                </td>
                                                <td className="px-6 py-5 max-w-xs">
                                                    <p className="text-gray-600 text-sm truncate font-medium">
                                                        {fb.feedback?.comment || '—'}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-semibold">
                                                    {new Date(fb.created_at).toLocaleDateString('fr-FR', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-right">
                                                    <FeedbackActions 
                                                        feedback={fb}
                                                        setQrModalOpen={setQrModalOpen}
                                                        setSelectedFeedbackForQR={setSelectedFeedbackForQR}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Premium */}
                            {feedbacks.links && feedbacks.links.length > 3 && (
                                <div className="px-6 py-4 border-t-2 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        {feedbacks.links.map((link, idx) => (
                                            <Link
                                                key={idx}
                                                href={link.url || '#'}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                                    link.active
                                                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg scale-105'
                                                        : link.url 
                                                            ? 'text-gray-700 hover:bg-white hover:shadow-md'
                                                            : 'text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modal QR Code */}
            {qrModalOpen && selectedFeedbackForQR && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setQrModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Code QR - Feedback</h3>
                            <button
                                onClick={() => setQrModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center">
                            <p className="text-sm text-gray-600 mb-4 text-center">
                                Scannez ce code QR pour accéder au formulaire de feedback
                            </p>
                            <img 
                                src={route('feedback-requests.qr', selectedFeedbackForQR.id)} 
                                alt="QR Code" 
                                className="w-64 h-64 bg-white p-4 rounded-lg shadow-sm"
                            />
                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500">Client: <span className="font-semibold text-gray-900">{selectedFeedbackForQR.customer?.name}</span></p>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <a
                                href={route('feedback-requests.qr', selectedFeedbackForQR.id)}
                                download={`qr-feedback-${selectedFeedbackForQR.id}.png`}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-950 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Télécharger
                            </a>
                            <button
                                onClick={() => setQrModalOpen(false)}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

/* ----------- COMPONENTS ----------- */

// Passer les fonctions de modal en props
function FeedbacksTable({ feedbacks, setQrModalOpen, setSelectedFeedbackForQR }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Canal</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Note</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Commentaire</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {feedbacks.map((fb) => (
                        <tr key={fb.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-900">{fb.customer?.name}</div>
                                <div className="text-xs text-gray-500">{fb.customer?.email || fb.customer?.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={fb.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <ChannelBadge channel={fb.channel} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {fb.feedback?.rating ? (
                                    <Rating value={fb.feedback.rating} />
                                ) : (
                                    <span className="text-xs text-gray-400">—</span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-700 max-w-xs truncate">
                                    {fb.feedback?.comment || <span className="text-gray-400">Aucun commentaire</span>}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {fb.created_at}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <FeedbackActions 
                                    feedback={fb} 
                                    setQrModalOpen={setQrModalOpen}
                                    setSelectedFeedbackForQR={setSelectedFeedbackForQR}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function StatCard({ title, value, icon, tone }) {
    const tones = {
        slate: {
            gradient: 'from-slate-500 via-slate-600 to-gray-600',
            border: 'border-slate-200'
        },
        blue: {
            gradient: 'from-blue-500 via-blue-600 to-cyan-600',
            border: 'border-blue-200'
        },
        amber: {
            gradient: 'from-amber-500 via-amber-600 to-orange-600',
            border: 'border-amber-200'
        },
        emerald: {
            gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
            border: 'border-emerald-200'
        }
    };

    return (
        <div className={`relative group bg-white rounded-2xl shadow-sm border-2 ${tones[tone].border} p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden`}>
            <div className="relative flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-1">{title}</p>
                    <p className="text-4xl font-black text-gray-900">{value}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tones[tone].gradient} text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

function FilterButton({ active, onClick, label, gradient }) {
    return (
        <button
            onClick={onClick}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                active 
                    ? `bg-gradient-to-r ${gradient} text-white shadow-lg scale-105` 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
        >
            {label}
        </button>
    );
}

function StatusBadge({ status }) {
    const statusConfig = {
        sent: {
            bg: 'bg-gradient-to-r from-blue-500 to-cyan-600',
            label: 'Envoyé',
            icon: '📤'
        },
        pending: {
            bg: 'bg-gradient-to-r from-amber-500 to-orange-600',
            label: 'En attente',
            icon: '⏳'
        },
        completed: {
            bg: 'bg-gradient-to-r from-emerald-500 to-teal-600',
            label: 'Complété',
            icon: '✅'
        }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white ${config.bg} shadow-md`}>
            <span>{config.icon}</span>
            {config.label}
        </span>
    );
}

function ChannelBadge({ channel }) {
    const channelConfig = {
        email: {
            bg: 'bg-gradient-to-r from-indigo-500 to-blue-600',
            label: 'Email',
            icon: '📧',
        },
        sms: {
            bg: 'bg-gradient-to-r from-emerald-500 to-teal-600',
            label: 'SMS',
            icon: '📱',
        },
        whatsapp: {
            bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
            label: 'WhatsApp',
            icon: '💬',
        },
        qr: {
            bg: 'bg-gradient-to-r from-purple-500 to-fuchsia-600',
            label: 'QR Code',
            icon: '📲',
        },
    };

    const config = channelConfig[channel] || {
        bg: 'bg-gradient-to-r from-gray-400 to-slate-500',
        label: '—',
        icon: '🔗',
    };

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white ${config.bg} shadow-md`}>
            <span>{config.icon}</span>
            {config.label}
        </span>
    );
}

function Rating({ value }) {
    if (!value) {
        return <span className="text-sm text-gray-400 font-semibold">Pas encore noté</span>;
    }
    
    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-5 h-5 ${star <= value ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                ))}
            </div>
            <span className="text-sm font-black text-gray-900">{value}/5</span>
        </div>
    );
}

function FeedbackActions({ feedback, setQrModalOpen, setSelectedFeedbackForQR }) {
    const handleQRClick = () => {
        setSelectedFeedbackForQR(feedback);
        setQrModalOpen(true);
    };

    if (feedback.status === 'completed' && feedback.feedback?.id) {
        return (
            <div className="flex items-center justify-end gap-2">
                <Link
                    href={route('feedback.adminShow', feedback.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all hover:scale-105"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Voir
                </Link>

                <Link
                    href={route('feedback.replies.index', feedback.feedback?.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all hover:scale-105"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Répondre
                </Link>

                <button
                    onClick={handleQRClick}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all hover:scale-105"
                    title="Générer code QR"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    QR
                </button>
            </div>
        );
    }

    if (feedback.status !== 'completed') {
        return (
            <div className="flex items-center justify-end gap-2">
                <span className="text-xs text-gray-500 font-bold">
                    En attente...
                </span>
                <button
                    onClick={handleQRClick}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all hover:scale-105"
                    title="Générer code QR"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    QR
                </button>
            </div>
        );
    }

    return <span className="text-xs text-gray-400">—</span>;
}
