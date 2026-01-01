import { useState, useEffect } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { toast, Toaster } from 'sonner@2.0.3';
import Sidebar from '../../components/admin/Sidebar';
import LocationInput from '../../components/LocationInput';

interface Vendor {
  id: string;
  name: string;
  type: string;
  contactInfo: string;
  status: string;
}

export default function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const fetchVendors = async () => {
    try {
      const res = await fetch('/api/vendors');
      if (res.ok) {
        const data = await res.json();
        setVendors(data);
      } else {
        toast.error('Failed to fetch vendors');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleEdit = (vendor: Vendor) => {
    setIsAdding(false);
    setEditingVendor(vendor);
    setShowModal(true);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingVendor({
      id: '',
      name: '',
      type: 'Airline',
      contactInfo: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;
    try {
      const res = await fetch(`/api/vendors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Vendor deleted successfully');
        fetchVendors();
      } else {
        toast.error('Failed to delete vendor');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  const vendorTypes = ['Airline', 'Shipping Line', 'Trucking', 'Rail', 'Other'];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Toaster position="top-right" richColors />
      <Sidebar />

      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="mb-2">Vendor Management</h1>
              <p className="text-gray-600">Manage airlines, shipping lines, and other transport partners</p>
            </div>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Vendor
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Name</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Type</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Contact Info</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{vendor.name}</td>
                    <td className="px-6 py-4 text-gray-600">{vendor.type}</td>
                    <td className="px-6 py-4 text-gray-600">{vendor.contactInfo}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${vendor.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(vendor)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vendor.id)}
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

          {showModal && editingVendor && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-8 max-w-lg w-full">
                <h2 className="mb-6">{isAdding ? 'Add New Vendor' : 'Edit Vendor'}</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget as HTMLFormElement;
                    const formData = new FormData(form);
                    
                    const payload = {
                      id: isAdding ? undefined : editingVendor.id,
                      name: formData.get('name'),
                      type: formData.get('type'),
                      contactInfo: formData.get('contactInfo'),
                      status: formData.get('status'),
                    };

                    try {
                      const url = isAdding ? '/api/vendors' : `/api/vendors/${payload.id}`;
                      const method = isAdding ? 'POST' : 'PUT';
                      
                      const res = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                      });
                      
                      if (res.ok) {
                        toast.success(`Vendor ${isAdding ? 'created' : 'updated'} successfully`);
                        setShowModal(false);
                        fetchVendors();
                      } else {
                        toast.error(`Failed to ${isAdding ? 'create' : 'update'} vendor`);
                      }
                    } catch (error) {
                      toast.error('Error connecting to server');
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-gray-700 mb-2">Vendor Name</label>
                    <input
                      name="name"
                      type="text"
                      defaultValue={editingVendor.name}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Type</label>
                    <select
                      name="type"
                      defaultValue={editingVendor.type}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                    >
                      {vendorTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <LocationInput
                      label="Address / Contact Info"
                      name="contactInfo"
                      defaultValue={editingVendor.contactInfo}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      defaultValue={editingVendor.status}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                    >
                      {isAdding ? 'Create Vendor' : 'Save Changes'}
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
