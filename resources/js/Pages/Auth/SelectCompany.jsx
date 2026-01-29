import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function SelectCompany({ googleUser, userCompanies }) {
    const [selectedOption, setSelectedOption] = useState('new');
    const { data, setData, post, processing, errors } = useForm({
        company_option: 'new',
        company_id: '',
        company_name: '',
        company_sector: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        data.company_option = selectedOption;
        post(route('select-company.store'));
    };

    return (
        <GuestLayout>
            <Head title="Select Company" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-luminea-900 via-slate-900 to-indigo-950 px-4 py-12 sm:px-6 lg:px-8">
                {/* Decorative blobs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-luminea-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute -bottom-40 left-40 w-80 h-80 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative w-full max-w-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Welcome to Luminea</h1>
                        <p className="text-luminea-200">
                            Hi <span className="font-semibold text-luminea-100">{googleUser.name}</span>, let's get you set up!
                        </p>
                    </div>

                    {/* Card */}
                    <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl shadow-luminea-500/50 border border-white/20 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Option Selection */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-white">Company Setup</h2>

                                {/* Create New Company */}
                                <label className="block cursor-pointer">
                                    <div className="flex items-start p-4 border-2 border-transparent rounded-lg transition-all hover:border-luminea-500/50 hover:bg-luminea-500/10"
                                        onClick={() => setSelectedOption('new')}>
                                        <input
                                            type="radio"
                                            name="company_option"
                                            value="new"
                                            checked={selectedOption === 'new'}
                                            onChange={(e) => setSelectedOption(e.target.value)}
                                            className="mt-1 mr-3 w-5 h-5 accent-luminea-500"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-white">Create a New Company</p>
                                            <p className="text-luminea-200 text-sm">Start fresh with a new workspace</p>
                                        </div>
                                    </div>
                                </label>

                                {/* Join Existing Company */}
                                {userCompanies && userCompanies.length > 0 && (
                                    <label className="block cursor-pointer">
                                        <div className="flex items-start p-4 border-2 border-transparent rounded-lg transition-all hover:border-luminea-500/50 hover:bg-luminea-500/10"
                                            onClick={() => setSelectedOption('existing')}>
                                            <input
                                                type="radio"
                                                name="company_option"
                                                value="existing"
                                                checked={selectedOption === 'existing'}
                                                onChange={(e) => setSelectedOption(e.target.value)}
                                                className="mt-1 mr-3 w-5 h-5 accent-luminea-500"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-white">Join Existing Company</p>
                                                <p className="text-luminea-200 text-sm">Access a company you're invited to</p>
                                            </div>
                                        </div>
                                    </label>
                                )}
                            </div>

                            {/* Form Content */}
                            {selectedOption === 'new' ? (
                                <>
                                    {/* Company Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-luminea-100 mb-2">
                                            Company Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.company_name}
                                            onChange={(e) => setData('company_name', e.target.value)}
                                            placeholder="e.g., Acme Corporation"
                                            className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-luminea-500 transition-colors ${
                                                errors.company_name ? 'border-red-500' : 'border-slate-700'
                                            }`}
                                        />
                                        {errors.company_name && (
                                            <p className="text-red-400 text-sm mt-1">{errors.company_name}</p>
                                        )}
                                    </div>

                                    {/* Sector */}
                                    <div>
                                        <label className="block text-sm font-medium text-luminea-100 mb-2">
                                            Industry/Sector
                                        </label>
                                        <input
                                            type="text"
                                            value={data.company_sector}
                                            onChange={(e) => setData('company_sector', e.target.value)}
                                            placeholder="e.g., Technology, Retail, Healthcare"
                                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-luminea-500 transition-colors"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-luminea-100 mb-2">
                                        Select Company *
                                    </label>
                                    <select
                                        value={data.company_id}
                                        onChange={(e) => setData('company_id', e.target.value)}
                                        className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white focus:outline-none focus:border-luminea-500 transition-colors ${
                                            errors.company_id ? 'border-red-500' : 'border-slate-700'
                                        }`}
                                    >
                                        <option value="">Choose a company...</option>
                                        {userCompanies?.map((company) => (
                                            <option key={company.id} value={company.id}>
                                                {company.name}
                                                {company.sector && ` • ${company.sector}`}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.company_id && (
                                        <p className="text-red-400 text-sm mt-1">{errors.company_id}</p>
                                    )}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-luminea-600 to-purple-600 hover:from-luminea-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-luminea-500/50"
                                >
                                    {processing ? 'Setting up...' : 'Continue'}
                                </button>
                            </div>

                            {/* User Info */}
                            <div className="pt-4 border-t border-slate-700">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={googleUser.google_avatar_url}
                                        alt={googleUser.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <p className="text-sm text-luminea-200">Signed in as</p>
                                        <p className="text-white font-medium">{googleUser.email}</p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer Help */}
                    <div className="text-center mt-6 text-luminea-300">
                        <p className="text-sm">
                            Need help?{' '}
                            <a href="#" className="text-luminea-100 hover:text-white transition-colors">
                                Contact support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
