import { router } from "@inertiajs/react";
import { useState } from 'react';

export default function UploadCSV() {
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('csv_file', file);
        router.post('/customers/import-csv', formData);
    };

    return (
        <div>
            <h1>Importer clients CSV</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
                <button type="submit">Importer</button>
            </form>
        </div>
    );
}
