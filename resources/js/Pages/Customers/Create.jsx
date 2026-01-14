import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        csv_file: null,
    });

    const [csvMode, setCsvMode] = useState(false);
    const [fileName, setFileName] = useState('');

    const submitManual = (e) => {
        e.preventDefault();
        post(route('customers.store'), {
            onSuccess: () => {
                reset();
            },
            preserveScroll: true,
        });
    };

    const submitCSV = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('csv_file', data.csv_file);
        
        post(route('customers.importCSV'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                reset();
                setFileName('');
            },
            preserveScroll: true,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('csv_file', file);
            setFileName(file.name);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Ajouter un client
                    </h2>
                    <Link
                        href={route('customers.index')}
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Retour aux clients
                    </Link>
                </div>
            }
        >
            <Head title="Ajouter un client" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    {/* Mode Switch */}
                    <div className="mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 inline-flex">
                            <button
                                onClick={() => setCsvMode(false)}
                                className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                    !csvMode
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Ajout manuel
                            </button>
                            <button
                                onClick={() => setCsvMode(true)}
                                className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                    csvMode
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Import CSV
                            </button>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {!csvMode ? (
                            <>
                                {/* Manual Form Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-white">Nouveau client</h3>
                                            <p className="text-blue-100 text-sm">Remplissez les informations du client</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Manual Form Body */}
                                <div className="p-8 space-y-6">
                                    <div>
                                        <InputLabel htmlFor="name" value="Nom du client" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-2 block w-full"
                                            placeholder="Ex: Jean Dupont"
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                        <p className="mt-1 text-xs text-gray-500">Le nom est optionnel</p>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="email" value="Adresse email *" />
                                        <div className="relative mt-2">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <TextInput
                                                id="email"
                                                type="email"
                                                required
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="block w-full pl-10"
                                                placeholder="client@example.com"
                                            />
                                        </div>
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="phone" value="Numéro de téléphone" />
                                        <div className="relative mt-2">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <TextInput
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="block w-full pl-10"
                                                placeholder="+33 6 XX XX XX XX"
                                            />
                                        </div>
                                        <InputError message={errors.phone} className="mt-2" />
                                        <p className="mt-1 text-xs text-gray-500">Requis pour les envois par SMS ou WhatsApp</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                        <Link
                                            href={route('customers.index')}
                                            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                                        >
                                            Annuler
                                        </Link>
                                        <PrimaryButton onClick={submitManual} disabled={processing} className="px-6">
                                            {processing ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Ajout en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Ajouter le client
                                                </>
                                            )}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* CSV Import Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-white">Import CSV</h3>
                                            <p className="text-blue-100 text-sm">Importez plusieurs clients en une seule fois</p>
                                        </div>
                                    </div>
                                </div>

                                {/* CSV Import Body */}
                                <div className="p-8 space-y-6">
                                    {/* Info Banner */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex">
                                            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            <div className="ml-3">
                                                <h4 className="text-sm font-semibold text-blue-900">Format CSV requis</h4>
                                                <p className="text-sm text-blue-700 mt-1">
                                                    Votre fichier CSV doit contenir les colonnes suivantes : <code className="bg-blue-100 px-1 py-0.5 rounded">name</code>, <code className="bg-blue-100 px-1 py-0.5 rounded">email</code>, <code className="bg-blue-100 px-1 py-0.5 rounded">phone</code> (optionnel)
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* File Upload */}
                                    <div>
                                        <InputLabel htmlFor="csv_file" value="Fichier CSV *" />
                                        <div className="mt-2">
                                            <label
                                                htmlFor="csv_file"
                                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    {fileName ? (
                                                        <>
                                                            <svg className="w-12 h-12 text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <p className="mb-2 text-sm font-semibold text-gray-700">{fileName}</p>
                                                            <p className="text-xs text-gray-500">Cliquez pour changer de fichier</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                            </svg>
                                                            <p className="mb-2 text-sm text-gray-500">
                                                                <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                                                            </p>
                                                            <p className="text-xs text-gray-500">Fichier CSV uniquement</p>
                                                        </>
                                                    )}
                                                </div>
                                                <input
                                                    id="csv_file"
                                                    type="file"
                                                    accept=".csv"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        <InputError message={errors.csv_file} className="mt-2" />
                                    </div>

                                    {/* Example CSV */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Exemple de fichier CSV :</h4>
                                        <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                                            <code>name,email,phone{'\n'}Jean Dupont,jean@example.com,+33 6 12 34 56 78{'\n'}Marie Martin,marie@example.com,+33 6 98 76 54 32</code>
                                        </pre>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                        <Link
                                            href={route('customers.index')}
                                            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                                        >
                                            Annuler
                                        </Link>
                                        <PrimaryButton onClick={submitCSV} disabled={processing || !data.csv_file} className="px-6">
                                            {processing ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Import en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                    </svg>
                                                    Importer les clients
                                                </>
                                            )}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Help Section */}
                    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            Aide
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                                <svg className="w-4 h-4 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>L'email est obligatoire pour tous les clients</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-4 h-4 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Le numéro de téléphone est requis uniquement pour les envois par SMS ou WhatsApp</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-4 h-4 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Vous pouvez importer plusieurs clients simultanément via un fichier CSV</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-4 h-4 mr-2 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <span>Le canal d'envoi sera choisi lors de l'envoi de la demande de feedback</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}