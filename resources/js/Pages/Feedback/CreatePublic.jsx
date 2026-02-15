import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, router } from '@inertiajs/react';
import { Star, Send } from 'lucide-react';

export default function CreatePublic({ companies, postUrl }) {
    const [selectedCompany, setSelectedCompany] = useState(companies[0]?.id || null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const company = companies.find(c => c.id === selectedCompany);
    const settings = company?.design_settings || {};

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        router.post(postUrl, {
            company_id: selectedCompany,
            name,
            email,
            rating,
            comment,
        }, {
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    return (
        <GuestLayout>
            <Head title="Feedback" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="w-full max-w-2xl">
                    {/* Company Selection */}
                    {companies.length > 1 && (
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                Sélectionnez une company
                            </label>
                            <select
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(Number(e.target.value))}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                            >
                                {companies.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Main Card */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-8">
                            <div className="flex items-center gap-4">
                                {company?.logo_url && (
                                    <img 
                                        src={company.logo_url} 
                                        alt={company.name}
                                        className="w-16 h-16 rounded-xl object-contain bg-white p-2"
                                    />
                                )}
                                <div>
                                    <h1 className="text-3xl font-black text-white">
                                        Feedback
                                    </h1>
                                    <p className="text-blue-100 text-lg">
                                        {company?.name || 'Company'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Message */}
                            <div className="bg-blue-50 border-l-4 border-blue-900 p-4 rounded-lg">
                                <p className="text-gray-900 font-medium">
                                    {settings.custom_message || 'Votre avis compte pour nous!'}
                                </p>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="votre.email@example.com"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all"
                                />
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Nom (optionnel)
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Votre nom"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all"
                                />
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                    Votre note <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-3 justify-center py-6 bg-gray-50 rounded-xl">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-125"
                                        >
                                            <Star
                                                size={48}
                                                className={`transition-all ${
                                                    star <= (hoverRating || rating)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                {!rating && (
                                    <p className="text-center text-sm text-red-500 font-medium">
                                        Veuillez sélectionner une note
                                    </p>
                                )}
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Commentaire (optionnel)
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Partagez vos pensées..."
                                    rows={5}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!rating || !email || loading}
                                className="w-full py-4 bg-gradient-to-r from-blue-900 to-blue-700 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                            >
                                <Send className="w-6 h-6" />
                                {loading ? 'Envoi en cours...' : 'Envoyer mon feedback'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
