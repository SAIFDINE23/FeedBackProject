import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Show({ token, company, customer, feedback, status, isAdmin }) {
    const { data, setData, post, processing, reset } = useForm({
        rating: feedback?.rating || '',
        comment: feedback?.comment || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('feedback.store', token), { onFinish: () => reset() });
    };

    // Admin ou feedback déjà complété → afficher détails
    if (isAdmin || status === 'completed') {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">
                    Feedback de {customer}
                </h1>
                <p className="mb-2">Entreprise: {company}</p>
                <p className="mb-2">Note: {feedback?.rating ?? '—'} / 5</p>
                <p className="mb-2">Commentaire: {feedback?.comment || 'Aucun'}</p>
            </div>
        );
    }

    // Sinon, formulaire pour le client
    return (
        <div className="p-6">
            <Head title="Feedback" />
            <h1 className="text-2xl font-bold mb-4">Feedback pour {customer}</h1>
            <p className="mb-2">Entreprise: {company}</p>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Note</label>
                    <select
                        value={data.rating}
                        onChange={(e) => setData('rating', e.target.value)}
                        className="border rounded p-2 w-full"
                        required
                    >
                        <option value="">-- Choisir --</option>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <option key={i} value={i}>{i}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-medium mb-1">Commentaire</label>
                    <textarea
                        value={data.comment}
                        onChange={(e) => setData('comment', e.target.value)}
                        className="border rounded p-2 w-full"
                        rows={4}
                    />
                </div>

                <PrimaryButton disabled={processing}>Envoyer</PrimaryButton>
            </form>
        </div>
    );
}
