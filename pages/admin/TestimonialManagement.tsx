import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, Upload } from 'lucide-react';
import { toast, Toaster } from 'sonner@2.0.3';
import Sidebar from '../../components/admin/Sidebar';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  photo: string;
  message: string;
  rating: number;
  isActive: boolean;
}

export default function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      } else {
        toast.error('Failed to fetch testimonials');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Testimonial deleted successfully');
          fetchTestimonials();
        } else {
          toast.error('Failed to delete testimonial');
        }
      } catch (error) {
        toast.error('Error connecting to server');
      }
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingTestimonial(null);
    setShowModal(true);
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
        // If we are in the modal (editing or adding), update the form input value somehow
        // Or simpler: we can just use a state for the form photo if we wanted, 
        // but here we are using uncontrolled inputs with defaultValues.
        // We need to update the input field value manually or force re-render.
        // A better approach for the modal is to use controlled state for the form, 
        // but to keep it simple and consistent with the previous code style:
        const photoInput = document.querySelector('input[name="photo"]') as HTMLInputElement;
        if (photoInput) {
          photoInput.value = data.url;
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

  const handleToggleStatus = async (testimonial: Testimonial) => {
    try {
      const updated = { ...testimonial, isActive: !testimonial.isActive };
      const res = await fetch(`/api/testimonials/${testimonial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        toast.success(`Testimonial ${updated.isActive ? 'activated' : 'deactivated'}`);
        fetchTestimonials();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Toaster position="top-right" richColors />
      <Sidebar />

      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="mb-2">Testimonial Management</h1>
              <p className="text-gray-600">Manage customer testimonials and reviews</p>
            </div>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Testimonial
            </button>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="mb-1">{testimonial.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{testimonial.company}</p>
                      </div>
                      <button
                        onClick={() => handleToggleStatus(testimonial)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          testimonial.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {testimonial.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? 'fill-orange-500 text-orange-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.message}"</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-8 max-w-2xl w-full">
                <h2 className="mb-6">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget as HTMLFormElement;
                    const fd = new FormData(form);
                    const name = ((fd.get('name') as string) || editingTestimonial?.name || '').trim();
                    const message = ((fd.get('message') as string) || editingTestimonial?.message || '').trim();
                    const ratingVal = Number(fd.get('rating') || editingTestimonial?.rating || 5);
                    const isActive = fd.get('isActive') === 'on';

                    if (!name) {
                      toast.error('Nama pelanggan wajib diisi');
                      return;
                    }
                    if (!message) {
                      toast.error('Pesan testimonial wajib diisi');
                      return;
                    }
                    const rating = Math.min(5, Math.max(1, isNaN(ratingVal) ? 5 : ratingVal));
                    const payload: Testimonial = {
                      id: editingTestimonial?.id || Date.now().toString(),
                      name,
                      company: (fd.get('company') as string) || editingTestimonial?.company || '',
                      photo: (fd.get('photo') as string) || editingTestimonial?.photo || '',
                      message,
                      rating,
                      isActive
                    };
                    try {
                      const res = await fetch(
                        editingTestimonial ? `/api/testimonials/${payload.id}` : '/api/testimonials',
                        {
                          method: editingTestimonial ? 'PUT' : 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(payload),
                        }
                      );
                      if (res.ok) {
                        toast.success('Testimonial saved successfully');
                        setShowModal(false);
                        fetchTestimonials();
                      } else {
                        let msg = 'Failed to save testimonial';
                        try {
                          const err = await res.json();
                          msg = err.detail || err.error || msg;
                        } catch {}
                        toast.error(msg);
                      }
                    } catch (error) {
                      toast.error('Error connecting to server');
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Customer Name</label>
                      <input
                        name="name"
                        type="text"
                        defaultValue={editingTestimonial?.name}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Company Name</label>
                      <input
                        name="company"
                        type="text"
                        defaultValue={editingTestimonial?.company}
                        placeholder="PT. Example Corp"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Photo URL</label>
                    <div className="flex gap-2">
                      <input
                        name="photo"
                        type="text"
                        defaultValue={editingTestimonial?.photo}
                        placeholder="https://example.com/photo.jpg"
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
                  <div>
                    <label className="block text-gray-700 mb-2">Testimonial Message</label>
                      <textarea
                        name="message"
                        defaultValue={editingTestimonial?.message}
                        rows={4}
                        placeholder="Write the customer's testimonial here..."
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none resize-none"
                      />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Rating</label>
                      <select
                        name="rating"
                        defaultValue={editingTestimonial?.rating || 5}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                      >
                        <option value={5}>5 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={3}>3 Stars</option>
                        <option value={2}>2 Stars</option>
                        <option value={1}>1 Star</option>
                      </select>
                    </div>
                    <div className="flex items-center pt-8">
                       <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          name="isActive"
                          type="checkbox"
                          defaultChecked={editingTestimonial?.isActive ?? true}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Active Status</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                    >
                      Save Testimonial
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
