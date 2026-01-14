import { Head } from '@inertiajs/react';

export default function AlreadySubmitted({ company }) {
    return (
        <>
            <Head title="Feedback déjà envoyé" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded shadow max-w-md text-center">
                    <h1 className="text-xl font-semibold mb-4">
                        Merci 🙏
                    </h1>

                    <p className="text-gray-600">
                        Vous avez déjà envoyé votre feedback pour <strong>{company}</strong>.
                    </p>

                    <p className="text-sm text-gray-400 mt-4">
                        Ce lien n’est plus valide.
                    </p>
                </div>
            </div>
        </>
    );
}
