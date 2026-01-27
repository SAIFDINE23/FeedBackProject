import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { Mail, MessageSquare, QrCode, Smartphone, Send, Trash2, Users, CheckSquare } from 'lucide-react';

export default function Index({ auth, customers }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [channelMenuVisible, setChannelMenuVisible] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [bulkChannelMenuVisible, setBulkChannelMenuVisible] = useState(false);

    const openChannelMenu = (customer) => {
        setSelectedCustomer(customer);
        setChannelMenuVisible(true);
    };

    const sendFeedback = (channel) => {
        router.post(route('feedback-requests.store'), {
            customer_id: selectedCustomer.id,
            channel,
        }, {
            preserveScroll: true,
        });

        setChannelMenuVisible(false);
        setSelectedCustomer(null);
    };

    const sendBulkFeedback = (channel) => {
        router.post(route('feedback-requests.bulk'), {
            customer_ids: selectedCustomers,
            channel,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedCustomers([]);
                setBulkChannelMenuVisible(false);
            },
        });
    };

    const toggleCustomerSelection = (customerId) => {
        setSelectedCustomers(prev => 
            prev.includes(customerId) 
                ? prev.filter(id => id !== customerId)
                : [...prev, customerId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedCustomers.length === filteredCustomers.length) {
            setSelectedCustomers([]);
        } else {
            setSelectedCustomers(filteredCustomers.map(c => c.id));
        }
    };

    const deleteCustomer = (id, name) => {
        if (!confirm(`Supprimer ${name} ?`)) return;
        router.delete(route('customers.destroy', id), { preserveScroll: true });
    };

    const filteredCustomers = customers.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusBadge = (status) => {
        const styles = {
            sent: 'bg-blue-100 text-blue-700',
            delivered: 'bg-green-100 text-green-700',
            failed: 'bg-red-100 text-red-700',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
                {status || 'Aucun'}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold">Clients</h2>
                    </div>
                    <Link
                        href={route('customers.create')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        + Ajouter un client
                    </Link>
                </div>
            }
        >
            <Head title="Clients" />

            <div className="py-10 max-w-7xl mx-auto px-6">
                {/* Search & Actions */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <input
                        type="text"
                        placeholder="Rechercher un client..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                    />
                    
                    {selectedCustomers.length > 0 && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">
                                {selectedCustomers.length} client{selectedCustomers.length > 1 ? 's' : ''} sélectionné{selectedCustomers.length > 1 ? 's' : ''}
                            </span>
                            <button
                                onClick={() => setBulkChannelMenuVisible(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <Send className="w-4 h-4" />
                                Envoyer les feedbacks
                            </button>
                            <button
                                onClick={() => setSelectedCustomers([])}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                                Annuler
                            </button>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left">Client</th>
                                <th className="px-6 py-3 text-left">Contact</th>
                                <th className="px-6 py-3 text-left">Dernier envoi</th>
                                <th className="px-6 py-3 text-left">Statut</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map(customer => {
                                const last = customer.feedback_requests?.[0];
                                return (
                                    <tr key={customer.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedCustomers.includes(customer.id)}
                                                onChange={() => toggleCustomerSelection(customer.id)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {customer.name || 'Sans nom'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {customer.email || customer.phone}
                                        </td>
                                        <td className="px-6 py-4">
                                            {last ? new Date(last.created_at).toLocaleDateString('fr-FR') : 'Jamais'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {statusBadge(last?.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => openChannelMenu(customer)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                <Send className="w-4 h-4" />
                                                Envoyer
                                            </button>
                                            <button
                                                onClick={() => deleteCustomer(customer.id, customer.name || customer.email)}
                                                className="inline-flex items-center px-2 py-1.5 text-red-600 hover:bg-red-50 rounded-md"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal choix canal - envoi individuel */}
            {channelMenuVisible && selectedCustomer && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">
                            Envoyer un feedback
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Choisissez le canal pour <b>{selectedCustomer.name || selectedCustomer.email}</b>
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <ChannelButton icon={<Mail />} label="Email" onClick={() => sendFeedback('email')} />
                            <ChannelButton icon={<MessageSquare />} label="SMS" onClick={() => sendFeedback('sms')} />
                            <ChannelButton icon={<QrCode />} label="QR Code" onClick={() => sendFeedback('qr')} />
                            <ChannelButton icon={<Smartphone />} label="WhatsApp" onClick={() => sendFeedback('whatsapp')} />
                        </div>

                        <button
                            onClick={() => setChannelMenuVisible(false)}
                            className="mt-6 w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            {/* Modal choix canal - envoi en masse */}
            {bulkChannelMenuVisible && selectedCustomers.length > 0 && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">
                            Envoyer des feedbacks en masse
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Choisissez le canal pour envoyer à <b>{selectedCustomers.length} client{selectedCustomers.length > 1 ? 's' : ''}</b>
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <ChannelButton icon={<Mail />} label="Email" onClick={() => sendBulkFeedback('email')} />
                            <ChannelButton icon={<MessageSquare />} label="SMS" onClick={() => sendBulkFeedback('sms')} />
                        </div>

                        <button
                            onClick={() => setBulkChannelMenuVisible(false)}
                            className="mt-6 w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

function ChannelButton({ icon, label, onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
        >
            <div className="text-blue-600">{icon}</div>
            <span className="font-medium">{label}</span>
        </button>
    );
}
