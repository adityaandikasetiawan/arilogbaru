import { useState, useEffect } from 'react';
import { Edit, Upload, Plus, Trash2 } from 'lucide-react';
import { toast, Toaster } from 'sonner@2.0.3';
import Sidebar from '../../components/admin/Sidebar';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  photo: string;
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      } else {
        toast.error('Failed to fetch services');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service: Service) => {
    setIsAdding(false);
    setEditingService(service);
    setShowModal(true);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingService({
      id: '',
      title: '',
      description: '',
      icon: '',
      photo: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Service deleted successfully');
        fetchServices();
      } else {
        toast.error('Failed to delete service');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        const data = await res.json();
        if (editingService) {
          setEditingService({ ...editingService, photo: data.url });
        }
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Toaster position="top-right" richColors />
      <Sidebar />

      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="mb-2">Services Management</h1>
              <p className="text-gray-600">Manage the core services offered by your company</p>
            </div>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="mb-4 h-40 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  {service.photo ? (
                    <img
                      src={service.photo}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">No Image</span>
                  )}
                </div>
                <h3 className="mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Icon: {service.icon}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="px-3 py-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {showModal && editingService && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="mb-6">{isAdding ? 'Add New Service' : 'Edit Service'}</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget as HTMLFormElement;
                    const formData = new FormData(form);
                    
                    const payload = {
                      id: isAdding ? Date.now().toString() : editingService.id,
                      title: (formData.get('title') as string) || '',
                      description: (formData.get('description') as string) || '',
                      icon: (formData.get('icon') as string) || '',
                      photo: (formData.get('photo') as string) || '',
                    };

                    try {
                      const url = isAdding ? '/api/services' : `/api/services/${payload.id}`;
                      const method = isAdding ? 'POST' : 'PUT';
                      
                      const res = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                      });
                      
                      if (res.ok) {
                        toast.success(`Service ${isAdding ? 'created' : 'updated'} successfully`);
                        setShowModal(false);
                        fetchServices();
                      } else {
                        toast.error(`Failed to ${isAdding ? 'create' : 'update'} service`);
                      }
                    } catch (error) {
                      toast.error('Error connecting to server');
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-gray-700 mb-2">Service Title</label>
                    <input
                      name="title"
                      type="text"
                      defaultValue={editingService.title}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editingService.description}
                      rows={4}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Icon Name</label>
                    <input
                      name="icon"
                      type="text"
                      defaultValue={editingService.icon}
                      placeholder="e.g., Package, Truck, Warehouse"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Photo URL</label>
                    <div className="flex gap-2">
                      <input
                        name="photo"
                        type="text"
                        value={editingService.photo}
                        onChange={(e) => setEditingService({ ...editingService, photo: e.target.value })}
                        placeholder="https://example.com/photo.jpg"
                        required
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                      />
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleUpload}
                          disabled={uploading}
                        />
                        <div className={`px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <Upload className="w-4 h-4" />
                          {uploading ? 'Uploading...' : 'Upload'}
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                    >
                      {isAdding ? 'Create Service' : 'Save Changes'}
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
