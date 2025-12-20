import { useState, useEffect } from 'react';
import { Search, Edit, Plus, Trash2, MapPin, Printer } from 'lucide-react';
import { toast, Toaster } from 'sonner@2.0.3';
import Sidebar from '../../components/admin/Sidebar';

interface Shipment {
  id: string;
  trackingNumber: string;
  customer: string;
  origin: string;
  destination: string;
  weight: number;
  status: string;
  courier: string;
  createdDate: string;
  estimatedDelivery: string;
  notes: string;
}

export default function ShipmentManagement() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);

  const fetchShipments = async () => {
    try {
      const res = await fetch('/api/shipments');
      if (res.ok) {
        const data = await res.json();
        setShipments(data);
      } else {
        toast.error('Failed to fetch shipments');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const statuses = [
    'Created',
    'Picked Up',
    'In Warehouse',
    'In Transit',
    'Out for Delivery',
    'Delivered',
    'Returned',
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Created: 'bg-gray-100 text-gray-700',
      'Picked Up': 'bg-yellow-100 text-yellow-700',
      'In Warehouse': 'bg-purple-100 text-purple-700',
      'In Transit': 'bg-blue-100 text-blue-700',
      'Out for Delivery': 'bg-orange-100 text-orange-700',
      Delivered: 'bg-green-100 text-green-700',
      Returned: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this shipment?')) {
      try {
        const res = await fetch(`/api/shipments/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Shipment deleted successfully');
          fetchShipments();
        } else {
          toast.error('Failed to delete shipment');
        }
      } catch (error) {
        toast.error('Error connecting to server');
      }
    }
  };

  const handleEdit = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingShipment(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const shipmentData = {
      id: editingShipment ? editingShipment.id : Date.now().toString(),
      trackingNumber: formData.get('trackingNumber') as string,
      customer: formData.get('customer') as string,
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      weight: parseFloat(formData.get('weight') as string),
      status: formData.get('status') as string,
      courier: formData.get('courier') as string,
      createdDate: editingShipment ? editingShipment.createdDate : new Date().toISOString().split('T')[0],
      estimatedDelivery: formData.get('estimatedDelivery') as string,
      notes: formData.get('notes') as string,
    };

    try {
      const url = editingShipment 
        ? `/api/shipments/${editingShipment.id}` 
        : '/api/shipments';
      
      const method = editingShipment ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shipmentData),
      });

      if (res.ok) {
        toast.success(editingShipment ? 'Shipment updated' : 'Shipment created');
        setShowModal(false);
        fetchShipments();
      } else {
        toast.error('Failed to save shipment');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  const filteredShipments = shipments.filter(
    (s) =>
      s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Toaster position="top-right" richColors />
      <Sidebar />

      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="mb-2">Shipment Management</h1>
            <p className="text-gray-600">Manage all shipments and tracking information</p>
          </div>

          {/* Search and Add */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by tracking number or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Shipment
            </button>
          </div>

          {/* Shipments Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Tracking #</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Customer</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Route</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Weight</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Courier</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">ETA</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{shipment.trackingNumber}</p>
                        <p className="text-xs text-gray-500">{shipment.createdDate}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{shipment.customer}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{shipment.origin}</span>
                          <MapPin className="w-4 h-4" />
                          <span>{shipment.destination}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{shipment.weight} kg</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(shipment.status)}`}>
                          {shipment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{shipment.courier}</td>
                      <td className="px-6 py-4 text-gray-900">{shipment.estimatedDelivery}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => window.open(`/admin/shipments/${shipment.id}/print`, '_blank')}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                            title="Print Receipt"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(shipment)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(shipment.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Placeholder */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="mb-6">{editingShipment ? 'Edit Shipment' : 'Add New Shipment'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Tracking Number</label>
                      <input
                        name="trackingNumber"
                        type="text"
                        defaultValue={editingShipment?.trackingNumber}
                        placeholder={editingShipment ? '' : 'Auto-generated'}
                        disabled={!editingShipment}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Customer</label>
                      <input
                        name="customer"
                        type="text"
                        defaultValue={editingShipment?.customer}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Origin</label>
                      <input
                        name="origin"
                        type="text"
                        defaultValue={editingShipment?.origin}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Destination</label>
                      <input
                        name="destination"
                        type="text"
                        defaultValue={editingShipment?.destination}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Weight (kg)</label>
                      <input
                        name="weight"
                        type="number"
                        step="0.1"
                        defaultValue={editingShipment?.weight}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Status</label>
                      <select
                        name="status"
                        defaultValue={editingShipment?.status || 'Created'}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Courier</label>
                      <input
                        name="courier"
                        type="text"
                        defaultValue={editingShipment?.courier}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Estimated Delivery</label>
                      <input
                        name="estimatedDelivery"
                        type="date"
                        defaultValue={editingShipment?.estimatedDelivery}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Notes</label>
                    <textarea
                      name="notes"
                      defaultValue={editingShipment?.notes}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                    >
                      Save Shipment
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
