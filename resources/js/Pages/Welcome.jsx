import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Feedback Platform - Collectez les avis de vos clients" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {/* Header */}
                <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-xl font-bold text-slate-900 block leading-tight">Feedback Platform</span>
                                    <span className="text-xs text-slate-500">Gestion des avis clients</span>
                                </div>
                            </div>

                            <nav className="flex items-center space-x-3">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            Se connecter
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
                                        >
                                            Créer un compte
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            Solution de feedback moderne et sécurisée
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            Collectez et analysez
                            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                                les avis de vos clients
                            </span>
                            <span className="block text-3xl sm:text-4xl lg:text-5xl mt-2 text-slate-700">
                                en toute simplicité
                            </span>
                        </h1>
                        
                        <p className="mt-8 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Améliorez la satisfaction client grâce à un système de notation structuré de 1 à 5 étoiles. 
                            Recueillez des commentaires détaillés via une interface professionnelle et sécurisée.
                        </p>

                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="group w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center"
                                >
                                    Accéder au dashboard
                                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="group w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center"
                                    >
                                        Démarrer gratuitement
                                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-700 bg-white border-2 border-slate-300 rounded-xl hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
                                    >
                                        Se connecter
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Aucune carte requise
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Installation rapide
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Support 24/7
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            Fonctionnalités complètes
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Tous les outils nécessaires pour gérer efficacement les feedbacks de vos clients
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 border border-slate-100 hover:border-blue-200">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                    Notation par étoiles
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Système de notation intuitif de 1 à 5 étoiles, simple et rapide pour vos clients.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 border border-slate-100 hover:border-blue-200">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                    Liens sécurisés par token
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Envoyez des liens de feedback personnalisés et protégés par token unique.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 border border-slate-100 hover:border-blue-200">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                    Analyse et statistiques
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Consultez et analysez tous vos feedbacks dans un tableau de bord centralisé.
                                </p>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 border border-slate-100 hover:border-blue-200">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                    Sécurité maximale
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Dashboard admin protégé avec authentification Laravel pour une gestion sécurisée.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            Comment ça fonctionne ?
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Un processus simple en 3 étapes pour commencer à collecter des feedbacks
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="relative text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full text-2xl font-bold mb-6 shadow-lg">
                                1
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                Créez une demande de feedback
                            </h3>
                            <p className="text-slate-600">
                                Générez un lien unique sécurisé par token pour chaque client depuis votre dashboard.
                            </p>
                        </div>

                        <div className="relative text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full text-2xl font-bold mb-6 shadow-lg">
                                2
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                Envoyez le lien à vos clients
                            </h3>
                            <p className="text-slate-600">
                                Partagez le lien par email, SMS ou tout autre canal de communication.
                            </p>
                        </div>

                        <div className="relative text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full text-2xl font-bold mb-6 shadow-lg">
                                3
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                Consultez et analysez
                            </h3>
                            <p className="text-slate-600">
                                Recevez les évaluations et commentaires directement dans votre tableau de bord.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                {!auth.user && (
                    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
                        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/10"></div>
                            <div className="relative p-10 sm:p-16 text-center">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                                    Prêt à transformer votre service client ?
                                </h2>
                                <p className="text-blue-100 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                                    Rejoignez les entreprises qui utilisent notre plateforme pour améliorer continuellement leur expérience client.
                                </p>
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center px-8 py-4 text-base font-semibold text-blue-600 bg-white rounded-xl hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    Commencer gratuitement
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <p className="mt-6 text-blue-100 text-sm">
                                    Aucune carte bancaire requise • Configuration en 2 minutes
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="border-t border-slate-200 bg-white/70 backdrop-blur-sm mt-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                            <div className="md:col-span-2">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-xl font-bold text-slate-900">Feedback Platform</span>
                                </div>
                                <p className="text-slate-600 max-w-md">
                                    La solution professionnelle pour collecter, gérer et analyser les avis de vos clients en toute simplicité.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900 mb-4">Produit</h3>
                                <ul className="space-y-2 text-slate-600">
                                    <li><a href="#" className="hover:text-blue-600 transition-colors">Fonctionnalités</a></li>
                                    <li><a href="#" className="hover:text-blue-600 transition-colors">Tarifs</a></li>
                                    <li><a href="#" className="hover:text-blue-600 transition-colors">Documentation</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900 mb-4">Entreprise</h3>
                                <ul className="space-y-2 text-slate-600">
                                    <li><a href="#" className="hover:text-blue-600 transition-colors">À propos</a></li>
                                    <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
                                    <li><a href="#" className="hover:text-blue-600 transition-colors">Support</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-200">
                            <p className="text-center text-slate-600 text-sm">
                                © 2026 Feedback Platform. Tous droits réservés. Propulsé par Laravel + React + Inertia.js
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}