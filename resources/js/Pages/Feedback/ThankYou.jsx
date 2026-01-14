export default function ThankYou({ rating, googleUrl, company }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow p-6 text-center">
                <h1 className="text-2xl font-bold mb-3">
                    Merci pour votre retour 🙏
                </h1>

                <p className="text-gray-600 mb-6">
                    Votre avis aide {company} à s’améliorer.
                </p>

                {googleUrl && (
                    <>
                        <p className="font-medium mb-3">
                            Vous êtes satisfait ⭐⭐⭐⭐
                        </p>

                        <a
                            href={googleUrl}
                            target="_blank"
                            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                            ⭐ Laisser un avis sur Google
                        </a>

                        <p className="text-xs text-gray-500 mt-3">
                            Cela ne prendra qu’une minute
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
