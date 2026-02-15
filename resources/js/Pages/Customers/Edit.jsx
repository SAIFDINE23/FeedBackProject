import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Save, User, Mail, Phone } from 'lucide-react';

export default function Edit({ auth, customer }) {
    const [name, setName] = useState(customer.name || '');
    const [email, setEmail] = useState(customer.email || '');
    const [phone, setPhone] = useState(customer.phone || '');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        router.put(route('customers.update', customer.id), {
            name,
            email,
            phone,
        }, {
            preserveScroll: true,
            onError: (errors) => {
                setErrors(errors);
                setLoading(false);
            },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Modifier le client">
            <Head title="Modifier le client" />

            <div className="space-y-6">
                {/* Header */}
                <div className="relative rounded-3xl overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700"></div>
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    </div>
                    <div className="relative p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-white mb-1">Modifier le client</h1>
                                    <p className="text-blue-100 text-lg">Mettre à jour les informations du client</p>
                                </div>
                            </div>
                            <button
                                onClick={() => router.visit(route('customers.index'))}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-900 text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Retour à la liste
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Nom du client
                                </div>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Jean Dupont"
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all ${
                                    errors.name ? 'border-red-500' : 'border-gray-200'
                                }`}
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600 font-medium">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email <span className="text-red-500">*</span>
                                </div>
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="client@example.com"
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all ${
                                    errors.email ? 'border-red-500' : 'border-gray-200'
                                }`}
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Téléphone
                                </div>
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+33 6 12 34 56 78"
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all ${
                                    errors.phone ? 'border-red-500' : 'border-gray-200'
                                }`}
                            />
                            {errors.phone && (
                                <p className="mt-2 text-sm text-red-600 font-medium">{errors.phone}</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? 'Modification en cours...' : 'Enregistrer les modifications'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.visit(route('customers.index'))}
                                className="px-6 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
