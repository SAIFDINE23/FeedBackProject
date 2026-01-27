import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useMemo } from 'react';

export default function AdminCompanies({ stats, sectorDistribution, monthlyEvolution, topCompanies, companies }) {
    // Fonction pour formater les nombres
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    // Calcul du max pour le graphique
    const maxMonthlyCount = useMemo(() => {
        return Math.max(...monthlyEvolution.map(item => item.count), 1);
    }, [monthlyEvolution]);

    // Couleurs pour les secteurs
    const sectorColors = [
        'from-blue-500 to-blue-600',
        'from-purple-500 to-purple-600',
        'from-green-500 to-green-600',
        'from-orange-500 to-orange-600',
        'from-pink-500 to-pink-600',
        'from-indigo-500 to-indigo-600',
        'from-teal-500 to-teal-600',
        'from-red-500 to-red-600',
    ];

    return (
        <AdminLayout header="Entreprises">
            <Head title="Admin - Entreprises" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* KPIs Principaux */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Entreprises */}
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 mb-1">Total Entreprises</p>
                                        <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalCompanies)}</p>
                                        <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                                            <span>↗</span> {stats.companiesThisMonth} ce mois
                                        </p>
                                    </div>
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Entreprises Actives */}
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 mb-1">Entreprises Actives</p>
                                        <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.activeCompanies)}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {stats.totalCompanies > 0 ? Math.round((stats.activeCompanies / stats.totalCompanies) * 100) : 0}% du total
                                        </p>
                                    </div>
                                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Taux d'Engagement */}
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 mb-1">Taux d'Engagement</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.engagementRate}%</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Entreprises actives
                                        </p>
                                    </div>
                                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Croissance Mensuelle */}
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 mb-1">Croissance Mensuelle</p>
                                        <p className={`text-3xl font-bold ${stats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {stats.monthlyGrowth >= 0 ? '+' : ''}{stats.monthlyGrowth}%
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            vs mois dernier
                                        </p>
                                    </div>
                                    <div className={`w-14 h-14 bg-gradient-to-br ${stats.monthlyGrowth >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600'} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Métriques Secondaires */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium opacity-90">Clients Moyens</h3>
                                <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-bold">{stats.avgCustomersPerCompany}</p>
                                <span className="text-sm opacity-75">/ entreprise</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/20">
                                <p className="text-xs opacity-75">{formatNumber(stats.totalCustomers)} clients au total</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium opacity-90">Feedbacks Moyens</h3>
                                <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-bold">{stats.avgFeedbacksPerCompany}</p>
                                <span className="text-sm opacity-75">/ entreprise</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/20">
                                <p className="text-xs opacity-75">{formatNumber(stats.totalFeedbackRequests)} demandes totales</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium opacity-90">Secteurs Actifs</h3>
                                <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-bold">{sectorDistribution.length}</p>
                                <span className="text-sm opacity-75">secteurs</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/20">
                                <p className="text-xs opacity-75">Diversité sectorielle</p>
                            </div>
                        </div>
                    </div>

                    {/* Graphiques et Répartitions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Évolution sur 12 mois - Line Chart */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Évolution sur 12 mois</h3>
                                    <p className="text-sm text-gray-500 mt-1">Nouvelles entreprises par mois</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-xs text-gray-600 font-medium">Entreprises</span>
                                </div>
                            </div>
                            
                            <div className="relative">
                                {/* Grille de fond */}
                                <div className="absolute inset-0 flex flex-col justify-between pb-12 pr-4">
                                    {[maxMonthlyCount, Math.floor(maxMonthlyCount * 0.75), Math.floor(maxMonthlyCount * 0.5), Math.floor(maxMonthlyCount * 0.25), 0].map((value, idx) => (
                                        <div key={idx} className="flex items-center">
                                            <span className="text-xs text-gray-400 w-8 text-right">{value}</span>
                                            <div className="flex-1 border-t border-gray-100 ml-2"></div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Line Chart SVG */}
                                <div className="relative h-64 ml-10">
                                    <svg className="w-full h-full" viewBox="0 0 1000 256" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="monthlyGradient" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        
                                        {/* Zone sous la courbe */}
                                        <path
                                            d={(() => {
                                                const points = monthlyEvolution.map((item, index) => {
                                                    const x = (index / (monthlyEvolution.length - 1)) * 1000;
                                                    const y = 256 - (maxMonthlyCount > 0 ? (item.count / maxMonthlyCount) * 256 : 0);
                                                    return `${x},${y}`;
                                                });
                                                return `M 0,256 L ${points.join(' L ')} L 1000,256 Z`;
                                            })()}
                                            fill="url(#monthlyGradient)"
                                        />
                                        
                                        {/* Ligne principale */}
                                        <polyline
                                            points={monthlyEvolution.map((item, index) => {
                                                const x = (index / (monthlyEvolution.length - 1)) * 1000;
                                                const y = 256 - (maxMonthlyCount > 0 ? (item.count / maxMonthlyCount) * 256 : 0);
                                                return `${x},${y}`;
                                            }).join(' ')}
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="drop-shadow-lg"
                                        />
                                        
                                        {/* Points */}
                                        {monthlyEvolution.map((item, index) => {
                                            const x = (index / (monthlyEvolution.length - 1)) * 1000;
                                            const y = 256 - (maxMonthlyCount > 0 ? (item.count / maxMonthlyCount) * 256 : 0);
                                            
                                            return (
                                                <g key={index}>
                                                    <circle
                                                        cx={x}
                                                        cy={y}
                                                        r="5"
                                                        fill="white"
                                                        stroke="#3b82f6"
                                                        strokeWidth="2"
                                                        className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer drop-shadow-md"
                                                    />
                                                    <circle cx={x} cy={y} r="8" fill="transparent" className="cursor-pointer">
                                                        <title>{item.month}: {item.count} entreprise{item.count > 1 ? 's' : ''}</title>
                                                    </circle>
                                                </g>
                                            );
                                        })}
                                    </svg>
                                    
                                    {/* Labels mois */}
                                    <div className="absolute bottom-0 left-0 right-0 flex justify-between mt-2 px-1">
                                        {monthlyEvolution.map((item, index) => {
                                            if (index % 2 !== 0) return null;
                                            return (
                                                <span key={index} className="text-xs text-gray-500 font-medium">
                                                    {item.month}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Répartition par secteur */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition par secteur</h3>
                            <div className="space-y-4">
                                {sectorDistribution.slice(0, 8).map((sector, index) => {
                                    const percentage = stats.totalCompanies > 0 
                                        ? (sector.count / stats.totalCompanies) * 100 
                                        : 0;
                                    
                                    return (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium text-gray-700 truncate max-w-[200px]">
                                                    {sector.sector || 'Non spécifié'}
                                                </span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-600 font-medium">{sector.count}</span>
                                                    <span className="text-gray-500 w-12 text-right">{percentage.toFixed(1)}%</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${sectorColors[index % sectorColors.length]}`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Top 5 Entreprises */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top 5 Entreprises les plus actives</h3>
                        <div className="space-y-4">
                            {topCompanies.map((company, index) => (
                                <div key={company.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                                        index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                                        'bg-gradient-to-br from-blue-500 to-blue-600'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{company.name}</h4>
                                        <p className="text-sm text-gray-500">{company.sector || 'Secteur non spécifié'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">{company.feedbacks} demandes</p>
                                        <p className="text-xs text-gray-500">{company.customers} clients</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Liste complète des entreprises */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-900">Toutes les entreprises</h3>
                            <p className="text-sm text-gray-600 mt-1">{companies.length} entreprise{companies.length > 1 ? 's' : ''} au total</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Secteur</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propriétaire</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clients</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedbacks</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créé le</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {companies.map((company) => (
                                        <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {company.logo_url ? (
                                                        <img src={`/storage/${company.logo_url}`} alt={company.name} className="w-8 h-8 rounded-full mr-3 object-cover" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full mr-3 bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm">
                                                            {company.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="text-sm font-medium text-gray-900">{company.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {company.sector || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">
                                                    <div className="font-medium text-gray-900">{company.user_name}</div>
                                                    <div className="text-gray-500">{company.user_email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {company.customers_count}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {company.feedback_requests_count}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    company.is_active 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {company.is_active ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {company.created_at}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
