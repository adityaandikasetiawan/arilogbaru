import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast, Toaster } from 'sonner@2.0.3';
import Sidebar from '../../components/admin/Sidebar';

interface Rate {
  id: string;
  origin: string;
  destination: string;
  ratePerKg: number;
  volumetricRate: number;
  eta: string;
}

export default function RateManagement() {
  const [rates, setRates] = useState<Rate[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState<Rate | null>(null);

  const fetchRates = async () => {
    try {
      const res = await fetch('/api/rates');
      if (res.ok) {
        const data = await res.json();
        setRates(data);
      } else {
        toast.error('Failed to fetch rates');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this rate?')) {
      try {
        const res = await fetch(`/api/rates/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Rate deleted successfully');
          fetchRates();
        } else {
          toast.error('Failed to delete rate');
        }
      } catch (error) {
        toast.error('Error connecting to server');
      }
    }
  };

  const handleEdit = (rate: Rate) => {
    setEditingRate(rate);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingRate(null);
    setShowModal(true);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Toaster position="top-right" richColors />
      <Sidebar />

      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="mb-2">Shipping Rate Management</h1>
              <p className="text-gray-600">Manage shipping rates for different routes</p>
            </div>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Rate
            </button>
          </div>

          {/* Rates Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Origin</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Destination</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Rate per KG</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Volumetric Rate</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">ETA</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rates.map((rate) => (
                    <tr key={rate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{rate.origin}</td>
                      <td className="px-6 py-4 text-gray-900">{rate.destination}</td>
                      <td className="px-6 py-4 text-gray-900">
                        Rp {rate.ratePerKg.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        Rp {rate.volumetricRate.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-gray-900">{rate.eta}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(rate)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(rate.id)}
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

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-8 max-w-md w-full">
                <h2 className="mb-6">{editingRate ? 'Edit Rate' : 'Add New Rate'}</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const payload: Rate = {
                      id: editingRate ? editingRate.id : Date.now().toString(),
                      origin: (fd.get('origin') as string) || editingRate?.origin || '',
                      destination: (fd.get('destination') as string) || editingRate?.destination || '',
                      ratePerKg: Number(fd.get('ratePerKg') || editingRate?.ratePerKg || 0),
                      volumetricRate: Number(fd.get('volumetricRate') || editingRate?.volumetricRate || 0),
                      eta: (fd.get('eta') as string) || editingRate?.eta || '',
                    };
                    try {
                      const url = editingRate ? `/api/rates/${editingRate.id}` : '/api/rates';
                      const method = editingRate ? 'PUT' : 'POST';
                      const res = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                      });
                      if (res.ok) {
                        toast.success('Rate saved successfully');
                        setShowModal(false);
                        fetchRates();
                      } else {
                        toast.error('Failed to save rate');
                      }
                    } catch (error) {
                      toast.error('Error connecting to server');
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-gray-700 mb-2">Origin City</label>
                    <input
                      name="origin"
                      type="text"
                      defaultValue={editingRate?.origin}
                      placeholder="Jakarta"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Destination City</label>
                    <input
                      name="destination"
                      type="text"
                      defaultValue={editingRate?.destination}
                      placeholder="Surabaya"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Rate per KG (Rp)</label>
                    <input
                      name="ratePerKg"
                      type="number"
                      defaultValue={editingRate?.ratePerKg}
                      placeholder="10000"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Volumetric Rate (Rp)</label>
                    <input
                      name="volumetricRate"
                      type="number"
                      defaultValue={editingRate?.volumetricRate}
                      placeholder="5000"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Estimated Time of Arrival</label>
                    <input
                      name="eta"
                      type="text"
                      defaultValue={editingRate?.eta}
                      placeholder="2-3 days"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                    >
                      Save Rate
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
