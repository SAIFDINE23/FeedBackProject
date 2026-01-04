import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        company_name: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Password strength indicator
    const getPasswordStrength = (password) => {
        if (password.length === 0) return { strength: 0, label: '', color: '' };
        if (password.length < 6) return { strength: 25, label: 'Faible', color: 'bg-red-500' };
        if (password.length < 10) return { strength: 50, label: 'Moyen', color: 'bg-yellow-500' };
        if (password.length < 12) return { strength: 75, label: 'Bon', color: 'bg-blue-500' };
        return { strength: 100, label: 'Excellent', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(data.password);

    return (
        <GuestLayout>
            <Head title="Inscription" />

            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Créer votre compte
                    </h1>
                    <p className="text-gray-600">
                        Commencez à collecter des feedbacks en quelques minutes
                    </p>
                </div>

                {/* Benefits Banner */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center text-blue-700">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Gratuit
                        </div>
                        <div className="flex items-center text-blue-700">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Sans carte bancaire
                        </div>
                        <div className="flex items-center text-blue-700">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Installation en 2 min
                        </div>
                    </div>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                    <div className="space-y-6">
                        {/* Personal Information Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Informations personnelles
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <InputLabel htmlFor="name" value="Nom complet *" className="font-semibold" />
                                    <div className="relative mt-2">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            autoComplete="name"
                                            isFocused={true}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            placeholder="Jean Dupont"
                                        />
                                    </div>
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                {/* Email */}
                                <div>
                                    <InputLabel htmlFor="email" value="Adresse email *" className="font-semibold" />
                                    <div className="relative mt-2">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            autoComplete="username"
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            placeholder="nom@entreprise.com"
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Company Information Section */}
                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Informations entreprise
                            </h3>

                            <div>
                                <InputLabel htmlFor="company_name" value="Nom de l'entreprise *" className="font-semibold" />
                                <div className="relative mt-2">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <TextInput
                                        id="company_name"
                                        type="text"
                                        name="company_name"
                                        value={data.company_name}
                                        className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        onChange={(e) => setData('company_name', e.target.value)}
                                        required
                                        placeholder="Mon Entreprise SARL"
                                    />
                                </div>
                                <InputError message={errors.company_name} className="mt-2" />
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Sécurité du compte
                            </h3>

                            <div className="space-y-6">
                                {/* Password */}
                                <div>
                                    <InputLabel htmlFor="password" value="Mot de passe *" className="font-semibold" />
                                    <div className="relative mt-2">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <TextInput
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            className="block w-full pl-10 pr-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                            placeholder="••••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    
                                    {/* Password Strength Indicator */}
                                    {data.password.length > 0 && (
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-gray-600">Force du mot de passe</span>
                                                <span className={`text-xs font-medium ${
                                                    passwordStrength.strength === 100 ? 'text-green-600' :
                                                    passwordStrength.strength >= 75 ? 'text-blue-600' :
                                                    passwordStrength.strength >= 50 ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`}>
                                                    {passwordStrength.label}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                                    style={{ width: `${passwordStrength.strength}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                {/* Password Confirmation */}
                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Confirmer le mot de passe *"
                                        className="font-semibold"
                                    />
                                    <div className="relative mt-2">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <TextInput
                                            id="password_confirmation"
                                            type={showPasswordConfirm ? 'text' : 'password'}
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="block w-full pl-10 pr-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            required
                                            placeholder="••••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswordConfirm ? (
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <PrimaryButton
                                onClick={submit}
                                className="w-full justify-center py-3 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Création du compte...
                                    </div>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Créer mon compte gratuitement
                                    </>
                                )}
                            </PrimaryButton>

                            <p className="mt-4 text-center text-xs text-gray-500">
                                En créant un compte, vous acceptez nos{' '}
                                <a href="#" className="text-blue-600 hover:underline">Conditions d'utilisation</a>
                                {' '}et notre{' '}
                                <a href="#" className="text-blue-600 hover:underline">Politique de confidentialité</a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Vous avez déjà un compte ?{' '}
                        <Link
                            href={route('login')}
                            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}