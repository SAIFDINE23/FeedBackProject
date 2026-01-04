import { useForm } from '@inertiajs/react';

export default function Create({ token, company, customer }) {
    const { data, setData, post, processing, errors } = useForm({
        rating: 5,
        comment: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/feedback/${token}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <form onSubmit={submit} className="w-full max-w-md bg-white rounded-xl shadow p-6">
                <h1 className="text-xl font-bold mb-2">
                    Votre avis compte ⭐
                </h1>

                <p className="text-sm text-gray-600 mb-4">
                    {company} aimerait votre retour{customer ? `, ${customer}` : ''}
                </p>

                <label className="block mb-2 font-medium">Note</label>
                <select
                    className="w-full border rounded p-2 mb-4"
                    value={data.rating}
                    onChange={(e) => setData('rating', e.target.value)}
                >
                    {[5,4,3,2,1].map(v => (
                        <option key={v} value={v}>{v} ⭐</option>
                    ))}
                </select>

                <label className="block mb-2 font-medium">Commentaire</label>
                <textarea
                    className="w-full border rounded p-2 mb-4"
                    rows="4"
                    value={data.comment}
                    onChange={(e) => setData('comment', e.target.value)}
                />

                <button
                    disabled={processing}
                    className="w-full bg-black text-white py-3 rounded font-semibold"
                >
                    Envoyer
                </button>
            </form>
        </div>
    );
}
