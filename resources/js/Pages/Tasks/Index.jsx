import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function TasksIndex({ auth, tasks, statusOptions, importanceOptions }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        importance: 'medium',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('tasks.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleStatusChange = (taskId, status) => {
        router.patch(route('tasks.updateStatus', taskId), { status }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Tâches">
            <Head title="Tâches" />

            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tâches de l’entreprise</h1>
                        <p className="text-sm text-gray-600">Créez des tâches et suivez leur état</p>
                    </div>
                </div>

                {/* Create Task */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900">Créer une tâche</h3>
                    <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Titre</label>
                            <input
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Ex: Améliorer le temps de réponse"
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs text-rose-600">{errors.title}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Importance</label>
                            <select
                                value={data.importance}
                                onChange={(e) => setData('importance', e.target.value)}
                                className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                {importanceOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="lg:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                rows={3}
                                placeholder="Détaillez le problème à résoudre"
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-rose-600">{errors.description}</p>
                            )}
                        </div>
                        <div className="lg:col-span-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                            >
                                Créer la tâche
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tasks List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">Liste des tâches</h3>
                    </div>
                    {tasks.length ? (
                        <ul className="divide-y divide-gray-200">
                            {tasks.map((task) => (
                                <li key={task.id} className="px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div>
                                        <p className="font-semibold text-gray-900">{task.title}</p>
                                        {task.description && (
                                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-2">Créé le {task.created_at}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ImportanceBadge importance={task.importance} />
                                        <StatusBadge status={task.status} />
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                            className="rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            {statusOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-6 py-10 text-center text-sm text-gray-500">
                            Aucune tâche pour le moment.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatusBadge({ status }) {
    const map = {
        not_started: 'bg-gray-100 text-gray-700',
        in_progress: 'bg-amber-100 text-amber-700',
        completed: 'bg-emerald-100 text-emerald-700',
    };
    const labels = {
        not_started: 'À faire',
        in_progress: 'En cours',
        completed: 'Terminé',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-700'}`}>
            {labels[status] || status}
        </span>
    );
}

function ImportanceBadge({ importance }) {
    const map = {
        high: 'bg-rose-100 text-rose-700',
        medium: 'bg-amber-100 text-amber-700',
        low: 'bg-emerald-100 text-emerald-700',
    };
    const labels = {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[importance] || 'bg-gray-100 text-gray-700'}`}>
            {labels[importance] || importance}
        </span>
    );
}
