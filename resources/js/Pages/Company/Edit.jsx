import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ auth, company }) {
    const { data, setData, put, processing, errors } = useForm({
        name: company?.name || '',
        sector: company?.sector || '',
        google_place_id: company?.google_place_id || '',
        google_review_url: company?.google_review_url || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('company.update'));
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Entreprise">
            <Head title="Entreprise" />

            <div className="max-w-4xl space-y-6">
                {/* Header Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <BuildingIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">
                                Informations de l'entreprise
                            </h2>
                            <p className="text-sm text-gray-600">
                                Configurez les informations de votre entreprise pour personnaliser vos demandes de feedback.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Informations générales</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Ces informations seront utilisées dans vos communications avec vos clients.
                        </p>
                    </div>

                    <form onSubmit={submit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Nom de l'entreprise"
                                field="name"
                                placeholder="Ex: Mon Entreprise SARL"
                                icon={<BuildingIcon className="w-5 h-5 text-gray-400" />}
                                data={data}
                                setData={setData}
                                errors={errors}
                                required
                            />

                            <Input
                                label="Secteur d'activité"
                                field="sector"
                                placeholder="Ex: Restauration, Commerce, Services..."
                                icon={<BriefcaseIcon className="w-5 h-5 text-gray-400" />}
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </div>

                        {/* Google Integration Section */}
                        <div className="pt-6 border-t border-gray-200">
                            <div className="flex items-start gap-3 mb-6">
                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <GoogleIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-base font-semibold text-gray-900">
                                        Intégration Google Business
                                    </h4>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Connectez votre profil Google pour rediriger vos clients vers vos avis Google.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <Input
                                    label="Google Place ID"
                                    field="google_place_id"
                                    placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
                                    icon={<LocationIcon className="w-5 h-5 text-gray-400" />}
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    helpText="L'identifiant unique de votre établissement sur Google Maps"
                                />

                                <Input
                                    label="Lien Google Reviews"
                                    field="google_review_url"
                                    placeholder="https://g.page/r/..."
                                    icon={<LinkIcon className="w-5 h-5 text-gray-400" />}
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    helpText="Le lien direct pour laisser un avis sur votre fiche Google"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                            <div className="text-sm text-gray-500">
                                <InfoIcon className="inline w-4 h-4 mr-1" />
                                Les modifications seront appliquées immédiatement
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {processing ? (
                                    <>
                                        <SpinnerIcon className="w-5 h-5 animate-spin" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <SaveIcon className="w-5 h-5" />
                                        Enregistrer les modifications
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Help Card */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <QuestionIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                Besoin d'aide pour trouver votre Google Place ID ?
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">
                                Utilisez l'outil officiel de Google pour trouver votre Place ID en recherchant le nom de votre établissement.
                            </p>
                            <a
                                href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                Accéder à l'outil Google Place ID Finder
                                <ExternalLinkIcon className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Input Component
function Input({ label, field, placeholder, icon, data, setData, errors, required, helpText }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    type="text"
                    value={data[field]}
                    onChange={(e) => setData(field, e.target.value)}
                    placeholder={placeholder}
                    className={`
                        w-full rounded-lg border ${errors[field] ? 'border-red-300' : 'border-gray-300'}
                        ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3
                        text-gray-900 placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all duration-200
                    `}
                    required={required}
                />
            </div>
            {errors[field] && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertIcon className="w-4 h-4" />
                    {errors[field]}
                </p>
            )}
            {helpText && !errors[field] && (
                <p className="mt-2 text-sm text-gray-500">{helpText}</p>
            )}
        </div>
    );
}

// Icons
function BuildingIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    );
}

function BriefcaseIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}

function GoogleIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
    );
}

function LocationIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function LinkIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
    );
}

function InfoIcon({ className }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
    );
}

function SaveIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
    );
}

function SpinnerIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );
}

function AlertIcon({ className }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
    );
}

function QuestionIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function ExternalLinkIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
    );
}