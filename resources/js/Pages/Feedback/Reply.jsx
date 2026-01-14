import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Reply({ feedback }) {
    const { data, setData, post, processing } = useForm({
        content: '',
    });

    const submitManual = (e) => {
        e.preventDefault();
        post(route('feedback.replies.store', feedback.id));
    };

    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);

    // Génération synchrone : appelle le endpoint qui renvoie directement le contenu IA
    const submitAI = async () => {
        setAiError(null);
        setAiLoading(true);

        try {
            const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const res = await fetch(route('feedback.replies.ai.generate', feedback.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrf || ''
                },
                credentials: 'same-origin',
                body: JSON.stringify({}),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Erreur lors de la génération IA');
            }

            const json = await res.json();
            if (json?.content) {
                setData('content', json.content);
            } else {
                throw new Error('Réponse IA invalide');
            }
        } catch (e) {
            setAiError(e.message || 'Erreur IA');
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <form onSubmit={submitManual} className="w-full max-w-md bg-white rounded-xl shadow p-6">
                <h1 className="text-xl font-bold mb-4">Répondre à {feedback.feedback_request?.customer?.name}
</h1>

                <label className="block mb-2 font-medium">Réponse manuelle</label>
                <textarea
                    className="w-full border rounded p-2 mb-4"
                    rows="6"
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    placeholder="Écrivez votre réponse ici..."
                />

                <button
                    disabled={processing}
                    className="w-full bg-blue-600 text-white py-3 rounded font-semibold mb-2"
                >
                    Envoyer la réponse
                </button>

                <button
                    type="button"
                    disabled={processing || aiLoading}
                    onClick={submitAI}
                    className="w-full bg-green-600 text-white py-3 rounded font-semibold"
                >
                    {aiLoading ? 'Génération en cours...' : 'Générer avec IA'}
                </button>

                {aiError && (
                    <div className="mt-2 text-sm text-red-600">Erreur IA : {aiError}</div>
                )}

                <Link href={route('feedback.adminShow', feedback.id)} className="mt-3 block text-center text-gray-500">
                    Annuler
                </Link>
            </form>
        </div>
    );
}
