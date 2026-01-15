import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, feedbacks }) {
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

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
        <AuthenticatedLayout 
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Tous les Feedbacks
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Gérez toutes les demandes de feedback
                        </p>
                    </div>
                    <Link
                        href={route('customers.index')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Envoyer une demande
                    </Link>
                </div>
            }
        >
            <Head title="Feedbacks" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                            title="Total"
                            value={stats.total}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                            bgColor="from-slate-500 to-slate-600"
                        />
                        <StatCard 
                            title="Envoyés"
                            value={stats.sent}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                            bgColor="from-blue-500 to-blue-600"
                        />
                        <StatCard 
                            title="En attente"
                            value={stats.pending}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            bgColor="from-yellow-500 to-yellow-600"
                        />
                        <StatCard 
                            title="Complétés"
                            value={stats.completed}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            bgColor="from-green-500 to-green-600"
                        />
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Rechercher un client..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilterStatus('all')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        filterStatus === 'all' 
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Tous
                                </button>
                                <button
                                    onClick={() => setFilterStatus('sent')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        filterStatus === 'sent' 
                                            ? 'bg-blue-600 text-white shadow-md' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Envoyés
                                </button>
                                <button
                                    onClick={() => setFilterStatus('pending')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        filterStatus === 'pending' 
                                            ? 'bg-yellow-600 text-white shadow-md' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    En attente
                                </button>
                                <button
                                    onClick={() => setFilterStatus('completed')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        filterStatus === 'completed' 
                                            ? 'bg-green-600 text-white shadow-md' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Complétés
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Feedbacks Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {filteredFeedbacks.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="text-gray-500 font-medium text-lg">
                                    {searchTerm || filterStatus !== 'all' ? 'Aucun feedback trouvé' : 'Aucun feedback pour le moment'}
                                </p>
                                <p className="text-gray-400 text-sm mt-2">
                                    {searchTerm || filterStatus !== 'all' 
                                        ? 'Essayez de modifier vos filtres' 
                                        : 'Les feedbacks apparaîtront ici une fois envoyés'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Client
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Statut
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Note
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Commentaire
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredFeedbacks.map((fb) => (
                                                <tr key={fb.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                                {fb.customer?.name?.charAt(0).toUpperCase() || fb.customer?.email?.charAt(0).toUpperCase() || '?'}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-semibold text-gray-900">
                                                                    {fb.customer?.name || 'Client supprimé'}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {fb.customer?.email || '—'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <StatusBadge status={fb.status} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Rating value={fb.feedback?.rating} />
                                                    </td>
                                                    <td className="px-6 py-4 max-w-xs">
                                                        <p className="text-gray-600 text-sm truncate">
                                                            {fb.feedback?.comment || '—'}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(fb.created_at).toLocaleDateString('fr-FR', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <FeedbackActions feedback={fb} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {feedbacks.links && feedbacks.links.length > 3 && (
                                    <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {feedbacks.links.map((link, idx) => (
                                                <Link
                                                    key={idx}
                                                    href={link.url || '#'}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                        link.active
                                                            ? 'bg-blue-600 text-white shadow-sm'
                                                            : link.url 
                                                                ? 'text-gray-700 hover:bg-gray-200'
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
            </div>
        </AuthenticatedLayout>
    );
}

/* ----------- COMPONENTS ----------- */

function StatCard({ title, value, icon, bgColor }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${bgColor} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {icon}
                </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
}

function StatusBadge({ status }) {
    const statusConfig = {
        sent: {
            bg: 'bg-blue-100',
            text: 'text-blue-700',
            label: 'Envoyé',
            icon: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
        },
        pending: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-700',
            label: 'En attente',
            icon: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
        },
        completed: {
            bg: 'bg-green-100',
            text: 'text-green-700',
            label: 'Complété',
            icon: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
        }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.icon}
            {config.label}
        </span>
    );
}

function Rating({ value }) {
    if (!value) {
        return <span className="text-sm text-gray-400 font-medium">Pas encore noté</span>;
    }
    
    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-4 h-4 ${star <= value ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                ))}
            </div>
            <span className="text-sm font-semibold text-gray-900">{value}/5</span>
        </div>
    );
}

function FeedbackActions({ feedback }) {
    if (feedback.status === 'completed' && feedback.feedback?.id) {
        return (
            <div className="flex items-center justify-end gap-2">
                <Link
                    href={route('feedback.adminShow', feedback.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Voir
                </Link>

                <Link
                    href={route('feedback.replies.index', feedback.feedback?.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Répondre
                </Link>
            </div>
        );
    }

    if (feedback.status !== 'completed') {
        return (
            <span className="text-xs text-gray-500 font-medium">
                En attente de réponse...
            </span>
        );
    }

    return <span className="text-xs text-gray-400">—</span>;
}